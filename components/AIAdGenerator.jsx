// components/AIAdGenerator.jsx
import { useState } from "react";

export default function AIAdGenerator() {
  const [form, setForm] = useState({
    useCase: "ad",
    businessName: "",
    product: "",
    audience: "",
    offer: "",
    cta: "",
    keywords: "",
    textToRewrite: "",
    language: "English",
    tone: "Professional",
  });

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const show = (field) => {
    const uc = form.useCase;

    if (field === "offer") return ["ad", "whatsapp", "sms"].includes(uc);
    if (field === "audience") return ["ad", "caption", "product"].includes(uc);
    if (field === "keywords") return ["caption", "google", "reelhook", "hashtags"].includes(uc);
    if (field === "rewrite") return uc === "rewrite";

    return uc !== "rewrite";
  };

  const generate = async () => {
    setError("");
    setOutput("");
    setLoading(true);

    const res = await fetch("/api/generate-ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) setError(data.error || "Something went wrong");
    else setOutput(data.output);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">VernAI — Multi Use Text Generator</h1>

      <select name="useCase" onChange={handleChange} className="w-full border p-2 rounded">
        <option value="ad">Ad Copy</option>
        <option value="caption">Social Media Caption</option>
        <option value="whatsapp">WhatsApp Message</option>
        <option value="google">Google Ad</option>
        <option value="product">Product Description</option>
        <option value="sms">SMS Message</option>
        <option value="youtube">YouTube Titles</option>
        <option value="reelhook">Reel/TikTok Hooks</option>
        <option value="hashtags">Hashtag Sets</option>
        <option value="rewrite">Rewrite Text</option>
      </select>

      {show("businessName") && (
        <input name="businessName" placeholder="Business Name" onChange={handleChange}
               className="w-full p-2 border rounded" />
      )}

      {show("product") && (
        <input name="product" placeholder="Product / Service / Topic" onChange={handleChange}
               className="w-full p-2 border rounded" />
      )}

      {show("offer") && (
        <input name="offer" placeholder="Offer (e.g., 50% OFF)" onChange={handleChange}
               className="w-full p-2 border rounded" />
      )}

      {show("audience") && (
        <input name="audience" placeholder="Target Audience" onChange={handleChange}
               className="w-full p-2 border rounded" />
      )}

      {show("keywords") && (
        <input name="keywords" placeholder="Keywords / Hashtag ideas" onChange={handleChange}
               className="w-full p-2 border rounded" />
      )}

      {show("rewrite") && (
        <textarea name="textToRewrite" placeholder="Paste text to rewrite"
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-32" />
      )}

      {/* Language + Tone */}
      <div className="grid grid-cols-2 gap-2">
        <select name="language" onChange={handleChange} className="border p-2 rounded">
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
        </select>

        <select name="tone" onChange={handleChange} className="border p-2 rounded">
          <option>Professional</option>
          <option>Friendly</option>
          <option>Exciting</option>
          <option>Trustworthy</option>
          <option>Bold</option>
          <option>Youthful</option>
        </select>
      </div>

      <button onClick={generate}
              className="bg-black text-white p-3 rounded w-full">
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && (<div className="bg-red-200 text-red-700 p-2 rounded">{error}</div>)}

      {output && (
        <pre className="bg-gray-100 p-3 whitespace-pre-wrap rounded">
          {output}
        </pre>
      )}
    </div>
  );
}
