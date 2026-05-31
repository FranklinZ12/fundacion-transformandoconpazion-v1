import Image from "next/image";

const BASE = "/images/procesos/deportivoTCP";

const stats = [
  { icon: "fa-solid fa-layer-group", value: "5",           label: "Categorías" },
  { icon: "fa-solid fa-futbol",      value: "Fútbol Salón", label: "Disciplina" },
  { icon: "fa-solid fa-location-dot",value: "Colinita",    label: "Cancha" },
  { icon: "fa-solid fa-calendar",    value: "2014",        label: "Fundación" },
];

const categorias = [
  {
    img: "catSub9",
    titulo: "Sub 9",
    horario: "Lun & Vie · 5 pm – 7 pm",
    cancha: "Colinita #1",
    logros: [],
    desc: "Nuestros más pequeños. Formación en valores, técnica y amor por el deporte desde temprana edad.",
  },
  {
    img: "catSub12",
    titulo: "Sub 12",
    horario: "Lun & Vie · 5 pm – 7 pm",
    cancha: "Colinita #1",
    logros: ["3° Justas C15-C16", "Torneo Ciudad Medellín"],
    desc: "Con experiencia en competencias intercomunales y torneos de ciudad.",
  },
  {
    img: "catSub15",
    titulo: "Sub 15",
    horario: "Mar & Vie · 7 pm – 9 pm",
    cancha: "Colinita #2",
    logros: ["Subcampeones Justas C15-C16"],
    desc: "Nivel competitivo alto, con presencia destacada en las justas deportivas comunales.",
  },
  {
    img: "catJuv",
    titulo: "Juvenil",
    horario: "Mar & Jue · 5 pm – 7 pm",
    cancha: "Colinita #1",
    logros: ["Subcampeones Justas C15-C16", "Torneo Barrial"],
    desc: "Nuestro equipo más experimentado, participante habitual en torneos locales y de ciudad.",
  },
  {
    img: "catFem",
    titulo: "Femenina",
    horario: "Colinita #1",
    cancha: "Colinita #1",
    logros: ["Cuartos Justas C15-C16", "Torneo Ciudad Medellín"],
    desc: "Equipo femenino referente en la comuna, impulsando la participación de la mujer en el deporte.",
  },
];

export default function ClubDeportivoTCPContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-14 py-4">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={`${BASE}/ClubDeportivoTCP.webp`}
            alt="Club Deportivo TCP"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-2">
              Club Deportivo · Fútbol de Salón
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              Formando campeones desde los barrios de Guayabal
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            El <strong>Club Deportivo TCP</strong> desarrolla procesos deportivos en Fútbol de Salón
            con 5 categorías activas. Más que un club, somos una escuela de vida donde el deporte
            construye carácter, disciplina y comunidad en la Cancha La Colinita.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#872075]/10">
                  <i className={`${s.icon} text-[#872075] text-sm`} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categorías ────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Categorías</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categorias.map((cat) => (
            <div
              key={cat.titulo}
              className="flex flex-col rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Foto */}
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={`${BASE}/${cat.img}.webp`}
                  alt={cat.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
                {/* Badge categoría */}
                <span className="absolute top-3 left-3 rounded-full bg-[#872075] px-3 py-1 text-xs font-bold text-white shadow">
                  {cat.titulo}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <p className="text-xs text-gray-500 leading-snug">{cat.desc}</p>

                {/* Horario */}
                <div className="flex items-center gap-2 rounded-lg bg-[#872075]/5 px-3 py-2">
                  <i className="fa-solid fa-clock text-[#872075] text-xs shrink-0" aria-hidden="true" />
                  <span className="text-xs font-semibold text-gray-700">{cat.horario}</span>
                </div>

                {/* Logros */}
                {cat.logros.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cat.logros.map((l) => (
                      <span
                        key={l}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700"
                      >
                        <i className="fa-solid fa-trophy text-[9px]" aria-hidden="true" />
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Uniformes ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Uniformes</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { file: "uniforme1",   label: "Local" },
            { file: "uniforme2",   label: "Visitante" },
            { file: "uniformeDT",  label: "Cuerpo técnico" },
          ].map((u) => (
            <div key={u.file} className="flex flex-col gap-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100">
                <Image
                  src={`${BASE}/${u.file}.webp`}
                  alt={`Uniforme ${u.label}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, 200px"
                  loading="lazy"
                />
              </div>
              <span className="text-center text-xs font-semibold text-gray-500">{u.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Redes ─────────────────────────────────────────── */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1877f2] text-white text-2xl shadow">
          <i className="fa-brands fa-facebook-f" aria-hidden="true" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-extrabold text-gray-900">Síguenos en Facebook</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Resultados, fotos y novedades del club en nuestras redes sociales.
          </p>
        </div>
        <a
          href="https://www.facebook.com/ClubDeportivoTCP/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#1877f2] hover:bg-[#1565d8] text-white px-5 py-2.5 text-sm font-bold transition-colors shadow"
        >
          <i className="fa-brands fa-facebook-f text-sm" aria-hidden="true" />
          Club Deportivo TCP
        </a>
      </div>

    </div>
  );
}
