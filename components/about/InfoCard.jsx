export default function InfoCard({ icon, title, text }) {
  return (
    <div className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#872075]/10">
        <i className={`${icon} text-xl text-[#872075]`} aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm leading-relaxed text-gray-600">{text}</p>
      </div>
    </div>
  );
}
