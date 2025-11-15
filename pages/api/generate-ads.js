import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.MY_OPENAI_KEY,
});

const SYSTEM_PROMPT = `
You are VernAI — India's multi-use AI text engine.
Always return clean, formatted, ready-to-use output.
Templates:
1) ad → 5 ads: Headline, Body, CTA
2) caption → 5 captions + emojis + hashtags
3) whatsapp → 3 messages (offer/follow-up/reminder)
4) google → 5 headlines + 3 descriptions
5) product → bullets + long description
6) sms → 3 SMS (<160 chars)
7) youtube → 10 titles + 1 SEO description
8) reelhook → 10 hooks
9) hashtags → 3 sets of 15 hashtags
10) rewrite → improve + rewrite text
`;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;

    let userPrompt = `
Use-case: ${data.useCase}
Language: ${data.language}
Tone: ${data.tone}

Input Data:
${JSON.stringify(data, null, 2)}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    res.status(200).json({
      output: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: "AI Failed", detail: err.message });
  }
}
