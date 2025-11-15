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
    const u = form.useCase;

    if (field === "offer") return ["ad", "whatsapp", "sms"].includes(u);
    if (field === "audience") return ["ad", "caption", "product"].includes(u);
    if (field === "keywords")
      return ["caption", "google", "reelhook", "hashtags"].includes(u);
    if (field === "rewrite") return u === "rewrite";

    return u !== "rewrite";
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
    if (!res.ok) setError(data.error);
    else setOutput(data.output);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">VernAI — Multi-Use Generator</h1>

      <select
        name="useCase"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="ad">Ad Copy</option>
        <option value="caption">Social Media Caption</option>
        <option value="whatsapp">WhatsApp Message</option>
        <option value="google">Google Ads</option>
        <option value="product">Product Description</option>
        <option value="sms">SMS Message</option>
        <option value="youtube">YouTube Titles</option>
        <option value="reelhook">Reel/TikTok Hooks</option>
        <option value="hashtags">Hashtag Sets</option>
        <option value="rewrite">Rewrite Text</option>
      </select>

      {show("businessName") && (
        <input
          name="businessName"
          placeholder="Business Name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {show("product") && (
        <input
          name="product"
          placeholder="Product / Service / Topic"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {show("offer") && (
        <input
          name="offer"
          placeholder="Offer (e.g., 50% OFF)"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {show("audience") && (
        <input
          name="audience"
          placeholder="Audience"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {show("keywords") && (
        <input
          name="keywords"
          placeholder="Keywords / Hashtags"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      )}

      {show("rewrite") && (
        <textarea
          name="textToRewrite"
          placeholder="Paste text"
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
        ></textarea>
      )}

      <div className="grid grid-cols-2 gap-2">
        <select
          name="language"
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Hinglish</option>
        </select>

        <select
          name="tone"
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option>Professional</option>
          <option>Friendly</option>
          <option>Exciting</option>
          <option>Trustworthy</option>
          <option>Bold</option>
          <option>Youthful</option>
        </select>
      </div>

      <button
        onClick={generate}
        className="w-full bg-black text-white p-3 rounded"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {output && (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
