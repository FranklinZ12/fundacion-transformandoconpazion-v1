import Image from "next/image";

const pills = [
  { icon: "fa-comments",   label: "Debate" },
  { icon: "fa-trophy",     label: "Pronósticos" },
  { icon: "fa-newspaper",  label: "Noticias deportivas" },
  { icon: "fa-futbol",     label: "Fútbol" },
  { icon: "fa-globe",      label: "Nacional e internacional" },
];

const secciones = [
  {
    image: "/images/procesos/cronicas/cronicas1.webp",
    bg: "bg-gray-100",
    icon: "fa-comments",
    titulo: "Debate Deportivo",
    descripcion:
      "Se habla sobre el deporte y se discute con argumentos las decisiones deportivas. Un espacio para la opinión informada, el análisis y la pasión por el juego.",
  },
  {
    image: "/images/procesos/cronicas/cronicas2.webp",
    bg: "bg-gray-100",
    icon: "fa-trophy",
    titulo: "TC Play — Pronósticos",
    descripcion:
      "Generamos las probabilidades que puedan suceder en los resultados deportivos. Analiza, pronostica y demuestra cuánto sabes de deporte.",
  },
  {
    image: "/images/procesos/cronicas/cronicas3.webp",
    bg: "bg-gray-100",
    icon: "fa-newspaper",
    titulo: "Información Deportiva",
    descripcion:
      "Noticias y sucesos importantes para informar a la comunidad deportiva. Contenido actualizado sobre deportistas, equipos y disciplinas a nivel nacional e internacional.",
  },
];

export default function CronicasContent() {
  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/5 border border-[#872075]/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-40 h-40 shrink-0 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/procesos/CyP_Deportiva.webp"
            alt="Logo Crónicas y Pasión Deportiva"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div>
            <p className="text-[#872075] text-xs font-bold uppercase tracking-widest mb-1">
              Programa deportivo
            </p>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Crónicas y Pasión Deportiva
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Programa donde se habla y debate sobre temas del deporte a nivel
              nacional e internacional, analizando detalladamente deportistas,
              equipos y disciplinas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {pills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#872075]/10 text-[#872075] text-xs font-semibold px-3 py-1"
              >
                <i className={`fa-solid ${p.icon} text-[#872075] text-[10px]`} aria-hidden="true" />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── ESPACIOS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Nuestros Espacios
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {secciones.map((s) => (
            <article
              key={s.titulo}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className={`relative aspect-video w-full ${s.bg}`}>
                <Image
                  src={s.image}
                  alt={s.titulo}
                  fill
                  className="object-contain p-4"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#872075]/10">
                    <i className={`fa-solid ${s.icon} text-[#872075] text-xs`} aria-hidden="true" />
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm">{s.titulo}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{s.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── FACEBOOK CTA ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Contáctanos
          </h2>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#872075]/10 to-[#c3171c]/5 border border-[#872075]/20 p-8 flex justify-center">
          <a
            href="http://www.facebook.com/pages/example-account/197494372329"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2]/10 group-hover:bg-[#1877f2]/20 transition-colors">
              <i className="fa-brands fa-facebook-f text-[#1877f2] text-lg" aria-hidden="true" />
            </span>
            <span className="text-xs text-gray-500 font-medium">Facebook</span>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-[#1877f2] transition-colors underline underline-offset-2 decoration-[#1877f2]/40">
              Crónicas y Pasión Deportiva
              <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}
