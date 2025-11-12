import { useState } from 'react';
import AdCard from '../components/AdCard';

export default function Home() {
  const [product, setProduct] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('default');
  const [budget, setBudget] = useState(99);

  const templates = [
    { id: 'default', name: 'Standard Ad' },
    { id: 'ugc', name: 'UGC Video' },
    { id: 'carousel', name: 'Carousel' },
    { id: 'story', name: 'Story Ad' }
  ];

  const generate = async () => {
    if (!product.trim()) return alert('Enter product!');
    setLoading(true);
    setAds([]);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, template, budget })
      });
      if (!res.ok) throw new Error('API fail');
      const { ads: newAds } = await res.json();
      setAds(newAds);
    } catch (err) {
      console.error(err);
      alert('Retry—check HF token!');
    }
    setLoading(false);
  };

  const copyAll = () => {
    const text = ads.map(ad => ad.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    alert('Copied for Meta/WhatsApp!');
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">AI Generating...</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
            VernAI Ads
          </h1>
          <p className="text-gray-600 text-xl">5 Hindi FB Ads in 30 sec • AI-Powered • Free</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 grid md:grid-cols-3 gap-4">
          <textarea
            placeholder="Product desc (Hindi/English): eco-friendly water bottle, BPA free"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="md:col-span-2 p-5 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none"
            rows={3}
          />
          <div className="space-y-4">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full p-3 border rounded-xl">
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              placeholder="Budget ₹"
              className="w-full p-3 border rounded-xl"
            />
          </div>
          <button
            onClick={generate}
            disabled={!product.trim()}
            className="md:col-span-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50"
          >
            Generate & Score
          </button>
        </div>

        {ads.length > 0 && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Generated Ads (Avg Score: {Math.round(ads.reduce((sum, ad) => sum + ad.score, 0) / ads.length)}/100)</h2>
              <button onClick={copyAll} className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold">Export A/B Pack</button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad, i) => <AdCard key={i} ad={ad} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
