import Image from "next/image";
import Link from "next/link";

const categoryColors = {
  Deporte:       { bg: "bg-blue-100",   text: "text-blue-700",   icon: "fa-solid fa-futbol" },
  Emprendimiento:{ bg: "bg-amber-100",  text: "text-amber-700",  icon: "fa-solid fa-lightbulb" },
  Social:        { bg: "bg-purple-100", text: "text-purple-700", icon: "fa-solid fa-people-group" },
  Ambiente:      { bg: "bg-green-100",  text: "text-green-700",  icon: "fa-solid fa-leaf" },
  Cultura:       { bg: "bg-rose-100",   text: "text-rose-700",   icon: "fa-solid fa-microphone" },
};

export default function ProcessCard({ image, nombre, descripcion, link, categoria, priority = false }) {
  const cat = categoryColors[categoria] ?? { bg: "bg-gray-100", text: "text-gray-600", icon: "fa-solid fa-circle" };
  const isComingSoon = !link;

  return (
    <article className={`group bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 ${isComingSoon ? "opacity-75" : ""}`}>
      {/* Photo */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={`/images/procesos/${image}.webp`}
          alt={nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${!isComingSoon ? "group-hover:scale-105" : ""}`}
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${cat.bg} ${cat.text}`}>
          <i className={`${cat.icon} text-[10px]`} aria-hidden="true" />
          {categoria}
        </span>
        {/* Coming soon overlay */}
        {isComingSoon && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-gray-700 shadow">
              <i className="fa-solid fa-clock" aria-hidden="true" />
              Próximamente
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-5 py-5">
        <h2 className="text-base font-bold text-gray-900 mb-2 leading-snug">{nombre}</h2>
        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">{descripcion}</p>

        {link && (
          <div className="mt-5">
            <Link
              href={`/procesos/${link}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#872075] hover:gap-3 transition-all group/link"
            >
              Ver proceso
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover/link:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
