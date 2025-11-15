// lib/promptTemplates.js
export const templates = {
  aida: {
    id: 'aida',
    label: 'AIDA (Attention → Interest → Desire → Action)',
    instr: `Write a short ad using the AIDA structure: Attention (hook), Interest (benefits), Desire (social proof or emotional pull), Action (CTA). Keep it concise and platform-appropriate.`,
  },
  pas: {
    id: 'pas',
    label: 'PAS (Problem → Agitate → Solve)',
    instr: `Write a PAS ad: identify the problem, agitate the pain slightly, offer the product/service as the solution with one clear CTA.`,
  },
  short: {
    id: 'short',
    label: 'Short (1-2 lines)',
    instr: `Write a very short (1-2 lines) high-impact ad with a hook and CTA. Ideal for quick social captions.`,
  },
  long: {
    id: 'long',
    label: 'Long (detailed)',
    instr: `Write a longer ad (3-6 sentences) that explains benefits and features and includes a persuasive CTA.`,
  },
  story: {
    id: 'story',
    label: 'Story-style',
    instr: `Write a short story-style ad that opens with a relatable scene, leads to the product, and ends with a strong CTA.`,
  },
  testimonial: {
    id: 'testimonial',
    label: 'Testimonial-style',
    instr: `Write an ad that reads like a customer testimonial. Include a short name/role and highlight one big benefit.`,
  },
};

function sanitize(str = '') {
  return String(str).trim();
}

/**
 * Build a single prompt string for the model using inputs and chosen template.
 */
export function buildPrompt({
  description,
  audience,
  tone,
  platform,
  templateId,
  keywords,
  variationIndex = 0,
  variationCount = 1,
}) {
  const desc = sanitize(description);
  const aud = sanitize(audience);
  const kw = sanitize(keywords);
  const tpl = templates[templateId] ? templates[templateId].instr : templates.short.instr;

  // Platform-specific instructions
  const platformNote = platform ? `Platform: ${platform}. Tailor length and style for ${platform}.` : '';

  // Tone note
  const toneNote = tone ? `Tone: ${tone}.` : '';

  // Variation guidance
  const variationNote =
    variationCount > 1
      ? `This is variation ${variationIndex + 1} of ${variationCount}. Keep each variation distinct.`
      : '';

  // Keywords inclusion
  const keywordsNote = kw ? `Include or naturally mention these keywords if relevant: ${kw}.` : '';

  const prompt = `
You are a world-class ad copywriter for social ads. Generate 1 ad based on the inputs below.

${tpl}

Description: ${desc}
Audience: ${aud}
${platformNote}
${toneNote}
${keywordsNote}
${variationNote}

Output requirements:
- Output only the ad copy text (no tags, no numbering).
- Keep it ready-to-paste. If a CTA is appropriate, include it.
- Keep to a natural tone and avoid overuse of emojis unless the tone is "Casual" or "Playful".
`;

  return prompt.trim();
}
