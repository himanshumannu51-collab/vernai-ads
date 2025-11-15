// pages/api/generate-ads.js
import fetch from "node-fetch";
import promptLib from "../../lib/promptTemplates";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    product = "",
    audience = "",
    language = "English",
    template = "Facebook Ad",
    tone = "Default",
    variations = 5,
    booster = false,
    competitor = "",
    brandVoice = "",
  } = req.body || {};

  // Basic validation
  const n = parseInt(variations, 10) || 1;
  if (n < 1 || n > 20) {
    return res.status(400).json({ error: "variations must be between 1 and 20" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  try {
    // Build prompt using centralized prompt builder
    const prompt = promptLib.buildAdPrompt({
      template,
      product,
      audience,
      language,
      tone,
      variations: n,
      brandVoice,
      booster,
      competitor,
    });

    // Recommend max tokens
    const recommended = promptLib.recommendMaxTokens({ template, variations: n });

    // Prepare request body for Groq
    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a helpful assistant that writes high-converting marketing copy." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_completion_tokens: recommended,
      top_p: 1.0,
    };

    // Call Groq
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    // If non-2xx, return debug info
    if (!response.ok) {
      const text = await response.text();
      console.error("Groq non-200:", response.status, text);
      return res.status(502).json({ error: "Upstream error from Groq", status: response.status, detail: text });
    }

    const data = await response.json();

    // Defensive checks
    const rawContent = data?.choices?.[0]?.message?.content || "";
    if (!rawContent || rawContent.trim().length === 0) {
      return res.status(500).json({ error: "No output from AI", raw: data });
    }

    // Split reliably on delimiter. Prompt builder uses "### Variation 1:" pattern.
    // Accept multiple split patterns to be robust.
    const splitPatterns = [/### Variation\s*\d+:?/i, /Variation\s*\d+:?/i, /\n-{3,}\n/, /\n\n+/];
    let parts = [];

    // Try the canonical delimiter first
    if (/### Variation/i.test(rawContent)) {
      parts = rawContent
        .split(/### Variation\s*\d+:?/i)
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      // fallback split using newlines double-break
      parts = rawContent
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // If parts length doesn't match requested n, try a looser split and then cut to n
    if (parts.length < n) {
      const alt = rawContent
        .split(/\n-+\n|•|-\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (alt.length >= n) parts = alt.slice(0, n);
    }

    // Final fallback: return the whole output as a single variation
    if (parts.length === 0) {
      parts = [rawContent.trim()];
    }

    // Trim and ensure we have at most n items
    const items = parts.slice(0, n).map((p) => p.trim());

    // Return structured result
    return res.status(200).json({
      ads: items,
      meta: {
        variationsRequested: n,
        variationsReturned: items.length,
        recommendedMaxTokens: recommended,
      },
      raw: data, // include raw for debugging (remove in prod or behind debug flag)
    });
  } catch (err) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
