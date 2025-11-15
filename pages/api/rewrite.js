// pages/api/rewrite.js

import fetch from "node-fetch";
import { buildRewritePrompt } from "../../lib/promptTemplates";

const GROQ_API_URL = "https://api/groq.com/openai/v1/chat/completions";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text = "", instruction = "Improve this copy", tone = "Default" } = req.body || {};

  if (!text || text.trim().length < 3) {
    return res.status(400).json({ error: "Text is required to rewrite" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY missing" });
  }

  try {
    const prompt = buildRewritePrompt({
      originalText: text,
      instruction,
      tone,
    });

    const body = {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are an expert ad copy editor." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_completion_tokens: 150,
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
      const detail = await response.text();
      return res
        .status(502)
        .json({ error: "Groq upstream error", status: response.status, detail });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "";

    if (!output) {
      return res.status(500).json({ error: "No rewrite output", raw: data });
    }

    return res.status(200).json({ rewritten: output.trim(), raw: data });
  } catch (err) {
    console.error("Rewrite API error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
}
