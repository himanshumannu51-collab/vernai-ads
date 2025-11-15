// pages/api/generate-cta.js

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { description } = req.body || {};

  if (!description?.trim())
    return res.status(400).json({ error: "Description required" });

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
            { role: "system", content: "Generate short, punchy CTAs." },
            { role: "user", content: description },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: `Groq error ${response.status}` });
    }

    const data = await response.json();
    const output =
      data.choices?.[0]?.message?.content?.trim() || "No CTA returned";

    const ctas = output
      .split("\n")
      .map((c) => c.replace(/^\d+[\).\s]*/, "").trim())
      .filter(Boolean);

    return res.status(200).json({ cta: ctas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
