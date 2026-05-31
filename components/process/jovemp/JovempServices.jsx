import Image from "next/image";

const services = [
  {
    image: "jov1",
    titulo: "Charlas y Capacitaciones",
    parrafo:
      "Periódicamente se hacen capacitaciones y charlas enfocadas en la gestión de recursos, administración y emprendimientos.",
  },
  {
    image: "jov2",
    titulo: "Red de Empresarios",
    parrafo:
      "La red de Jovemp es articular todos los negocios nuevos y emprendimientos que quieren promocionar sus productos y compararlos en el mercado.",
  },
  {
    image: "jov3",
    titulo: "Ferias y Eventos",
    parrafo:
      "Las ferias de emprendimiento y los eventos de empresarios nos ayudan a mostrar nuestros productos y servicios para aumentar las ventas y posicionar marca.",
  },
];

export default function JovempServices() {
  return (
    <section aria-labelledby="jovemp-services-heading" className="mt-10">
      <div className="text-center mb-6">
        <h2 id="jovemp-services-heading" className="font-semibold text-4xl text-gray-800 uppercase">
          Nuestros Servicios
        </h2>
        <p className="text-gray-500 mt-1">Jovemp</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <article
            key={s.titulo}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md"
          >
            <Image
              src={`/images/procesos/jovemp/${s.image}.webp`}
              alt={s.titulo}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="font-semibold text-[#872075] mb-2">{s.titulo}</h3>
            <p className="text-sm text-gray-600">{s.parrafo}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
