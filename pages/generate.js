import { useState } from "react";

export default function Generate() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("English");
  const [template, setTemplate] = useState("Facebook Ad");
  const [tone, setTone] = useState("Default");
  const [variations, setVariations] = useState(5);
  const [competitor, setCompetitor] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [booster, setBooster] = useState(true);

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState("");

  // =============================
  // Generate Ads
  // =============================
  const generateAds = async () => {
    setLoading(true);
    setAds([]);

    const res = await fetch("/api/generate-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product,
        audience,
        language,
        template,
        tone,
        variations,
        booster,
        competitor,
        brandVoice,
      }),
    });

    const data = await res.json();
    if (data.error) {
      setAds([{ description: data.error }]);
    } else {
      setAds(data.ads);
    }
    setLoading(false);
  };

  // =============================
  // Hashtag Generator
  // =============================
  const generateHashtags = async () => {
    const res = await fetch("/api/generate-hashtags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product, audience, language }),
    });

    const data = await res.json();
    setHashtags(data?.hashtags || "");
  };

  // =============================
  // Export All Ads
  // =============================
  const exportAll = () => {
    const content = ads.map((a, i) => `Ad ${i + 1}:\n${a}\n\n`).join("");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vernai_ads.txt";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-4 text-blue-700">VernAI Generator</h1>
      <p className="text-gray-600 mb-10 text-lg text-center max-w-2xl">
        Generate highly-optimized ads using Templates, Tone, Variations & AI Booster.
      </p>

      {/* FORM CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-2xl">

        <label className="font-semibold">Product</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="Shoes, Perfume, Travel Package..."
        />

        <label className="font-semibold">Audience</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="Example: Students, Moms, Men 20-35"
        />

        <label className="font-semibold">Language</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
          <option>Tamil</option>
          <option>Marathi</option>
          <option>Gujarati</option>
          <option>Bengali</option>
        </select>

        {/* TEMPLATE SELECTOR */}
        <label className="font-semibold">Template</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
        >
          <option>Facebook Ad</option>
          <option>Instagram Caption</option>
          <option>Google Search Ad</option>
          <option>YouTube Script</option>
          <option>LinkedIn Promo</option>
          <option>Twitter/X Post</option>
          <option>WhatsApp Marketing</option>
          <option>Sales Email</option>
          <option>Short SMS Ad</option>
          <option>Landing Page Headline</option>
          <option>Landing Page Subheadline</option>
          <option>Tagline Generator</option>
          <option>Call-to-Action Lines</option>
          <option>Benefits List</option>
          <option>Features List</option>
          <option>Hashtag Pack</option>
          <option>Storytelling Ad</option>
          <option>Luxury Tone Ad</option>
          <option>Problem-Solution Ad</option>
          <option>UGC Script</option>
        </select>

        {/* TONE SELECTOR */}
        <label className="font-semibold">Tone</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option>Default</option>
          <option>Friendly</option>
          <option>Professional</option>
          <option>Luxury</option>
          <option>Aggressive</option>
          <option>Emotional</option>
          <option>Funny</option>
          <option>Minimal</option>
          <option>Motivational</option>
        </select>

        {/* VARIATIONS */}
        <label className="font-semibold">Number of Variations</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={variations}
          onChange={(e) => setVariations(e.target.value)}
        >
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={8}>8</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>

        {/* ADVANCED OPTIONS */}
        <label className="font-semibold">Competitor Style (optional)</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={competitor}
          onChange={(e) => setCompetitor(e.target.value)}
          placeholder="Example: Nike, Zara, Apple..."
        />

        <label className="font-semibold">Brand Voice Memory (optional)</label>
        <input
          className="w-full p-2 border rounded mb-4"
          value={brandVoice}
          onChange={(e) => setBrandVoice(e.target.value)}
          placeholder="Example: minimal, modern, premium masculine…"
        />

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={booster}
            onChange={() => setBooster(!booster)}
          />
          <label>Auto Prompt Booster (recommended)</label>
        </div>

        <button
          onClick={generateAds}
          className="w-full bg-blue-600 text-white p-3 rounded-xl text-lg font-semibold mb-3"
        >
          {loading ? "Generating..." : "Generate Ads"}
        </button>

        <button
          onClick={generateHashtags}
          className="w-full bg-gray-800 text-white p-3 rounded-xl text-lg"
        >
          Generate Hashtags
        </button>
      </div>

      {/* EXPORT */}
      {ads.length > 0 && (
        <button
          onClick={exportAll}
          className="mt-6 bg-black text-white px-6 py-3 rounded-xl"
        >
          Download All Ads
        </button>
      )}

      {/* HASHTAGS */}
      {hashtags && (
        <div className="mt-6 w-full max-w-2xl bg-white p-4 rounded-xl shadow border">
          <h3 className="font-bold mb-2">Hashtags</h3>
          <p>{hashtags}</p>
        </div>
      )}

      {/* OUTPUT */}
      <div className="mt-10 w-full max-w-3xl grid grid-cols-1 gap-6">
        {ads.map((text, index) => (
          <div
            key={index}
            className="bg-white shadow-lg p-6 rounded-xl border border-gray-200"
          >
            <p className="whitespace-pre-wrap text-gray-800 mb-4 text-lg">
              {text}
            </p>
            <button
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
              onClick={() => navigator.clipboard.writeText(text)}
            >
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
