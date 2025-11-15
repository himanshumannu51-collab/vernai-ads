@@ -1,61 +1,104 @@
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { product, audience, language } = req.body;

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ Missing GROQ_API_KEY");
    return res.status(500).json({ error: "Server misconfigured" });
  }

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
          model: "llama-3.3-70b-versatile",  // ✅ CORRECT MODEL
          messages: [
            {
              role: "system",
              content:
                "You generate high-converting ad copies for Indian brands in all languages.",
            },
            {
              role: "user",
              content: `Generate 5 ad variations for:
Product: ${product}
Audience: ${audience}
Language: ${language}`,
            },
          ],
          temperature: 0.8,
          max_completion_tokens: 500, // ✅ CORRECT PARAM
        }),
      }
    );
import { useState } from "react";

    const data = await response.json();
    console.log("🔍 Groq raw response:", JSON.stringify(data, null, 2));
export default function Generate() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("English");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

    const output = data?.choices?.[0]?.message?.content;
  const generateAds = async () => {
    setLoading(true);
    setAds([]);

    if (!output) {
      return res.status(500).json({
        error: "No output from AI",
        groqResponse: data, // send raw response to debug
    try {
      const res = await fetch("/api/generate-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, audience, language }),
      });

      const data = await res.json();
      if (data.error) {
        setAds([{ headline: "Error", description: data.error }]);
      } else {
        const cleaned = data.ads
          .split(/\*\*Ad Variation|Ad Variation|\n|\r/)
          .filter((t) => t.trim().length > 0)
          .map((block) => ({ description: block.trim() }));
        setAds(cleaned);
      }
    } catch (err) {
      setAds([{ headline: "Error", description: "Something went wrong" }]);
    }

    return res.status(200).json({ ads: output });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return res.status(500).json({ error: "Server Error" });
  }
    setLoading(false);
  };

  const copyText = (text) => navigator.clipboard.writeText(text);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-6 text-blue-700">VernAI Ads</h1>
      <p className="text-gray-600 mb-10 text-lg text-center max-w-2xl">
        Generate high‑converting ad copy instantly using Groq AI
      </p>

      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl">
        <label className="font-semibold">Product</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Example: Car, Perfume, Shoes"
        />

        <label className="font-semibold">Audience</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Students, Moms, Men 20‑35"
        />

        <label className="font-semibold">Language</label>
        <select
          className="w-full p-2 border rounded mb-6"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
          <option>Tamil</option>
          <option>Marathi</option>
          <option>Bengali</option>
        </select>

        <button
          onClick={generateAds}
          className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Ads"}
        </button>
      </div>

      <div className="mt-10 w-full max-w-3xl grid grid-cols-1 gap-6">
        {ads.map((ad, index) => (
          <div
            key={index}
            className="bg-white shadow-lg p-6 rounded-xl border border-gray-200"
          >
            <p className="whitespace-pre-wrap text-gray-800 mb-4 text-lg">{ad.description}</p>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
              onClick={() => copyText(ad.description)}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
