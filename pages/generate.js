// pages/generate.js
import { useState } from 'react';
import { templates } from '../lib/promptTemplates';

export default function GeneratePage() {
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [platform, setPlatform] = useState('Instagram');
  const [templateId, setTemplateId] = useState('short');
  const [variations, setVariations] = useState(3);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [error, setError] = useState(null);

  async function handleGenerate(e) {
    e?.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError('Please enter a product or service description.');
      return;
    }

    setLoading(true);
    setAds([]);

    try {
      const body = { description, audience, tone, platform, templateId, keywords, variations };
      const res = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  }

  function copyText(text) {
    if (!navigator.clipboard) return alert('Clipboard not supported');
    navigator.clipboard.writeText(text);
    // minimal toast
    const n = document.createElement('div');
    n.innerText = 'Copied!';
    n.className = 'fixed right-4 bottom-6 bg-black text-white px-3 py-2 rounded shadow';
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 1400);
  }

  function copyAll() {
    const all = ads.join('\n\n---\n\n');
    copyText(all);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">VernAI — Ads Generator</h1>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <label className="block">
              <div className="text-sm font-medium mb-1">Product / Service description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full p-3 rounded border bg-white dark:bg-gray-800"
                placeholder="Describe your product in 1-3 sentences..."
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label>
                <div className="text-sm font-medium mb-1">Target audience</div>
                <input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800"
                  placeholder="e.g. busy parents, gym-goers..."
                />
              </label>

              <label>
                <div className="text-sm font-medium mb-1">Keywords (optional)</div>
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full p-2 rounded border bg-white dark:bg-gray-800"
                  placeholder="weight loss, keto, sustainable"
                />
              </label>
            </div>
          </div>

          <aside className="space-y-4">
            <label>
              <div className="text-sm font-medium mb-1">Tone</div>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800">
                <option>Professional</option>
                <option>Casual</option>
                <option>Emotional</option>
                <option>Bold</option>
                <option>Playful</option>
              </select>
            </label>

            <label>
              <div className="text-sm font-medium mb-1">Platform</div>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800">
                <option>Instagram</option>
                <option>Facebook</option>
                <option>YouTube</option>
                <option>Google</option>
                <option>LinkedIn</option>
              </select>
            </label>

            <label>
              <div className="text-sm font-medium mb-1">Template</div>
              <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full p-2 rounded border bg-white dark:bg-gray-800">
                {Object.values(templates).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <div className="text-sm font-medium mb-1">Variations: {variations}</div>
              <input type="range" min="1" max="5" value={variations} onChange={(e) => setVariations(Number(e.target.value))} />
            </label>

            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded">
                {loading ? 'Generating...' : 'Generate Ads'}
              </button>
              <button type="button" onClick={copyAll} disabled={!ads.length} className="px-4 py-2 border rounded">
                Copy All
              </button>
            </div>

            {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          </aside>
        </form>

        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        <section>
          <h2 className="text-xl font-medium mb-3">Results</h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded bg-white dark:bg-gray-800">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {!loading && !ads.length && (
            <div className="text-sm text-gray-500">No results yet — generate to see ads.</div>
          )}

          <div className="grid gap-4 mt-4">
            {ads.map((ad, idx) => (
              <div key={idx} className="p-4 border rounded bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 whitespace-pre-wrap">{ad}</div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => copyText(ad)} className="text-sm px-2 py-1 border rounded">Copy</button>
                    <button onClick={() => {
                      // Small rewrite example - sends the ad back to the API with template short and variations 1 to rewrite.
                      const rewritePrompt = {
                        description: ad,
                        audience: '',
                        tone: 'Professional',
                        platform,
                        templateId: 'short',
                        keywords: '',
                        variations: 1
                      };
                      // simple rewrite flow — open in new tab or call endpoint (optional)
                      navigator.clipboard.writeText(ad);
                    }} className="text-sm px-2 py-1 border rounded">Rewrite (copy)</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
