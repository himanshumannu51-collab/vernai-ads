export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product, audience, language } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ Missing GROQ_API_KEY");
    return res.status(500).json({ error: "Server misconfigured" });
  }

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
          model: "llama-3.3-70b-versatile",  // ✅ CORRECT MODEL
          messages: [
            {
              role: "system",
              content:
                "You generate high-converting ad copies for Indian brands in all languages.",
            },
            {
              role: "user",
              content: `Generate 5 ad variations for:
Product: ${product}
Audience: ${audience}
Language: ${language}`,
            },
          ],
          temperature: 0.8,
          max_completion_tokens: 500, // ✅ CORRECT PARAM
        }),
      }
    );

    const data = await response.json();
    console.log("🔍 Groq raw response:", JSON.stringify(data, null, 2));

    const output = data?.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({
        error: "No output from AI",
        groqResponse: data, // send raw response to debug
      });
    }

    return res.status(200).json({ ads: output });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return res.status(500).json({ error: "Server Error" });
  }
}
