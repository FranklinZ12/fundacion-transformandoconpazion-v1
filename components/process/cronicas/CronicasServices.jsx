import Image from "next/image";

const services = [
  {
    image: "cronicas1",
    titulo: "Debate",
    parrafo:
      "Se habla sobre el deporte y se discute con argumentos las decisiones deportivas.",
  },
  {
    image: "cronicas2",
    titulo: "TC Play",
    parrafo:
      "Es el espacio en el cual generamos las probabilidades que puedan suceder en los resultados sobre el deporte.",
  },
  {
    image: "cronicas3",
    titulo: "Información Deportiva BeSoccer",
    parrafo:
      "Noticias y sucesos importantes para informar a la comunidad deportiva.",
  },
];

export default function CronicasServices() {
  return (
    <section aria-labelledby="cronicas-services-heading" className="mt-10">
      <div className="text-center mb-6">
        <h2 id="cronicas-services-heading" className="font-semibold text-4xl text-gray-800 uppercase">
          Nuestros Servicios
        </h2>
        <p className="text-gray-500 mt-1">Crónicas y Pasión Deportiva</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <article
            key={s.titulo}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md"
          >
            <Image
              src={`/images/procesos/cronicas/${s.image}.webp`}
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
