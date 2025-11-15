// pages/api/generate-ads.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt (training)
const SYSTEM_PROMPT = `
You are VernAI — India's multi-use AI text engine.
Always produce clean, structured, ready-to-use results.
Never explain. Never break format.
Follow templates:

1) ad → 5 ads: Headline, Body, CTA
2) caption → 5 captions + emojis + hashtags
3) whatsapp → 3 messages: Offer, Follow-up, Reminder
4) google → 5 headlines (<=30 chars) + 3 descriptions (<=90 chars)
5) product → bullet points + long description
6) sms → 3 SMS (<160 chars)
7) youtube → 10 titles + 1 SEO description
8) reelhook → 10 short hook lines
9) hashtags → 3 sets of 15 hashtags
10) rewrite → rewrite text in same meaning but improved
`;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const {
      useCase,
      businessName = "",
      product = "",
      audience = "",
      offer = "",
      cta = "",
      keywords = "",
      textToRewrite = "",
      language = "English",
      tone = "Professional",
    } = req.body;

    if (!useCase)
      return res.status(400).json({ error: "useCase is required" });

    // Build the final user prompt
    let userPrompt = `Use-case: ${useCase}\nLanguage: ${language}\nTone: ${tone}\n\n`;

    switch (useCase) {
      case "ad":
        if (!businessName || !product || !offer)
          return res.status(400).json({ error: "businessName, product & offer required" });

        userPrompt += `
Business: ${businessName}
Product: ${product}
Audience: ${audience}
Offer: ${offer}
CTA: ${cta || "Order Now"}

Task: Generate 5 ads.
`;
        break;

      case "caption":
        userPrompt += `
Product: ${product}
Keywords: ${keywords}
Audience: ${audience}

Task: 5 captions with emojis + hashtags.
`;
        break;

      case "whatsapp":
        userPrompt += `
Business: ${businessName}
Offer: ${offer}

Task: 3 WhatsApp messages (Offer / Follow-up / Reminder)
`;
        break;

      case "google":
        userPrompt += `
Product: ${product}
Keywords: ${keywords}

Task: 5 headlines + 3 descriptions
`;
        break;

      case "product":
        userPrompt += `
Product: ${product}
Audience: ${audience}

Task: bullet points + long description
`;
        break;

      case "sms":
        userPrompt += `
Business: ${businessName}
Offer: ${offer}

Task: 3 SMS (<160 chars)
`;
        break;

      case "youtube":
        userPrompt += `
Topic: ${product}

Task: 10 titles + 1 SEO description
`;
        break;

      case "reelhook":
        userPrompt += `
Topic: ${keywords}

Task: 10 hook lines
`;
        break;

      case "hashtags":
        userPrompt += `
Product: ${product}
Keywords: ${keywords}

Task: 3 sets of hashtags
`;
        break;

      case "rewrite":
        if (!textToRewrite)
          return res.status(400).json({ error: "textToRewrite required" });

        userPrompt += `
Text: """${textToRewrite}"""
Task: Rewrite + improve but same meaning
`;
        break;

      default:
        return res.status(400).json({ error: "Invalid useCase" });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 1500,
    });

    const output = completion.choices?.[0]?.message?.content || "";

    return res.status(200).json({ output });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "AI failed", detail: error.message });
  }
}
