import { useState } from "react";

export default function AIAdGenerator() {
  // NEW: Smart mode state
  const [smartMode, setSmartMode] = useState(true);
  const [smartForm, setSmartForm] = useState({
    product: "",
    adCategory: "ugc",
    businessName: "",
    offer: "",
    cta: "",
    audience: "",
    language: "English",
    tone: "Professional",
  });

  // OLD: Keep existing state
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
  const [productData, setProductData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSmartChange = (e) => {
    setSmartForm({ ...smartForm, [e.target.name]: e.target.value });
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

  const generateSmart = async () => {
    if (!smartForm.product.trim()) {
      setError("Please enter a product (even just 1 word!)");
      return;
    }

    setError("");
    setOutput("");
    setProductData(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smartForm),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
      } else {
        setOutput(data.output);
        setProductData(data.productData); // Show extracted data
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const generateLegacy = async () => {
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
    else setOutput(data.output || data.ads?.[0]);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">VernAI — AI Ad Generator</h1>

      {/* MODE TOGGLE */}
      <div className="flex gap-4 p-4 bg-gray-100 rounded-lg">
        <button
          onClick={() => setSmartMode(true)}
          className={`px-4 py-2 rounded ${
            smartMode ? "bg-black text-white" : "bg-white"
          }`}
        >
          🚀 Smart Mode (1-word → Ad)
        </button>
        <button
          onClick={() => setSmartMode(false)}
          className={`px-4 py-2 rounded ${
            !smartMode ? "bg-black text-white" : "bg-white"
          }`}
        >
          📝 Classic Mode
        </button>
      </div>

      {/* SMART MODE UI */}
      {smartMode && (
        <div className="space-y-4 p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h2 className="text-xl font-semibold">⚡ Smart Ad Generator</h2>
          <p className="text-sm text-gray-600">
            Just type 1-3 words (like "laptop" or "gym membership") and our AI will do the rest!
          </p>

          {/* Product Input - MAIN */}
          <div>
            <label className="block font-medium mb-1">Product/Service *</label>
            <input
              name="product"
              value={smartForm.product}
              onChange={handleSmartChange}
              placeholder="e.g., laptop, shoes, gym, pizza"
              className="w-full p-3 border-2 border-blue-300 rounded-lg text-lg"
            />
          </div>

          {/* Ad Category - MAIN */}
          <div>
            <label className="block font-medium mb-1">Ad Style *</label>
            <select
              name="adCategory"
              value={smartForm.adCategory}
              onChange={handleSmartChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="ugc">🎥 UGC (User Testimonial)</option>
              <option value="productDemo">📱 Product Demo</option>
              <option value="problemSolution">💡 Problem → Solution</option>
            </select>
          </div>

          {/* Optional Fields */}
          <details className="border p-4 rounded">
            <summary className="cursor-pointer font-medium">
              Optional: Customize Further
            </summary>
            <div className="mt-4 space-y-3">
              <input
                name="businessName"
                value={smartForm.businessName}
                onChange={handleSmartChange}
                placeholder="Business name (optional)"
                className="w-full p-2 border rounded"
              />
              <input
                name="offer"
                value={smartForm.offer}
                onChange={handleSmartChange}
                placeholder="Offer (e.g., 50% OFF)"
                className="w-full p-2 border rounded"
              />
              <input
                name="cta"
                value={smartForm.cta}
                onChange={handleSmartChange}
                placeholder="CTA (e.g., Buy Now)"
                className="w-full p-2 border rounded"
              />
              <input
                name="audience"
                value={smartForm.audience}
                onChange={handleSmartChange}
                placeholder="Target audience (auto-detected if empty)"
                className="w-full p-2 border rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="language"
                  value={smartForm.language}
                  onChange={handleSmartChange}
                  className="p-2 border rounded"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                </select>

                <select
                  name="tone"
                  value={smartForm.tone}
                  onChange={handleSmartChange}
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
            </div>
          </details>

          <button
            onClick={generateSmart}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "🤖 AI is thinking..." : "✨ Generate Smart Ad"}
          </button>
        </div>
      )}

      {/* CLASSIC MODE UI (keep your existing form) */}
      {!smartMode && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Classic Generator</h2>

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
            onClick={generateLegacy}
            className="w-full bg-black text-white p-3 rounded"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
          {error}
        </div>
      )}

      {/* OUTPUT */}
      {output && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Generated Ad:</h3>
            <pre className="whitespace-pre-wrap font-sans">{output}</pre>
          </div>

          {/* Show extracted product data in smart mode */}
          {productData && smartMode && (
            <details className="p-4 bg-gray-100 rounded">
              <summary className="cursor-pointer font-medium">
                🧠 AI Extracted This About Your Product:
              </summary>
              <div className="mt-2 text-sm space-y-1">
                <p><strong>Category:</strong> {productData.category}</p>
                <p><strong>Pain Points:</strong> {productData.painPoints.join(', ')}</p>
                <p><strong>Benefits:</strong> {productData.benefits.join(', ')}</p>
                <p><strong>Target Audience:</strong> {productData.targetAudience.join(', ')}</p>
              </div>
            </details>
          )}

          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              alert('Copied to clipboard!');
            }}
            className="w-full bg-gray-200 hover:bg-gray-300 p-2 rounded"
          >
            📋 Copy Ad
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ **Testing the System**

### Test 1: Simple Product
```
Product: laptop
Category: UGC
Click Generate
→ Should create authentic user testimonial
```

### Test 2: Service
```
Product: gym
Category: Problem → Solution
Click Generate
→ Should create pain-point driven ad
```

### Test 3: Food
```
Product: pizza
Category: Product Demo
Click Generate
→ Should showcase features/benefits
