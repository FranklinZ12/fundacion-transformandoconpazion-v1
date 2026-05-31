import Image from "next/image";

const services = [
  {
    image: "aga1",
    titulo: "Educación Ambiental",
    parrafo:
      "Desarrollamos talleres y jornadas formativas para jóvenes y comunidades sobre el cuidado del medio ambiente y la adopción de hábitos ecológicos sostenibles.",
  },
  {
    image: "aga2",
    titulo: "Buenas Prácticas",
    parrafo:
      "Promovemos el reciclaje, la reducción de residuos y el uso responsable de los recursos naturales como pilares de nuestra acción comunitaria.",
  },
  {
    image: "aga3",
    titulo: "Liderazgo Juvenil",
    parrafo:
      "Formamos líderes ambientales comprometidos con la transformación de su entorno, impulsando proyectos de impacto en sus barrios y comunidades.",
  },
];

export default function AgaServices() {
  return (
    <section aria-labelledby="aga-services-heading" className="mt-12">
      <div className="text-center mb-8">
        <h2 id="aga-services-heading" className="font-semibold text-4xl text-gray-800 uppercase">
          Nuestras Iniciativas
        </h2>
        <p className="text-gray-500 mt-1">Grupo Ambiental Juvenil TCP</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((s) => (
          <article
            key={s.titulo}
            className="card image-full bg-base-100 shadow-xl rounded-2xl overflow-hidden z-0"
          >
            <figure>
              <Image
                src={`/images/procesos/aga/${s.image}.webp`}
                alt={s.titulo}
                width={400}
                height={300}
                className="w-full h-52 object-cover"
                loading="lazy"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-white">{s.titulo}</h3>
              <p className="text-gray-200 text-sm">{s.parrafo}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
