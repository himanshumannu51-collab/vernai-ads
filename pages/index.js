// pages/index.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <span className="text-xl font-bold">VernAI Ads</span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/generate">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold">
                  Start Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6 border border-purple-500/30">
              <span className="text-2xl">✨</span>
              <span className="text-sm text-purple-300">AI-Powered Ad Generation for India</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              Generate 5+ Hindi Ads in 30 Seconds
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Create high-converting Facebook & Instagram ads with AI-powered copy, UGC videos, and performance scoring. Built specifically for the Indian market.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/generate">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg flex items-center justify-center gap-2 group">
                  Start Free Trial
                  <span className="group-hover:translate-x-1 transition">→</span>
                </button>
              </Link>
              <button className="px-8 py-4 bg-white/10 backdrop-blur rounded-lg hover:bg-white/20 transition font-semibold text-lg flex items-center justify-center gap-2 border border-white/20">
                <span>▶</span>
                Watch Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl"></div>
            <div className="relative bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                <span className="text-6xl">▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-y border-purple-500/20 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400">Ads Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                3x
              </div>
              <div className="text-gray-400">Avg. ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                30sec
              </div>
              <div className="text-gray-400">Generation Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">Everything you need to create winning ad campaigns</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                ✨
              </div>
              <h3 className="text-xl font-bold mb-2">AI Ad Generation</h3>
              <p className="text-gray-400">Generate 5+ high-converting Hindi ads in just 30 seconds with advanced AI</p>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                🎯
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Ad Scoring</h3>
              <p className="text-gray-400">Get AI-powered scores and insights to optimize your ad performance</p>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Go from concept to campaign-ready ads in under a minute</p>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                📈
              </div>
              <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-gray-400">Track and analyze your ad performance with detailed metrics</p>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                🌏
              </div>
              <h3 className="text-xl font-bold mb-2">Multi-Language</h3>
              <p className="text-gray-400">Native support for Hindi and regional languages for maximum impact</p>
            </div>

            <div className="p-6 bg-slate-900/50 backdrop-blur border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition text-3xl">
                🎥
              </div>
              <h3 className="text-xl font-bold mb-2">UGC Video Creation</h3>
              <p className="text-gray-400">Create authentic user-generated content videos that resonate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur border border-purple-500/20 rounded-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to 10x Your Ad Creation?</h2>
            <p className="text-xl text-gray-300 mb-8">Join 500+ businesses creating winning ads with VernAI</p>
            <Link href="/generate">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold text-lg inline-flex items-center gap-2">
                Start Free Trial
                <span>→</span>
              </button>
            </Link>
            <p className="text-sm text-gray-400 mt-6">No credit card required • 7-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-slate-950 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <span className="text-xl font-bold">VernAI Ads</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">AI-powered ad generation for the Indian market</p>
          <p className="text-sm text-gray-400">© 2024 VernAI Ads. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
