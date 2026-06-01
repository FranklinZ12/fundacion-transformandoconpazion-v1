import Image from "next/image";

const stats = [
  { icon: "fa-solid fa-calendar-check", value: "4", label: "Ediciones" },
  { icon: "fa-solid fa-futbol",          value: "16+", label: "Equipos" },
  { icon: "fa-solid fa-location-dot",    value: "C15", label: "Guayabal" },
  { icon: "fa-solid fa-people-group",    value: "2020", label: "Desde" },
];

const recursos = [
  {
    href: "https://drive.google.com/file/d/1dcGlTadVqTLTJXKNK13JQZNeuN6R1LM9/view",
    icon: "fa-solid fa-file-lines",
    title: "Planilla de Inscripción",
    desc: "Descarga la planilla oficial del Torneo Barrial 2020.",
    accent: "#872075",
  },
  {
    href: "https://drive.google.com/file/d/1hhpu-ToZrXm-9O4dIbw8NiWRaiL/view",
    icon: "fa-solid fa-book",
    title: "Reglamento Oficial",
    desc: "Descarga el reglamento completo del torneo.",
    accent: "#c3171c",
  },
  {
    href: "https://www.facebook.com/TorneoBarrial2019/?ref=bookmarks",
    icon: "fa-brands fa-facebook-f",
    title: "Estadísticas",
    desc: "Consulta resultados y estadísticas en Facebook.",
    accent: "#1877f2",
  },
];

export default function TorneoBarrialContent({ descripcion }) {
  return (
    <div className="max-w-4xl mx-auto space-y-14 py-4">

      {/* Hero — foto + descripción en 2 col */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="https://9f1e8b6678.cbaul-cdnwnd.com/f45d6ad1dd7b6dc007f12dd1e1390429/200000283-1d1211d124/IMG-20231220-WA0010.jpeg"
            alt="Torneo Barrial - Cancha La Colinita"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-2">
              Desde 2020 · Guayabal La Colinita
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              Un torneo que une a la comunidad
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {descripcion ?? (<>Nuestro Torneo lleva <strong>4 años trabajando por la sana convivencia</strong> en Guayabal La Colinita como acción social en el territorio. En la disciplina de Fútbol de Salón, muchos buenos deportistas han pasado por el escenario deportivo de la <strong>Cancha La Colinita #2</strong>.</>)}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#872075]/10">
                  <i className={`${s.icon} text-[#872075] text-sm`} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-lg font-extrabold text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recursos */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Recursos del Torneo</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recursos.map((r) => (
            <a
              key={r.title}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all group"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg shadow-sm"
                style={{ backgroundColor: r.accent }}
              >
                <i className={r.icon} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-1">{r.title}</p>
                <p className="text-xs text-gray-500 leading-snug">{r.desc}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5" style={{ color: r.accent }}>
                Abrir enlace
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">¿Dónde jugamos?</h2>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
            <i className="fa-solid fa-location-dot text-[#872075]" aria-hidden="true" />
            <span className="text-sm font-semibold text-gray-700">Cancha La Colinita #2</span>
            <span className="text-sm text-gray-400">— Cl. 11A Sur #53f-1, Guayabal, Medellín</span>
          </div>
          <iframe
            title="Ubicación Cancha La Colinita #2"
            src="https://www.google.com/maps?q=Cl.+11A+Sur+%2353f-1,+Medell%C3%ADn,+Antioquia,+Colombia&output=embed"
            width="100%"
            height="360"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
}
