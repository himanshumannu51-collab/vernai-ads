export default function AdCard({ ad }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
        {ad}
      </pre>
    </div>
  );
}
