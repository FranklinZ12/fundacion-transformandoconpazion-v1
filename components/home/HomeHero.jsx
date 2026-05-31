import Image from "next/image";
import Link from "next/link";

const stats = [
  { number: "5+", label: "Años de impacto" },
  { number: "10", label: "Procesos activos" },
  { number: "15+", label: "Comunidades" },
  { number: "1.000+", label: "Jóvenes impactados" },
];

const objectives = [
  {
    icon: "fa-solid fa-magnifying-glass",
    title: "Diagnóstico Social",
    text: "Realizamos diagnósticos en el territorio para identificar y atender las necesidades reales de cada comunidad.",
  },
  {
    icon: "fa-solid fa-handshake-angle",
    title: "Proyectos Comunitarios",
    text: "Elaboramos proyectos, capacitaciones y eventos que vinculen a las comunidades y contribuyan a su bienestar.",
  },
];

export default function HomeHero() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[88vh] flex items-center bg-gradient-to-br from-[#872075] via-[#6d1960] to-[#4a1040] overflow-hidden"
        aria-label="Presentación Fundación Transformando Con Pazión"
      >        {/* Decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#c3171c]/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-12 md:px-20 lg:py-32">
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-20">

            {/* — Text — */}
            <div className="flex-1 text-center lg:text-left">
              <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide sm:tracking-widest text-white backdrop-blur-sm">
                Fundación · Colombia
              </span>
              <h1 className="text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl md:text-5xl lg:text-7xl">
                Transformando<br />
                Con{" "}
                <span className="text-[#f9a8d4]">Pazión</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75 sm:text-xl">
                Construimos paz, convivencia y oportunidades reales para la juventud y comunidades vulnerables de Colombia.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link
                  href="/nosotros/organizacion"
                  className="btn border-none bg-white px-8 font-bold text-[#872075] shadow-xl shadow-black/20 hover:bg-gray-50"
                >
                  Conócenos
                </Link>
                <Link
                  href="/procesos"
                  className="btn border-2 border-white/60 bg-transparent px-8 text-white hover:bg-white hover:text-[#872075]"
                >
                  Ver procesos
                  <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* — Image — */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-3 rounded-3xl bg-white/10 blur-xl" />
                <div aria-hidden="true" className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-white/30 to-transparent" />
                <Image
                  src="/images/ClubDeportivoTCP.png"
                  alt="Fundación Transformando Con Pazión"
                  width={420}
                  height={420}
                  priority
                  className="relative w-52 rounded-3xl sm:w-72 lg:w-96"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Wave */}
        <div aria-hidden="true" className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: '60px', display: 'block', width: '100%' }}>
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section aria-label="Impacto de la fundación" className="bg-[#f9fafb] px-6 pt-16 pb-8 sm:px-12 md:px-20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-3xl font-extrabold text-[#872075] sm:text-4xl">{s.number}</p>
              <p className="mt-2 text-sm font-medium leading-tight text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISIÓN Y VISIÓN ── */}
      <section aria-label="Misión y visión" className="bg-[#f9fafb] px-6 py-16 sm:px-12 md:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-gray-900">Propósito y Rumbo</h2>
            <p className="mt-2 text-lg text-gray-500">Lo que nos mueve y hacia dónde vamos</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Misión */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#872075] to-[#5a1050] p-10 text-white shadow-2xl">
              <div aria-hidden="true" className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
              <i className="fa-solid fa-bullseye mb-5 text-3xl opacity-70" aria-hidden="true" />
              <h3 className="mb-4 text-2xl font-extrabold uppercase tracking-wider">Misión</h3>
              <p className="text-sm leading-relaxed text-white/85">
                Somos una fundación sin ánimo de lucro, reconocida a nivel nacional e internacional por nuestro impacto positivo en la educación, el ambiente, el deporte y la cultura de miles de personas que han mejorado su calidad de vida y su participación ciudadana, gracias a nuestra gestión eficiente, transparente y solidaria.
              </p>
            </div>

            {/* Visión */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c3171c] to-[#8b1012] p-10 text-white shadow-2xl">
              <div aria-hidden="true" className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div aria-hidden="true" className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
              <i className="fa-solid fa-rocket mb-5 text-3xl opacity-70" aria-hidden="true" />
              <h3 className="mb-4 text-2xl font-extrabold uppercase tracking-wider">Visión</h3>
              <p className="text-sm leading-relaxed text-white/85">
                En los próximos tres años, nuestra fundación se propone brindar oportunidades de educación, ambiente, deporte y cultura a las personas en situación de vulnerabilidad en todo el país, mediante proyectos innovadores, sostenibles y participativos que contribuyan a la paz y la convivencia social.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── OBJETIVOS ── */}
      <section aria-label="Objetivos de la fundación" className="bg-[#f9fafb] px-6 pb-24 sm:px-12 md:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-gray-900">Nuestros Objetivos</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {objectives.map((obj) => (
              <div
                key={obj.title}
                className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#872075]/10">
                  <i className={`${obj.icon} text-xl text-[#872075]`} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{obj.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{obj.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
