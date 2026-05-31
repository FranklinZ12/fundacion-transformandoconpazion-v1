import Image from "next/image";

const categorias = [
  {
    image: "catSub9",
    titulo: "Categoría Sub 9",
    parrafo:
      "Nuestra Categoría Sub 9 se encuentra realizando entrenamiento en la cancha Colinita #1, los días Lunes y Viernes de 5 pm a 7 pm.",
  },
  {
    image: "catSub12",
    titulo: "Categoría Sub 12",
    parrafo:
      "Nuestra Categoría Sub 12 se encuentra realizando entrenamiento en la cancha Colinita #1, los días Lunes y Viernes de 5 pm a 7 pm. Ha participado en Justas Deportivas Comuna 15 y 16, quedando mejor terceros. También la participación en el torneo Ciudad Medellín.",
  },
  {
    image: "catSub15",
    titulo: "Categoría Sub 15",
    parrafo:
      "Nuestra Categoría Sub 15 se encuentra realizando entrenamiento en la cancha Colinita #2, los días Martes y Viernes de 7 pm a 9 pm. Ha participado en Justas Deportivas Comuna 15 y 16, quedando Subcampeones.",
  },
  {
    image: "catJuv",
    titulo: "Categoría Juvenil",
    parrafo:
      "Nuestra Categoría Juvenil se encuentra realizando entrenamiento en la cancha Colinita #1, los días Martes y Jueves de 5 pm a 7 pm. Ha participado en Justas Deportivas Comuna 15 y 16, quedando Subcampeones, también en el torneo Ciudad Medellín y Torneo Barrial.",
  },
  {
    image: "catFem",
    titulo: "Categoría Femenina",
    parrafo:
      "Nuestra Categoría Femenina se encuentra realizando entrenamiento en la cancha Colinita #1. Ha participado en Justas Deportivas Comuna 15 y 16, llegando a fase de cuartos. También la participación en el torneo Ciudad Medellín y Torneo Barrial.",
  },
];

export default function TCPCategorias() {
  return (
    <section aria-labelledby="tcp-categorias-heading" className="mt-10">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categorias.map((cat) => (
          <article
            key={cat.titulo}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Image
              src={`/images/procesos/deportivoTCP/${cat.image}.webp`}
              alt={cat.titulo}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="font-semibold text-[#872075] mb-2">{cat.titulo}</h3>
            <p className="text-sm text-gray-600">{cat.parrafo}</p>
          </article>
        ))}
        {/* Redes sociales */}
        <article className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white shadow-md">
          <Image
            src="/images/procesos/deportivoTCP/ClubDeportivoTCP.webp"
            alt="Club Deportivo TCP redes"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="font-semibold text-[#872075] mb-3">Redes</h3>
          <a
            href="https://www.facebook.com/ClubDeportivoTCP/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline border-[#872075] text-[#872075] hover:bg-[#872075] hover:text-white btn-sm"
          >
            <i className="fa-brands fa-facebook-f mr-2" aria-hidden="true" />
            Facebook
          </a>
        </article>
      </div>
    </section>
  );
}
