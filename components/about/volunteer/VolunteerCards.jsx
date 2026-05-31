import Image from "next/image";

const volunteerItems = [
  {
    img: "/images/voluntario/left.webp",
    text: "Buscamos Líderes y Jóvenes Deportivos para apoyar nuestros proyectos y procesos de la Fundación.",
  },
  {
    img: "/images/voluntario/mid.webp",
    text: "Formamos Líderes emprendedores con enfoque a generar ingresos y empleo en el territorio.",
  },
  {
    img: "/images/voluntario/right.webp",
    text: "Buscamos Jóvenes con ganas de pertenecer a nuestra Fundación para liderar proyectos y procesos.",
  },
];

export default function VolunteerCards() {
  return (
    <div className="flex flex-wrap gap-6 justify-center w-full mt-10">
      {volunteerItems.map((item, i) => (
        <article
          key={i}
          className="card w-80 bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow"
        >
          <figure>
            <Image
              src={item.img}
              alt="Voluntario y donaciones"
              width={320}
              height={240}
              className="w-full object-cover"
              loading="lazy"
            />
          </figure>
          <div className="p-5">
            <p className="text-gray-700">{item.text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
