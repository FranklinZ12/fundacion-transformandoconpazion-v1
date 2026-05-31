export default function DescripcionItem({ subtitulo, descripcion, valor }) {
  return (
    <div>
      <div className="mt-4 grid grid-rows-1 gap-3 text-left md:grid-flow-col md:grid-rows-2">
        <span className="font-semibold text-gray-800">{subtitulo}</span>
        {descripcion && <p className="text-gray-600">{descripcion}</p>}
        <span className="text-right font-bold text-[#872075]">
          Desde <br /> {valor}
        </span>
      </div>
      <hr className="my-2 border-gray-200" />
    </div>
  );
}
