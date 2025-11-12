import { useState } from 'react';
import AdCard from '../components/AdCard';

export default function Home() {
  const [product, setProduct] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState('default'); // From top tools: 100+ templates

  const templates = [
    { id: 'default', name: 'Standard' },
    { id: 'ugc', name: 'UGC Video Script' }, // Creatify/Predis
    { id: 'carousel', name: 'Carousel' }, // Predis
    { id: 'story', name: 'Story Ad' } // Narrato
  ];

  const generate = async () => {
    if (!product.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, template })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      console.error(err);
      alert('Try again—check console!');
    }
    setLoading(false);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ads.map(ad => ad.text).join('\n\n---\n\n'));
    alert('Copied to WhatsApp/Meta!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VernAI Ads
            </h1>
          </div>
          <p className="text-gray-600 text-xl">5+ Hindi FB/IG Ads in 30s • UGC Videos • Scoring • Free Tier</p>
        </div>

        {/* Controls: Input + Template + Budget */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 grid md:grid-cols-3 gap-4">
          <textarea
            placeholder="Product: eco-friendly water bottle (English/Hindi OK – AI translates!)"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="md:col-span-2 p-5 text-lg border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none resize-none font-medium"
            rows={3}
          />
          <div className="space-y-4">
            <select value={template} onChange={(e) => setTemplate(e.target.value)} className="w-full p-3 border rounded-xl">
              {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <input type="number" defaultValue={99} placeholder="Budget ₹" className="w-full p-3 border rounded-xl" id="budget" />
          </div>
          <button
            onClick={generate}
            disabled={loading || !product.trim()}
            className="md:col-span-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'AI Magic...' : 'Generate & Score Ads'}
          </button>
        </div>

        {/* Results: Grid + Scoring + A/B */}
        {ads.length > 0 && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Top Ads (Avg Score: {ads.reduce((sum, ad) => sum + ad.score, 0) / ads.length | 0}/100)</h2>
              <div className="flex gap-2">
                <button onClick={copyAll} className="bg-green-500 text-white px-4 py-2 rounded-lg">📱 Export A/B</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">Competitor Spy</button> {/* Stub for insights */}
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ads.map((ad, i) => (
                <AdCard key={i} ad={ad} />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">Pro Tip: Test high-score variants on Meta for 2x ROAS (Powered by $35B ad data like AdCreative.ai)</p>
          </>
        )}

        {/* Floating WhatsApp */}
        {ads.length > 0 && (
          <button onClick={copyAll} className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold">
            📱 Copy to Meta
          </button>
        )}
      </div>
    </div>
  );
}
