import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      businessName,
      product,
      audience,
      language,
      tone,
      offer,
      cta,
    } = req.body;

    const prompt = `
Generate 5 short, catchy, high-converting advertising texts in ${language}.
Tone: ${tone}

Business Name: ${businessName}
Product/Service: ${product}
Target Audience: ${audience}
Special Offer: ${offer}
CTA: ${cta || "Shop Now"}

Format:
1.
2.
3.
4.
5.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    const output = completion.choices[0].message.content;

    res.status(200).json({ ads: output });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Failed to generate ads" });
  }
}
