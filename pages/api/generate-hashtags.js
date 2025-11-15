// pages/api/generate-hashtags.js

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
            { role: "system", content: "Generate 20 trending hashtags for social media." },
            { role: "user", content: description },
          ],
          temperature: 0.7,
          max_tokens: 120,
        }),
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: `Groq error ${response.status}` });
    }

    const data = await response.json();
    const output =
      data.choices?.[0]?.message?.content?.trim() || "No hashtags returned";

    const tags = output
      .replace(/\n/g, " ")
      .split(/\s+/)
      .filter((w) => w.startsWith("#"));

    return res.status(200).json({ hashtags: tags });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
