import Image from "next/image";

const pills = [
  { icon: "fa-futbol",      label: "Pronósticos" },
  { icon: "fa-trophy",      label: "Acumulado" },
  { icon: "fa-bolt",        label: "¡Sé el más Tezo!" },
  { icon: "fa-chart-line",  label: "Resultados deportivos" },
];

const reglas = [
  "Espacio para pronosticar y acertar resultados del deporte.",
  "La página se actualiza constantemente — los partidos cambian de horario.",
  "El ganador dejará para #TCPlay el 10% de fondos de administración.",
  "Para el acumulado completo debes pronosticar en cada paquete publicado.",
];

const paquetes = [
  {
    nombre: "TC Play Classic",
    tag: null,
    precio: "1.000",
    partidos: 4,
    tipo: "Pronóstico Clásico",
    descripcion:
      "Para ganarse el acumulado completo debes pronosticar siempre en cada paquete publicado (Gana, Pierde o Empate). Si saltás un paquete, solo participás de los pronosticados, no del acumulado.",
    highlight: false,
  },
  {
    nombre: "TC Play Premium",
    tag: "Más popular",
    precio: "2.000",
    partidos: 5,
    tipo: "Pronóstico Premium",
    descripcion:
      "Para ganarse el acumulado completo debes pronosticar siempre en cada paquete publicado (Gana, Pierde o Empate). Si saltás un paquete, solo participás de los pronosticados, no del acumulado.",
    highlight: true,
  },
  {
    nombre: "TC Play Platinum",
    tag: "Exclusivo",
    precio: "4.000",
    partidos: 6,
    tipo: "Pronóstico Exclusivo",
    descripcion:
      "Para ganarse el acumulado completo debes pronosticar siempre en cada paquete publicado (Gana, Pierde o Empate). Si saltás un paquete, solo participás de los pronosticados, no del acumulado.",
    highlight: false,
  },
];

export default function TCPlayContent() {
  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/5 border border-[#872075]/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md bg-gray-100">
          <Image
            src="/images/procesos/TCPlay.webp"
            alt="Logo TC Play"
            fill
            className="object-contain p-2"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">TC Play</h2>
            <ul className="space-y-1">
              {reglas.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                  <i className="fa-solid fa-check text-[#872075] text-xs mt-1 shrink-0" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {pills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#872075]/10 text-[#872075] text-xs font-semibold px-3 py-1"
              >
                <i className={`fa-solid ${p.icon} text-[10px]`} aria-hidden="true" />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAQUETES ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Paquetes y Valores
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paquetes.map((p) => (
            <article
              key={p.nombre}
              className={`relative rounded-2xl flex flex-col overflow-hidden border transition-shadow hover:shadow-lg ${
                p.highlight
                  ? "border-[#872075] shadow-md bg-white"
                  : "border-gray-100 shadow-sm bg-white"
              }`}
            >
              {p.tag && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center rounded-full bg-[#872075] text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wide">
                    {p.tag}
                  </span>
                </div>
              )}

              <div className={`px-6 pt-6 pb-4 ${p.highlight ? "bg-[#872075]/5" : ""}`}>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">{p.tipo}</p>
                <h3 className="font-extrabold text-gray-800 text-lg">{p.nombre}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#872075]">${p.precio}</span>
                  <span className="text-sm text-gray-400">COP</span>
                </div>
              </div>

              <div className={`mx-6 h-px ${p.highlight ? "bg-[#872075]/20" : "bg-gray-100"}`} />

              <div className="px-6 py-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#872075]/10">
                    <i className="fa-solid fa-futbol text-[#872075] text-xs" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {p.partidos} partidos incluidos
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{p.descripcion}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

    </div>
  );
}
