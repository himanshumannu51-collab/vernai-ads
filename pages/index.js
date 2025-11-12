'use client';

import { useState } from 'react';
import AdCard from '../components/AdCard';

export default function Home() {
  const [product, setProduct] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!product.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });
      const data = await res.json();
      setAds(data.ads || []);
    } catch (err) {
      alert('Try again!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center py-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VernAI Ads
            </h1>
          </div>
          <p className="text-gray-600 text-lg">5 Hindi FB Ads in 30 sec • AI-Powered • Free</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <textarea
            placeholder="प्रोडक्ट डिटेल डालें (हिंदी/अंग्रेजी) – जैसे: पुन: प्रयोज्य पानी की बोतल, 1 लीटर, BPA फ्री"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-5 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none font-medium"
            rows={3}
          />
          <button
            onClick={generate}
            disabled={loading || !product.trim()}
            className="mt-5 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate 5 Ads'}
          </button>
        </div>

        {/* Ads Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {ads.map((ad, i) => (
            <AdCard key={i} ad={ad} />
          ))}
        </div>

        {/* WhatsApp Button */}
        {ads.length > 0 && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(ads.join('\n\n---\n\n'));
              alert('Copied to WhatsApp!');
            }}
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-2 font-bold transition-all"
          >
            WhatsApp Copy
          </button>
        )}
      </div>
    </div>
  );
}
