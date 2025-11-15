// pages/api/generate-ads.js

import { buildPrompt } from "../../lib/promptTemplates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    description,
    audience,
    tone,
    platform,
    templateId = "short",
    keywords = "",
    variations = 1,
  } = req.body || {};

  if (!description?.trim()) {
    return res.status(400).json({ error: "Product description is required" });
  }

  const variationCount = Math.max(1, Math.min(Number(variations) || 1, 10));

  try {
    const prompts = Array.from({ length: variationCount }).map((_, i) =>
      buildPrompt({
        description,
        audience,
        tone,
        platform,
        templateId,
        keywords,
        variationIndex: i,
        variationCount,
      })
    );

    const responses = await Promise.all(
      prompts.map(async (prompt) => {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                  { role: "system", content: "You are a world-class ad copywriter." },
                  { role: "user", content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 300,
              }),
            }
          );

          if (!response.ok) {
            return `ERROR: Groq ${response.status}`;
          }

          const data = await response.json();
          const output = data.choices?.[0]?.message?.content?.trim() || "";
          return output;
        } catch (err) {
          return `ERROR: ${err.message}`;
        }
      })
    );

    return res.status(200).json({ ads: responses });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
