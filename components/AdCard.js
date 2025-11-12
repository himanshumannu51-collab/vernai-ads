export default function AdCard({ ad }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">
        {ad}
      </pre>
    </div>
  );
}
