// pages/api/generate-hashtags.js

import fetch from "node-fetch";
import { buildHashtagPrompt } from "../../lib/promptTemplates";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product = "", audience = "", language = "English" } = req.body || {};

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY missing" });
  }

  try {
    // Build prompt using centralized prompt engine
    const prompt = buildHashtagPrompt({
      product,
      audience,
      language,
      count: 12,
    });

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You generate highly relevant social media hashtags. Output ONLY hashtags.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_completion_tokens: 80,
      top_p: 1.0,
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
        error: "No output from Groq",
        raw: data,
      });
    }

    // Clean output (remove newlines, ensure no commentary)
    const clean = output
      .replace(/[\n\r]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return res.status(200).json({ hashtags: clean, raw: data });
  } catch (err) {
    console.error("Hashtag API error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
