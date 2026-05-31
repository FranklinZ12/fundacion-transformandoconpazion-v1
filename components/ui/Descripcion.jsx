export default function Descripcion({ title, parrafo }) {
  return (
    <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-7 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed">
        {parrafo}
      </div>
    </div>
  );
}
