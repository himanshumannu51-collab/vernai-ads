// pages/api/generate-ads.js
import { buildPrompt } from '../../lib/promptTemplates';

const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.ai/v1/generate';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function callGroq(prompt) {
  // Adjust body shape to the exact Groq API contract for your account.
  // This is a flexible example — adapt model name / payload based on your Groq plan.
  const body = {
    model: 'llama-3.3-70b-versatile',
    input: prompt,
    // optional parameters:
    max_tokens: 200,
    temperature: 0.8,
  };

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Groq API error: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();

  // Try to flexibly extract the generated text from common shapes
  // NOTE: adapt this to match the exact shape your Groq response uses.
  // Common fields to check:
  // - data.output[0].content
  // - data.choices[0].text
  // - data.result or data.text
  let out = null;
  if (data.output && Array.isArray(data.output) && data.output[0]) {
    // some Groq variants return [{content: '...'}]
    const first = data.output[0];
    out = first.content || first.text || JSON.stringify(first);
  } else if (data.choices && data.choices[0]) {
    out = data.choices[0].message?.content || data.choices[0].text;
  } else if (data.text) {
    out = data.text;
  } else if (data.result) {
    out = data.result;
  } else {
    out = JSON.stringify(data);
  }

  return String(out).trim();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { description, audience, tone, platform, templateId = 'short', keywords = '', variations = 1 } =
      req.body || {};

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'description is required' });
    }

    const variationCount = Math.max(1, Math.min(Number(variations) || 1, 10));

    // Build prompts for each variation
    const prompts = Array.from({ length: variationCount }).map((_, i) =>
      buildPrompt({
        description,
        audience,
        tone,
        platform,
        templateId,
        keywords,
        variationIndex: i,
        variationCount,
      })
    );

    // Run requests in parallel (but if you expect strict rate limits you can do sequential)
    const responses = await Promise.all(
      prompts.map((p) =>
        callGroq(p).catch((err) => {
          // Return a readable fallback error per variation (so UI can show which failed)
          console.error('Groq call failed for a prompt:', err);
          return `ERROR_GENERATION: ${err.message || 'unknown error'}`;
        })
      )
    );

    // Clean responses (remove leading/trailing whitespace)
    const ads = responses.map((r) => String(r).trim());

    return res.status(200).json({ ads });
  } catch (err) {
    console.error('generate-ads error', err);
    return res.status(500).json({ error: err.message || 'internal error' });
  }
}
