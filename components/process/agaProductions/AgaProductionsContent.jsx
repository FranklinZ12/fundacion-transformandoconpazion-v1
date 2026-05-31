import Image from "next/image";

const pills = [
  { icon: "fa-music",        label: "Música urbana" },
  { icon: "fa-bolt",         label: "Electrónica" },
  { icon: "fa-calendar-star",label: "Eventos y shows" },
  { icon: "fa-microphone",   label: "Producción" },
  { icon: "fa-users",        label: "Comunidad" },
];

const services = [
  {
    image: "/images/procesos/aga/aga3.webp",
    isLogo: false,
    icon: "fa-sliders",
    titulo: "Producción Musical",
    descripcion:
      "Producción y mezcla de audio profesional para artistas del género urbano y electrónico, con equipos de alta calidad para lograr el mejor sonido.",
  },
  {
    image: "/images/procesos/aga/aga1.webp",
    isLogo: false,
    icon: "fa-star",
    titulo: "Eventos y Shows",
    descripcion:
      "Organizamos y producimos eventos y shows para la comunidad, generando espacios de entretenimiento y cultura a través de la música.",
  },
  {
    image: "/images/procesos/aga/aga2.webp",
    isLogo: true,
    icon: "fa-compact-disc",
    titulo: "Artistas y Proyectos",
    descripcion:
      "Impulsamos artistas y proyectos musicales de la comunidad, brindando apoyo en producción, difusión y desarrollo artístico.",
  },
];

export default function AgaProductionsContent() {
  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/8 border border-[#872075]/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <Image
            src="/images/procesos/AGA.webp"
            alt="Logo A.G.A. Productions"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              A.G.A. Productions
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Organización de Artistas del género urbano y electrónico cuyo
              enfoque está basado en la producción de música y generación de
              eventos y shows para nuestra comunidad.
            </p>
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

      {/* ── SERVICIOS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Lo que hacemos
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.titulo}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              {s.isLogo ? (
                <div className="relative aspect-video w-full bg-gray-900 flex items-center justify-center p-4">
                  <Image
                    src={s.image}
                    alt={s.titulo}
                    fill
                    className="object-contain p-4"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative aspect-video w-full">
                  <Image
                    src={s.image}
                    alt={s.titulo}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
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

      {/* ── CONTACTO ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Contáctanos
          </h2>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-[#872075]/10 to-[#c3171c]/5 border border-[#872075]/20 p-8 flex justify-center">
          <a
            href="https://www.facebook.com/AGAProduct/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2]/10 group-hover:bg-[#1877f2]/20 transition-colors">
              <i className="fa-brands fa-facebook-f text-[#1877f2] text-lg" aria-hidden="true" />
            </span>
            <span className="text-xs text-gray-500 font-medium">Facebook</span>
            <span className="text-sm font-semibold text-gray-800 group-hover:text-[#1877f2] transition-colors underline underline-offset-2 decoration-[#1877f2]/40">
              A.G.A. Productions
              <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
            </span>
          </a>
        </div>
      </div>

    </div>
  );
}
