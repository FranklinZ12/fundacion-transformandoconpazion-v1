export default function LogoCard({ title, object }) {
  return (
    <div className="card-about border border-gray-200 flex-col">
      <h3 className="text-xl font-semibold text-[#872075] mb-3">{title}</h3>
      <ol className="space-y-1">
        {Object.entries(object).map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold text-gray-800">{key}:</span>
            <span className="text-gray-600"> {value}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
