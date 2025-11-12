import { pipeline } from '@huggingface/inference';

const hf = pipeline('text2text-generation', 'ai4bharat/indictrans2-indic-en-1b', {
  token: process.env.HF_TOKEN // Add your HF token in Vercel
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { product, language = 'hi', budget = 99 } = req.body;

  if (!product) return res.status(400).json({ error: 'Product required' });

  let translated = product;
  if (language === 'en') {
    translated = (await hf(product, { src_lang: 'eng_Latn', tgt_lang: 'hin_Deva' }))[0].generated_text;
  }

  const hooks = ["दिवाली स्पेशल ऑफर!", "होली धमाका!", "आज ही ऑर्डर करें!"];
  const ads = [];

  for (let i = 0; i < 5; i++) {
    const hook = hooks[i % hooks.length];
    const roas = (2.5 + i * 0.3 + budget / 100).toFixed(1);
    const ad = `**विज्ञापन ${i+1}**\n**हेडलाइन:** ${translated.slice(0, 50)}... ${hook}\n**बॉडी:** ${translated}. ${hook}\n**CTA:** UPI से पेमेंट करें → अभी खरीदें!\n**अनुमानित ROAS:** ${roas}x (₹${budget} बजट पर)`;
    ads.push(ad);
  }

  res.status(200).json({ ads });
}
