import Image from "next/image";
import DescripcionItem from "@/components/ui/DescripcionItem";

const cards = [
  {
    image: "esysu2",
    titulo: "Productos",
    items: ["Mugs", "Gorras", "Camisas", "Anchetas"],
  },
  {
    image: "esysu3",
    titulo: "Servicios",
    items: ["Estampación", "Sublimación", "Capacitación", "Taller de formación"],
  },
];

const precios = [
  { subtitulo: "Mugs sencillo", valor: "14.000$" },
  { subtitulo: "Mugs color interno", valor: "16.000$" },
  { subtitulo: "Mugs mágico", valor: "18.000$" },
  { subtitulo: "Gorras", valor: "15.000$" },
  { subtitulo: "Camisas", valor: "22.000$" },
];

export default function EsySuContent() {
  return (
    <>
      <div className="flex flex-wrap justify-center gap-8 my-8">
        {cards.map((card) => (
          <article
            key={card.titulo}
            className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md w-60"
          >
            <Image
              src={`/images/procesos/esysu/${card.image}.webp`}
              alt={card.titulo}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              loading="lazy"
            />
            <h3 className="font-semibold text-[#872075] mb-3">{card.titulo}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {card.items.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </article>
        ))}
        {/* Redes */}
        <article className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-md w-60">
          <Image
            src="/images/procesos/esysu/esysu1.webp"
            alt="ES&SU redes"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
            loading="lazy"
          />
          <h3 className="font-semibold text-[#872075] mb-3">Redes</h3>
          <a
            href="https://www.instagram.com/esysu_personalizado/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#872075] hover:underline font-medium"
          >
            <i className="fa-brands fa-instagram mr-1" aria-hidden="true" />
            Instagram
          </a>
        </article>
      </div>

      {/* Precios */}
      <div className="mt-8">
        <h3 className="font-bold text-xl text-gray-800 mb-4 uppercase tracking-wide">
          Productos Personalizados — Listado de Precios
        </h3>
        {precios.map((p) => (
          <DescripcionItem key={p.subtitulo} subtitulo={p.subtitulo} valor={p.valor} />
        ))}
      </div>
    </>
  );
}
