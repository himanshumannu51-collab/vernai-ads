import { useState } from 'react';
import AdCard from '../components/AdCard';

export default function Home() {
  const [product, setProduct] = useState('');
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ product, language: 'hi', budget: 99 }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setAds(data.ads);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">VernAI Ads</h1>
          <p className="text-gray-600 mt-2">5 FB/IG Ads in 30 sec • Hindi + English</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <textarea
            placeholder="प्रोडक्ट डिटेल डालें (हिंदी/अंग्रेजी)"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
            rows={4}
          />

          <button
            onClick={generate}
            disabled={loading || !product}
            className="mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate 5 Ads'}
          </button>
        </div>

        <div className="space-y-4">
          {ads.map((ad, i) => (
            <AdCard key={i} ad={ad} />
          ))}
        </div>

        {ads.length > 0 && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(ads.join('\n\n---\n\n'));
              alert('Copied to WhatsApp!');
            }}
            className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-600"
          >
            WhatsApp Copy
          </button>
        )}
      </div>
    </div>
  );
}
