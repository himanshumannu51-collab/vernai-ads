// pages/api/generate-cta.js

import fetch from "node-fetch";
import { buildCTAPrompt } from "../../lib/promptTemplates";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product = "", audience = "", tone = "Default" } = req.body || {};

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY missing" });
  }

  try {
    const prompt = buildCTAPrompt({
      product,
      audience,
      tone,
      count: 10,
    });

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You generate extremely short, high-converting call-to-action lines.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 80,
    };

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return res
        .status(502)
        .json({ error: "Groq upstream error", detail: text });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "";

    if (!output) {
      return res.status(500).json({
        error: "No output from AI",
        raw: data,
      });
    }

    // Split CTAs line-by-line
    const ctas = output
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 1);

    return res.status(200).json({ ctas, raw: data });
  } catch (err) {
    console.error("CTA API error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
