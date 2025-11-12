export default function AdCard({ ad }) {
  return (
    <div className="ad-template">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{ad.type || 'Ad'}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${ad.score > 80 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
          Score: {ad.score}/100
        </span>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 mb-3">{ad.text}</pre>
      {ad.video && <p className="text-xs text-blue-600">🎥 UGC Video Ready (Creatify-style)</p>}
      <div className="flex gap-2 mt-3">
        <button className="text-xs bg-blue-100 px-3 py-1 rounded">A Variant</button>
        <button className="text-xs bg-purple-100 px-3 py-1 rounded">B Variant</button>
      </div>
    </div>
  );
}
