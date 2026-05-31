export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-16">
      <h1 className="font-bold text-4xl md:text-5xl text-gray-900 uppercase tracking-tight mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-500 text-lg max-w-xl">{subtitle}</p>
      )}
    </div>
  );
}
