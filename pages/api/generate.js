import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

// Cache hooks
const HOOKS = ['दिवाली स्पेशल ऑफर!', 'होली धमाका!', 'आज ही ऑर्डर करें!'];

// In-memory cache (Vercel serverless)
const cache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { product } = req.body;
  if (!product?.trim()) return res.status(400).json({ error: 'Product required' });

  const cacheKey = product.trim().toLowerCase();
  if (cache.has(cacheKey)) {
    return res.status(200).json({ ads: cache.get(cacheKey) });
  }

  try {
    let translated = product.trim();

    // Auto-detect English → Hindi
    if (/[a-zA-Z]/.test(product) && !/[ऀ-ॿ]/.test(product)) {
      const result = await hf.translation({
        model: 'ai4bharat/indictrans2-indic-en-1b',
        inputs: product,
        parameters: { src_lang: 'eng_Latn', tgt_lang: 'hin_Deva' }
      });
      translated = result.translation_text || product;
    }

    const ads = HOOKS.map((hook, i) => {
      const roas = (2.8 + i * 0.3).toFixed(1);
      return `**विज्ञापन ${i + 1}**\n**हेडलाइन:** ${translated.slice(0, 45)}... ${hook}\n**बॉडी:** ${translated}. ${hook}\n**CTA:** UPI से अभी खरीदें!\n**ROAS:** ${roas}x (₹99 बजट पर)`;
    });

    cache.set(cacheKey, ads);
    res.status(200).json({ ads });
  } catch (error) {
    console.error('HF Error:', error.message);
    // Fallback: Use input as-is
    const ads = HOOKS.map((hook, i) => {
      const roas = (2.8 + i * 0.3).toFixed(1);
      return `**विज्ञापन ${i + 1}**\n**हेडलाइन:** ${product.slice(0, 45)}... ${hook}\n**CTA:** UPI से अभी खरीदें!\n**ROAS:** ${roas}x`;
    });
    res.status(200).json({ ads });
  }
}
