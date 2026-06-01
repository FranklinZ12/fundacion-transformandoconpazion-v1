import Image from "next/image";

const stats = [
  { icon: "fa-solid fa-shield-halved", value: "16+", label: "Equipos" },
  { icon: "fa-solid fa-futbol",        value: "2024", label: "Temporada" },
  { icon: "fa-solid fa-location-dot",  value: "C15", label: "Guayabal" },
  { icon: "fa-solid fa-trophy",        value: "1°", label: "Liga de la zona" },
];

const recursos = [
  {
    href: "https://gamma.app/docs/nye3z6gh41qbwyq#card-cv5o9aoeim6x6wq",
    icon: "fa-solid fa-calendar-days",
    title: "Fixture",
    desc: "Ve la próxima fecha y el calendario de la Liga.",
    accent: "#872075",
  },
  {
    href: "https://drive.google.com/file/d/1UgJC3dd_FxXyzkhTdZw_4gQ-3za402Gz/view",
    icon: "fa-solid fa-book",
    title: "Reglamento Oficial",
    desc: "Descarga el reglamento oficial de la Liga 2024.",
    accent: "#c3171c",
  },
  {
    href: "https://liga-barrial-huk78wu.gamma.site/#card-ggf50enu5popi5z",
    icon: "fa-solid fa-chart-bar",
    title: "Estadísticas",
    desc: "Tabla de posiciones, goleadores y más.",
    accent: "#0ea5e9",
  },
  {
    href: "https://gamma.app/docs/nye3z6gh41qbwyq#card-l74h3cgxlliltby",
    icon: "fa-solid fa-list-check",
    title: "Equipos Inscritos",
    desc: "Consulta todos los equipos participantes.",
    accent: "#7c3aed",
  },
  {
    href: "https://www.facebook.com/ligaguayabal/",
    icon: "fa-brands fa-facebook-f",
    title: "Galería de fotos",
    desc: "Síguenos en Facebook y ve todos los momentos.",
    accent: "#1877f2",
  },
];

export default function LigaGuayabalContent({ descripcion }) {
  return (
    <div className="max-w-4xl mx-auto space-y-14 py-4">

      {/* Hero — foto + descripción */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="https://9f1e8b6678.cbaul-cdnwnd.com/f45d6ad1dd7b6dc007f12dd1e1390429/200000295-8075780758/440358189_970906848373047_8544846746088642923_n.jpeg"
            alt="Liga Guayabal 2024 - Fútbol de Salón"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-2">
              Liga 2024 · Fútbol de Salón
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              La liga más grande de la comuna 15
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {descripcion ?? (<>La <strong>Liga Guayabal</strong> reúne a más de 16 equipos de la zona en la disciplina de Fútbol de Salón. Se disputa en la <strong>Cancha La Colinita #2</strong> y es uno de los torneos más importantes de la comuna 15, promoviendo la sana convivencia, el deporte y la integración comunitaria.</>)}
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
          <h2 className="text-xl font-extrabold text-gray-900">Recursos de la Liga</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
