// components/AIAdGenerator.jsx
import React, { useState } from 'react';
import { Sparkles, Target, TrendingUp, RefreshCw, Copy, Download, Star, Zap, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function AIAdGenerator() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    product: '',
    targetAudience: '',
    language: 'hindi',
    tone: 'friendly',
    offer: '',
    cta: ''
  });
  const [generatedAds, setGeneratedAds] = useState([]);

  // AI Ad Generation Function
  const generateAds = async () => {
    setLoading(true);
    
    try {
      const prompt = `Create 5 high-converting ${formData.language} advertisement variations for an Indian business.

Business Details:
- Name: ${formData.businessName}
- Product/Service: ${formData.product}
- Target Audience: ${formData.targetAudience}
- Tone: ${formData.tone}
- Special Offer: ${formData.offer}
- Call-to-Action: ${formData.cta || 'Order Now'}

Requirements for EACH ad:
- Catchy headline (40-60 characters)
- Engaging body copy (2-3 sentences, 100-150 characters)
- Clear call-to-action
- 3-5 relevant emojis (as array)
- 2-3 hashtags (as array)
- Performance score (0-100)
- 3 strengths (array)
- 2 improvements (array)

Make ads culturally relevant for Indian audiences with local expressions and festival references where appropriate.

Return JSON in this EXACT format:
{
  "ads": [
    {
      "headline": "string",
      "body": "string",
      "cta": "string",
      "emojis": ["emoji1", "emoji2"],
      "hashtags": ["#tag1", "#tag2"],
      "score": 90,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2"]
    }
  ]
}`;

      // Call YOUR backend API (not direct Claude API)
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          formData: formData
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Parse the AI response
      let ads = data.ads;
      
      // Add scoring if not present
      const scoredAds = ads.map(ad => ({
        ...ad,
        score: ad.score || calculateAdScore(ad),
        strengths: ad.strengths || ['Clear messaging', 'Engaging copy', 'Strong CTA'],
        improvements: ad.improvements || ['Add more urgency', 'Include social proof']
      }));
      
      setGeneratedAds(scoredAds);
      setStep(2);
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Failed to generate ads. Please try again.');
    }
    
    setLoading(false);
  };

  // Scoring Algorithm
  const calculateAdScore = (ad) => {
    let score = 70;
    if (ad.headline?.length >= 40 && ad.headline?.length <= 60) score += 5;
    if (ad.emojis?.length >= 3) score += 5;
    if (ad.hashtags?.length >= 2) score += 5;
    if (ad.cta?.length > 0) score += 10;
    if (ad.body?.length >= 100 && ad.body?.length <= 150) score += 5;
    return Math.min(score, 100);
  };

  // Regenerate specific ad
  const regenerateAd = async (index) => {
    const newAds = [...generatedAds];
    newAds[index] = { ...newAds[index], loading: true };
    setGeneratedAds(newAds);
    
    try {
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Generate 1 new ad variation with same requirements`,
          formData: formData,
          single: true
        })
      });

      const data = await response.json();
      if (data.ads && data.ads[0]) {
        newAds[index] = data.ads[0];
        setGeneratedAds(newAds);
      }
    } catch (error) {
      console.error('Regeneration error:', error);
      newAds[index].loading = false;
      setGeneratedAds(newAds);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 80) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-orange-500/20 border-orange-500/30';
  };

  const copyToClipboard = (ad) => {
    const text = `${ad.headline}\n\n${ad.body}\n\n${ad.cta}\n\n${ad.emojis.join(' ')} ${ad.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    alert('Ad copied to clipboard!');
  };

  const exportAllAds = () => {
    const text = generatedAds.map((ad, i) => 
      `=== AD VARIATION ${i + 1} (Score: ${ad.score}/100) ===\n\n` +
      `HEADLINE: ${ad.headline}\n\n` +
      `BODY: ${ad.body}\n\n` +
      `CTA: ${ad.cta}\n\n` +
      `EMOJIS: ${ad.emojis.join(' ')}\n` +
      `HASHTAGS: ${ad.hashtags.join(' ')}\n\n` +
      `STRENGTHS:\n${ad.strengths.map(s => `• ${s}`).join('\n')}\n\n` +
      `IMPROVEMENTS:\n${ad.improvements.map(i => `• ${i}`).join('\n')}\n\n`
    ).join('\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vernai-ads-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-4xl font-bold">VernAI Ad Generator</h1>
          </div>
          <p className="text-gray-400 text-lg">Create 5+ high-converting ads in 30 seconds with AI</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-400' : 'text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-purple-400 bg-purple-500/20' : 'border-gray-600'}`}>
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
            </div>
            <span className="font-semibold">Input Details</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-700"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-400' : 'text-gray-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-purple-400 bg-purple-500/20' : 'border-gray-600'}`}>
              2
            </div>
            <span className="font-semibold">AI Generated Ads</span>
          </div>
        </div>

        {/* Step 1: Input Form */}
        {step === 1 && (
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-400" />
              Tell Us About Your Business
            </h2>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    placeholder="e.g., Raj Electronics"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Product/Service *</label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="e.g., LED TV, Sarees, Mobile Repair"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Target Audience *</label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="e.g., Young professionals, Housewives, Students"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Language *</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  >
                    <option value="hindi">Hindi (हिंदी)</option>
                    <option value="english">English</option>
                    <option value="hinglish">Hinglish (Mix)</option>
                    <option value="tamil">Tamil (தமிழ்)</option>
                    <option value="bengali">Bengali (বাংলা)</option>
                    <option value="marathi">Marathi (मराठी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Tone *</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  >
                    <option value="friendly">Friendly & Casual</option>
                    <option value="professional">Professional</option>
                    <option value="urgent">Urgent & Exciting</option>
                    <option value="trustworthy">Trustworthy & Reliable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Special Offer *</label>
                <input
                  type="text"
                  value={formData.offer}
                  onChange={(e) => setFormData({...formData, offer: e.target.value})}
                  placeholder="e.g., 50% OFF, Buy 1 Get 1 Free, Diwali Special"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Call-to-Action (Optional)</label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                  placeholder="e.g., Order Now, Call Today, Visit Store"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                />
              </div>

              <button
                onClick={generateAds}
                disabled={!formData.businessName || !formData.product || !formData.targetAudience || !formData.offer || loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating Your Ads...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 5+ Ad Variations with AI
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Generated Ads */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple-400" />
                Your AI-Generated Ads
              </h2>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-slate-800/50 border border-purple-500/20 rounded-lg hover:bg-slate-800 transition"
              >
                ← Back to Edit
              </button>
            </div>

            <div className="grid gap-6">
              {generatedAds.map((ad, index) => (
                <div key={index} className="bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-lg border ${getScoreBg(ad.score)}`}>
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${getScoreColor(ad.score)}`} />
                          <span className={`font-bold ${getScoreColor(ad.score)}`}>
                            {ad.score}/100
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Variation {index + 1}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => regenerateAd(index)}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition"
                        title="Regenerate this ad"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(ad)}
                        className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">HEADLINE</div>
                      <div className="text-xl font-bold text-purple-300">{ad.headline}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">BODY</div>
                      <div className="text-gray-300">{ad.body}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">CALL-TO-ACTION</div>
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold">
                        {ad.cta}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">EMOJIS</div>
                        <div className="text-2xl">{ad.emojis?.join(' ') || '🎉'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">HASHTAGS</div>
                        <div className="text-sm text-purple-400">{ad.hashtags?.join(' ') || '#ad'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-purple-500/20">
                    <div>
                      <div className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        STRENGTHS
                      </div>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {ad.strengths?.map((strength, i) => (
                          <li key={i}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        IMPROVEMENTS
                      </div>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {ad.improvements?.map((improvement, i) => (
                          <li key={i}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={generateAds}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Generate More Variations
              </button>
              <button
                onClick={exportAllAds}
                className="flex-1 py-4 bg-slate-800/50 border border-purple-500/20 rounded-lg hover:bg-slate-800 transition font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export All Ads
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
