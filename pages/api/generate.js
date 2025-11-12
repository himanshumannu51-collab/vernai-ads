import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN || 'fallback');
const cache = new Map();

const TEMPLATES = {
  default: ['{product} – Festival Special! {feature}', '50% Off {product} via UPI'],
  ugc: ['Real User: Loving {product}! 🎥 {feature}', 'UGC Alert: {product} Review'],
  carousel: ['Slide 1: {product} Benefits', 'Slide 2: {feature} Spotlight'],
  story: ['Swipe for {product} Magic! {feature}']
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { product, template = 'default', budget = 99 } = req.body;
  if (!product) return res.status(400).json({ error: 'Product needed' });

  const key = `${product.toLowerCase()}-${template}`;
  if (cache.has(key)) return res.json({ ads: cache.get(key) });

  try {
    let text = product;
    if (/[a-z]{3,}/.test(product) && !/[\u0900-\u097F]/.test(product)) {
      const { translation_text } = await hf.translation({
        model: 'ai4bharat/indictrans2-indic-en-1b',
        inputs: product,
        parameters: { src_lang: 'eng_Latn', tgt_lang: 'hin_Deva' }
      });
      text = translation_text || product;
    }

    const feature = text.includes('BPA') ? 'BPA Free' : 'Eco Premium';
    const hooks = TEMPLATES[template];
    const ads = hooks.slice(0, 5).map((hook, i) => {
      const adText = hook.replace('{product}', text.split(',')[0]).replace('{feature}', feature);
      const score = 60 + Math.floor(Math.random() * 40);
      const video = template === 'ugc' ? true : false;
      return {
        type: `${template.charAt(0).toUpperCase() + template.slice(1)} Ad ${i+1}`,
        text: `**Headline:** ${adText}\n**Body:** Get ${text} now!\n**CTA:** UPI Buy!\n**ROAS:** ${(2 + i * 0.5).toFixed(1)}x on ₹${budget}`,
        score,
        video
      };
    });

    cache.set(key, ads);
    res.json({ ads });
  } catch (e) {
    res.json({ ads: [{ type: 'Fallback', text: 'Quick Ad: Buy Now! Score: 50', score: 50 }] });
  }
}
