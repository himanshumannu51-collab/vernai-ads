export default function AdCard({ ad }) {
  return (
    <div className="ad-template">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{ad.type}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${ad.score > 80 ? 'bg-green-100 text-green-800' : ad.score > 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
          {ad.score}/100
        </span>
      </div>
      <pre className="whitespace-pre-wrap text-gray-800 mb-3 text-sm leading-relaxed">{ad.text}</pre>
      {ad.video && <p className="text-blue-600 text-xs italic mb-2">🎥 UGC Video Script Ready</p>}
      <div className="flex gap-2">
        <button className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded">Variant A</button>
        <button className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded">Variant B</button>
      </div>
    </div>
  );
}
