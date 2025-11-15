// pages/api/generate-ads.js
import { extractProduct } from "../../lib/productExtractor";
import { getCategoryPrompt } from "../../lib/adCategories";
import { buildPrompt } from "../../lib/promptTemplates";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    // NEW: Smart extraction fields
    product, // This is the 1-word input
    adCategory, // ugc, productDemo, problemSolution
    
    // OLD: Keep existing fields for backward compatibility
    description,
    audience,
    tone,
    platform,
    templateId = "short",
    keywords = "",
    variations = 1,
    
    // Additional fields
    businessName,
    offer,
    cta,
    language = "English",
  } = req.body || {};

  // SMART MODE: If product + adCategory exist, use new system
  if (product && adCategory) {
    try {
      // Step 1: Extract product intelligence
      const productData = extractProduct(product);
      
      if (!productData) {
        return res.status(400).json({ error: "Could not process product" });
      }

      // Step 2: Build smart prompt using category
      const smartPrompt = getCategoryPrompt(adCategory, productData, {
        businessName,
        audience: audience || productData.targetAudience[0],
        tone: tone || "Professional",
        language: language || "English",
        offer,
        cta,
      });

      if (!smartPrompt) {
        return res.status(400).json({ error: "Invalid ad category" });
      }

      // Step 3: Call AI with smart prompt
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: "You are a world-class ad copywriter specializing in authentic, high-converting ads.",
              },
              { role: "user", content: smartPrompt },
            ],
            temperature: 0.8,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const adCopy = data.choices?.[0]?.message?.content?.trim() || "";

      return res.status(200).json({
        output: adCopy,
        productData, // Send back extracted data for debugging
        mode: 'smart'
      });
      
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // LEGACY MODE: Use old system if no product+category
  if (!description?.trim()) {
    return res.status(400).json({ error: "Product description is required" });
  }

  const variationCount = Math.max(1, Math.min(Number(variations) || 1, 10));

  try {
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

    const responses = await Promise.all(
      prompts.map(async (prompt) => {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                  {
                    role: "system",
                    content: "You are a world-class ad copywriter.",
                  },
                  { role: "user", content: prompt },
                ],
                temperature: 0.8,
                max_tokens: 300,
              }),
            }
          );

          if (!response.ok) {
            return `ERROR: Groq ${response.status}`;
          }

          const data = await response.json();
          const output = data.choices?.[0]?.message?.content?.trim() || "";
          return output;
        } catch (err) {
          return `ERROR: ${err.message}`;
        }
      })
    );

    return res.status(200).json({ ads: responses, mode: 'legacy' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
