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
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  // simple helper to conditionally render fields
  const showField = (field) => {
    const { useCase } = form;
    if (field === "offer") return ["ad", "whatsapp", "sms"].includes(useCase);
    if (field === "audience") return ["ad", "caption", "product"].includes(useCase);
    if (field === "keywords") return ["caption", "google", "reelhook", "hashtags"].includes(useCase);
    if (field === "textToRewrite") return useCase === "rewrite";
    return true;
  };

  const generate = async () => {
    setError("");
    setOutput("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Generation failed");
      } else {
        setOutput(data.output || "");
      }
    } catch (err) {
      console.error(err);
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    alert("Copied to clipboard");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">VernAI — Multi Use Text Generator</h2>

      <label className="block">
        <span className="text-sm">Use Case</span>
        <select name="useCase" value={form.useCase} onChange={handleChange} className="w-full p-2 border rounded mt-1">
          <option value="ad">Ad Copy (Facebook/Instagram)</option>
          <option value="caption">Social Media Caption</option>
          <option value="whatsapp">WhatsApp Message</option>
          <option value="google">Google Ad Headlines</option>
          <option value="product">Product Description</option>
          <option value="sms">SMS Text Message</option>
          <option value="youtube">YouTube Titles + Description</option>
          <option value="reelhook">Reel/TikTok Hook Lines</option>
          <option value="hashtags">Hashtag Sets</option>
          <option value="rewrite">Rewrite / Improve Text</option>
        </select>
      </label>

      {showField("businessName") && (
        <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" className="w-full p-2 border rounded" />
      )}

      {showField("product") && (
        <input name="product" value={form.product} onChange={handleChange} placeholder="Product / Service / Topic" className="w-full p-2 border rounded" />
      )}

      {showField("offer") && (
        <input name="offer" value={form.offer} onChange={handleChange} placeholder="Offer (e.g., 50% off)" className="w-full p-2 border rounded" />
      )}

      {showField("audience") && (
        <input name="audience" value={form.audience} onChange={handleChange} placeholder="Target Audience (optional)" className="w-full p-2 border rounded" />
      )}

      {showField("keywords") && (
        <input name="keywords" value={form.keywords} onChange={handleChange} placeholder="Keywords / Hashtag ideas / Topic" className="w-full p-2 border rounded" />
      )}

      {showField("textToRewrite") && (
        <textarea name="textToRewrite" value={form.textToRewrite} onChange={handleChange} placeholder="Paste text to rewrite" className="w-full p-3 border rounded h-32" />
      )}

      <div className="grid grid-cols-2 gap-2">
        <select name="language" value={form.language} onChange={handleChange} className="p-2 border rounded">
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
        </select>

        <select name="tone" value={form.tone} onChange={handleChange} className="p-2 border rounded">
          <option>Professional</option>
          <option>Friendly</option>
          <option>Exciting</option>
          <option>Trustworthy</option>
          <option>Bold</option>
          <option>Youthful</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} disabled={loading} className="bg-black text-white px-4 py-2 rounded">
          {loading ? "Generating..." : "Generate"}
        </button>

        <button onClick={copyAll} disabled={!output} className="border px-4 py-2 rounded">
          Copy All
        </button>
      </div>

      {error && <div className="text-red-600 bg-red-50 p-2 rounded">{error}</div>}

      {output && (
        <div>
          <h3 className="font-semibold">Output</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded mt-2">{output}</pre>
        </div>
      )}
    </div>
  );
}
