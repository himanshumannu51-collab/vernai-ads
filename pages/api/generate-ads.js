// pages/api/generate-ads.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product, audience, language } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY missing");
    return res.status(500).json({ error: "Server config error" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You generate high-converting ad copies for Indian brands in multiple languages."
          },
          {
            role: "user",
            content: `Generate 5 ad variations for:
Product: ${product}
Audience: ${audience}
Language: ${language}`
          }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("Groq Response:", data);

    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ error: "No output from AI" });
    }

    return res.status(200).json({ ads: output });

  } catch (err) {
    console.error("❌ API Error:", err);
    return res.status(500).json({ error: "Failed to generate ads" });
  }
}
