// lib/promptTemplates.js
// Centralized prompt builders for VernAI
// Exports helper functions to build prompts for ads, hashtags, CTAs, rewrites, persona, UGC, bulk
//
// Usage:
// import { buildAdPrompt, buildHashtagPrompt } from '../lib/promptTemplates'
// const prompt = buildAdPrompt({ template: 'Facebook Ad', product: 'Shoes', audience: 'Students', language: 'English', tone: 'Friendly', variations: 5, brandVoice: '...' })

/**
 * NOTES:
 * - We instruct the model to output delimited variations using "### Variation n:" — frontend will split on this.
 * - Keep prompts explicit and minimal to control tokens. If variations increases, caller should increase max_completion_tokens accordingly.
 * - Use `brandVoice` to keep consistent style across calls.
 */

const TEMPLATES = [
  "Facebook Ad",
  "Instagram Caption",
  "Google Search Ad",
  "YouTube Script",
  "LinkedIn Promo",
  "Twitter/X Post",
  "WhatsApp Marketing",
  "Sales Email",
  "Short SMS Ad",
  "Landing Page Headline",
  "Landing Page Subheadline",
  "Tagline Generator",
  "Call-to-Action Lines",
  "Benefits List",
  "Features List",
  "Hashtag Pack",
  "Storytelling Ad",
  "Luxury Tone Ad",
  "Problem-Solution Ad",
  "UGC Script",
];

const TONE_PRESETS = {
  Default: "",
  Friendly: "Use a warm, conversational tone with contractions and friendly words.",
  Professional: "Use a formal, professional tone; concise and credible.",
  Luxury: "Use premium language, elegant words, exclusivity cues.",
  Aggressive: "Use urgent, high-energy, attention-grabbing language.",
  Emotional: "Use emotional triggers and empathy; focus on feelings and benefits.",
  Funny: "Use light humor and witty lines while staying respectful.",
  Minimal: "Keep it extremely short and to-the-point; minimal words.",
  Motivational: "Use motivational, action-oriented language.",
};

function sanitizeText(s) {
  if (!s) return "";
  return String(s).trim();
}

/**
 * Auto-prompt booster: expands a tiny input into a structured brief.
 * Returns a short expansion that can be injected into the ad prompt.
 */
export function buildBooster({ product, audience }) {
  const p = sanitizeText(product);
  const a = sanitizeText(audience);

  // Lightweight, token-efficient booster
  const bullets = [
    p ? `Product summary: ${p}.` : "",
    a ? `Target: ${a}.` : "",
    p ? `Top benefits (short): ${inferBenefits(p)}.` : "",
    `Top hooks: fast result, clear benefit, social proof.`,
    `Important keywords: ${inferKeywords(p || a)}.`,
  ]
    .filter(Boolean)
    .join(" ");

  return bullets;
}

/**
 * Some naive token-efficient keyword/benefit heuristics — lightweight, works well for short boosters.
 * (These are intentionally small helpers to keep prompts better without large token cost.)
 */
function inferBenefits(productName) {
  if (!productName) return "improves life, saves time";
  const lower = productName.toLowerCase();
  if (lower.includes("oil") || lower.includes("serum")) return "nourishes, strengthens, natural";
  if (lower.includes("shoes")) return "comfortable, durable, stylish";
  if (lower.includes("travel")) return "convenience, affordability, curated";
  if (lower.includes("course") || lower.includes("learn")) return "practical, results, step-by-step";
  return "high quality, great value";
}

function inferKeywords(text) {
  if (!text) return "best, discount, new";
  const words = text
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""));
  return words.join(", ") || "best, new";
}

/**
 * Build the "instructions" block for tone + brand voice + formatting
 */
function buildStyleInstructions({ tone = "Default", language = "English", brandVoice = "" }) {
  const toneInstr = TONE_PRESETS[tone] || TONE_PRESETS.Default;
  const langInstr = language && language.toLowerCase() !== "english" ? `Write in ${language}.` : "";
  const brandInstr = brandVoice ? `Preserve brand voice: ${brandVoice}.` : "";

  return [toneInstr, langInstr, brandInstr].filter(Boolean).join(" ");
}

/**
 * Build ad prompt.
 * options:
 *  - template: string (one of TEMPLATES)
 *  - product, audience, language
 *  - tone
 *  - variations: integer
 *  - brandVoice: optional saved voice string
 *  - booster: boolean (inject booster expansion)
 *  - competitor: optional competitor brand string to mimic
 */
export function buildAdPrompt({
  template = "Facebook Ad",
  product = "",
  audience = "",
  language = "English",
  tone = "Default",
  variations = 5,
  brandVoice = "",
  booster = false,
  competitor = "",
}) {
  product = sanitizeText(product);
  audience = sanitizeText(audience);
  template = sanitizeText(template);
  language = sanitizeText(language);
  tone = sanitizeText(tone);
  competitor = sanitizeText(competitor);

  const style = buildStyleInstructions({ tone, language, brandVoice });
  const boosterText = booster ? buildBooster({ product, audience }) : "";

  // Delimiter instruction for stable parsing
  const delimiter = "### Variation";

  // Platform-specific format hints
  const formatHint = platformFormatHint(template);

  // Competitor style: emulate but don't imitate illegal copy; use "in the style of" instruction.
  const competitorInstr = competitor ? `Write in a style similar to ${competitor}, without using any trademarked slogans.` : "";

  const header = [
    `You are a high-quality ad copywriter focused on conversion.`,
    `Template: ${template}.`,
    product ? `Product: ${product}.` : "",
    audience ? `Audience: ${audience}.` : "",
    style,
    competitorInstr,
    boosterText ? `Booster: ${boosterText}` : "",
    formatHint,
    `Produce exactly ${variations} distinct ad variations. Start each with "${delimiter} 1:", "${delimiter} 2:", etc. Do NOT add any commentary or explanation.`,
    `Only output the variations and nothing else.`,
  ]
    .filter(Boolean)
    .join(" ");

  return header;
}

