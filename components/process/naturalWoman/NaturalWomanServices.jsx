import Image from "next/image";

const services = [
  {
    image: "woman1",
    titulo: "Charlas y Capacitaciones",
    parrafo:
      "Realizaremos encuentros, charlas y capacitaciones enfocadas al modelaje y al tema social.",
  },
  {
    image: "woman2",
    titulo: "Eventos",
    parrafo:
      "Tendremos eventos de modelaje que buscan mostrar la naturaleza del cuerpo femenino.",
  },
  {
    image: "woman3",
    titulo: "Estudio Audiovisual",
    parrafo: "Basado en estudio fotográfico, vídeos y presentaciones.",
  },
];

export default function NaturalWomanServices() {
  return (
    <>
      {/* Hero */}
      <div className="hero py-12">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <Image
            src="/images/procesos/naturalWoman/woman2.webp"
            alt="Natural Woman"
            width={400}
            height={400}
            className="max-w-xs rounded-full shadow-2xl"
            loading="lazy"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Quiénes somos?</h2>
            <p className="text-gray-700 leading-relaxed">
              Somos un proyecto de modelos con enfoque social, que busca aumentar el autoestima y la
              seguridad en sí misma sobre su cuerpo femenino generando confianza.
              <br />
              <br />
              Este proyecto busca mitigar los malos comentarios, tabús y paradigmas que tiene la sociedad
              sobre el cuerpo femenino, generando un impacto social positivo y cultural para quienes rodean
              el proyecto.
            </p>
            <a
              href="https://www.facebook.com/NaturalWomanMed/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block btn btn-outline border-[#872075] text-[#872075] hover:bg-[#872075] hover:text-white"
            >
              <i className="fa-brands fa-facebook-f mr-2" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Servicios */}
      <section aria-labelledby="nw-services-heading" className="mt-10">
        <div className="text-center mb-6">
          <h2 id="nw-services-heading" className="font-semibold text-4xl text-gray-800 uppercase">
            Nuestros Servicios
          </h2>
          <p className="text-gray-500 mt-1">Mujeres Naturales</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.titulo}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md"
            >
              <Image
                src={`/images/procesos/naturalWoman/${s.image}.webp`}
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
    </>
  );
}
