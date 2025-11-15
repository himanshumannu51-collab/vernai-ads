import { useState } from "react";

export default function Generate() {
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("English");
  const [ads, setAds] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAds = async () => {
    setLoading(true);
    setAds("");

    try {
      const res = await fetch("/api/generate-ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          audience,
          language,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setAds("⚠️ Error: " + data.error);
      } else {
        setAds(data.ads);
      }
    } catch (err) {
      console.error("Frontend Error:", err);
      setAds("❌ Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Generate Ads (Groq AI)</h1>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Product</label>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Example: Hair Oil"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Audience</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Example: Moms, Students, Men age 20–35"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Hinglish</option>
            <option>Tamil</option>
            <option>Telugu</option>
            <option>Marathi</option>
            <option>Bengali</option>
          </select>
        </div>

        <button
          onClick={generateAds}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold"
        >
          {loading ? "Generating..." : "Generate Ads"}
        </button>

        {ads && (
          <div className="mt-6 whitespace-pre-wrap bg-gray-50 p-4 rounded border">
            {ads}
          </div>
        )}
      </div>
    </div>
  );
}
