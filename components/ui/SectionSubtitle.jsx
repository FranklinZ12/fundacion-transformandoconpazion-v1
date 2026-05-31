export default function SectionSubtitle({ titulo, parrafo }) {
  return (
    <div className="w-full text-left my-4">
      <span className="block uppercase text-base font-bold tracking-[3px] leading-relaxed text-gray-800">
        {titulo}
      </span>
      {parrafo && (
        <p className="font-semibold tracking-wide text-gray-600">{parrafo}</p>
      )}
    </div>
  );
}