/**
 * Platform-format hints to help the model structure output.
 */
function platformFormatHint(template) {
  switch ((template || "").toLowerCase()) {
    case "facebook ad":
      return "Format each variation as: Headline (short) - Body (1-2 sentences) - CTA (one short line).";
    case "instagram caption":
      return "Format each variation as: Caption (1-3 lines) + optional hashtags line (comma separated). Keep it engaging.";
    case "google search ad":
      return "Format each variation as: Headline 1 (<=30 chars); Headline 2 (<=30 chars); Headline 3 (optional) ; Description 1 (<=90 chars).";
    case "youtube script":
      return "Format each variation as a short script: Hook (1 line), Body (3-5 lines), CTA (1 line).";
    case "sales email":
      return "Format as: Subject line / Preview text / Email body (short) / CTA.";
    case "landing page headline":
      return "Output a single catchy headline for a landing hero.";
    case "tagline generator":
      return "Output 5-10 very short taglines (one per line).";
    case "hashtag pack":
      return "Output 12 hashtags separated by spaces or commas; include a mix of niche and broad tags.";
    case "ugc script":
      return "Output a short UGC-style script: Hook / Scene directions / Dialogue / CTA.";
    default:
      return "Write concise, high-converting ad copy appropriate for the selected template.";
  }
}

/**
 * Hashtag prompt builder
 */
export function buildHashtagPrompt({ product = "", audience = "", language = "English", count = 12 }) {
  const p = sanitizeText(product);
  const a = sanitizeText(audience);
  const lang = sanitizeText(language);
  return [
    `Generate ${count} relevant hashtags for a social post about ${p || "this product"} targeted at ${a || "the audience"} in ${lang}.`,
    "Provide only hashtags separated by spaces. Use a mix of broad and niche tags and include local-language tags when appropriate.",
  ].join(" ");
}

/**
 * CTA prompt builder (returns many CTAs)
 */
export function buildCTAPrompt({ product = "", audience = "", tone = "Default", count = 10 }) {
  const style = TONE_PRESETS[tone] || "";
  return [
    `Generate ${count} short, high-converting call-to-action (CTA) lines for: ${product}.`,
    style,
    "Each CTA should be 2-5 words. Output one per line and no extra commentary.",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Rewrite / improve prompt
 */
export function buildRewritePrompt({ originalText = "", instruction = "Make it punchier and shorter", tone = "Default" }) {
  const style = TONE_PRESETS[tone] || "";
  return [
    `Rewrite the following ad copy according to the instruction: ${instruction}.`,
    style,
    `Original: ${originalText}`,
    "Output the rewritten version only.",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Persona generator prompt — lightweight buyer persona
 */
export function buildPersonaPrompt({ product = "", audience = "" }) {
  return [
    `Generate a concise buyer persona for the product: ${product}.`,
    audience ? `Target audience: ${audience}.` : "",
    `Include: Name (persona), age range, top 3 pain points, top 3 desires, interests, 1 sentence pitching angle.`,
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * UGC script prompt builder
 */
export function buildUGCPrompt({ product = "", audience = "", length = "short" }) {
  return [
    `Create a ${length} UGC-style social media script for ${product}, targeted at ${audience}.`,
    "Include: 1-line hook, 3 scene directions or beat lines, 1 dialogue line the creator says, and a CTA.",
    "Keep it authentic and casual.",
  ].join(" ");
}

/**
 * Bulk prompt builder: single entry prompt template used for iterating over CSV rows.
 * Keep this compact (lower tokens) because it will be called many times.
 */
export function buildBulkPrompt({ template = "Facebook Ad", product = "", audience = "", tone = "Default", brandVoice = "" }) {
  const formatHint = platformFormatHint(template);
  const style = buildStyleInstructions({ tone, brandVoice });
  return [
    `Template: ${template}. Product: ${product}. Audience: ${audience}.`,
    style,
    formatHint,
    "Output only the ad content, one short variation. No extra text.",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Utility: recommended max tokens calculation based on variations & template
 * - base tokens: 120
 * - per variation: 80 (adjust if you want longer outputs)
 */
export function recommendMaxTokens({ template = "Facebook Ad", variations = 5 }) {
  const base = 120;
  const perVariation = 80; // conservative
  // Some templates need longer per-variation (YouTube script)
  const longTemplates = ["youtube script", "sales email", "ugc script"];
  const lowerTemplate = (template || "").toLowerCase();
  const multiplier = longTemplates.includes(lowerTemplate) ? 1.6 : 1.0;
  return Math.ceil((base + perVariation * variations) * multiplier);
}

/**
 * Expose lists for UI usage
 */
export function listTemplates() {
  return TEMPLATES.slice();
}
export function listTones() {
  return Object.keys(TONE_PRESETS);
}

export default {
  buildAdPrompt,
  buildHashtagPrompt,
  buildCTAPrompt,
  buildRewritePrompt,
  buildPersonaPrompt,
  buildUGCPrompt,
  buildBulkPrompt,
  recommendMaxTokens,
  listTemplates,
  listTones,
};
