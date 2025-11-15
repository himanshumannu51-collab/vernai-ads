// pages/api/generate-ads.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// These are the "training" templates and instructions the model will use as system context.
const SYSTEM_PROMPT = `
You are VernAI — a high-performance ad & short-text generator for small businesses and creators.
Follow these rules for every response:
- Always respect requested language and tone.
- Output must be cleanly formatted and readable.
- For list outputs, number items (1., 2., 3.) or label sections (Headline:, Body:, CTA:).
- Do not output extra commentary or meta text. Only the requested outputs.
- If user asked for hashtags or emojis, include them.
- For each use-case below follow the given mini-template.

Templates:
1) "ad" (Ad Copy): Produce 5 ad variations. Format each as:
1) Headline: ...
   Body: ...
   CTA: ...
Include short hashtags or emojis if appropriate.

2) "caption" (Social Caption): Produce 5 captions. Each caption on its own line. Add hashtags & emojis. Provide one short and one long for each if possible.

3) "whatsapp": Produce 3 short, natural WhatsApp messages: Offer message, Follow-up, Reminder. Keep conversational and <160 chars.

4) "google": Produce 5 headlines (<=30 chars) and 3 descriptions (<=90 chars). Label 'Headlines:' then bullet list, 'Descriptions:' then list.

5) "product": Provide:
- Short bullets (3-6 bullets)
- Long persuasive paragraph
Label sections 'Bullets:' and 'Long:'.

6) "sms": Produce 3 x SMS messages (<=160 chars). Number them.

7) "youtube": Produce 10 clicky titles and 1 SEO friendly description. Label 'Titles:' and 'Description:'.

8) "reelhook": Produce 10 scroll-stopping one-line hooks. Number them.

9) "hashtags": Produce 3 sets of 15 hashtags related to the product/keywords.

10) "rewrite": Improve and rewrite the given text to be clearer, punchier, and in requested tone. Keep meaning same.

If any required input is missing, politely return a one-line error message explaining the missing field.
`;


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
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
    } = body;

    // Basic server-side validation
    if (!useCase) return res.status(400).json({ error: "useCase is required" });

    // Build the user prompt dynamically based on use case
    let userPrompt = `Use-case: ${useCase}\nLanguage: ${language}\nTone: ${tone}\n\n`;

    if (useCase === "ad") {
      if (!businessName || !product || !offer) {
        return res.status(400).json({ error: "For 'ad' please provide businessName, product, and offer." });
      }
      userPrompt += `Business: ${businessName}\nProduct: ${product}\nAudience: ${audience}\nOffer: ${offer}\nCTA: ${cta || "Order Now"}\n\nTask: Generate 5 high-converting ad variations using the ad template.`;
    } else if (useCase === "caption") {
      if (!product) return res.status(400).json({ error: "For 'caption' please provide product." });
      userPrompt += `Product: ${product}\nAudience: ${audience}\nKeywords: ${keywords}\n\nTask: Create 5 captions (short/long variants), include hashtags & emojis.`;
    } else if (useCase === "whatsapp") {
      if (!businessName || !offer) {
        return res.status(400).json({ error: "For 'whatsapp' please provide businessName and offer." });
      }
      userPrompt += `Business: ${businessName}\nOffer: ${offer}\nAudience: ${audience}\n\nTask: Create 3 WhatsApp messages: Offer, Follow-up, Reminder.`;
    } else if (useCase === "google") {
      userPrompt += `Product: ${product}\nKeywords: ${keywords}\n\nTask: Produce 5 headlines (<=30 chars) and 3 descriptions (<=90 chars).`;
    } else if (useCase === "product") {
      if (!product) return res.status(400).json({ error: "For 'product' please provide product." });
      userPrompt += `Product: ${product}\nAudience: ${audience}\n\nTask: Provide bullets and a persuasive long description.`;
    } else if (useCase === "sms") {
      if (!businessName || !offer) return res.status(400).json({ error: "For 'sms' provide businessName and offer." });
      userPrompt += `Business: ${businessName}\nOffer: ${offer}\n\nTask: Write 3 SMS messages (<=160 chars).`;
    } else if (useCase === "youtube") {
      if (!product) return res.status(400).json({ error: "For 'youtube' provide product/topic." });
      userPrompt += `Topic: ${product}\n\nTask: Generate 10 titles and 1 long SEO description.`;
    } else if (useCase === "reelhook") {
      if (!keywords) return res.status(400).json({ error: "For 'reelhook' provide a topic in keywords." });
      userPrompt += `Topic: ${keywords}\n\nTask: Generate 10 scroll-stopping hook lines.`;
    } else if (useCase === "hashtags") {
      if (!product && !keywords) return res.status(400).json({ error: "For 'hashtags' provide product or keywords." });
      userPrompt += `Product: ${product}\nKeywords: ${keywords}\n\nTask: Generate 3 sets of 15 hashtags.`;
    } else if (useCase === "rewrite") {
      if (!textToRewrite) return res.status(400).json({ error: "For 'rewrite' provide textToRewrite." });
      userPrompt += `Text: """${textToRewrite}"""\n\nTask: Rewrite and improve while keeping meaning.`;
    } else {
      return res.status(400).json({ error: "Unknown useCase" });
    }

    // Combine system + user into messages array so model "knows" the templates (this is training via prompt engineering)
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    // Call OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",     // change model if needed
      messages,
      temperature: 0.85,
      max_tokens: 1200,
    });

    const output = completion.choices?.[0]?.message?.content || "";

    res.status(200).json({ output });
  } catch (err) {
    console.error("generate-ads error:", err);
    res.status(500).json({ error: "AI generation failed", detail: String(err) });
  }
}
