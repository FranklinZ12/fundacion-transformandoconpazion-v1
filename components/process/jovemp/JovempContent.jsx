import Image from "next/image";

const pills = [
  { icon: "fa-rocket",         label: "Emprendimiento" },
  { icon: "fa-handshake",      label: "Red empresarial" },
  { icon: "fa-store",          label: "Ferias y eventos" },
  { icon: "fa-chalkboard-user",label: "Capacitaciones" },
  { icon: "fa-lightbulb",      label: "Economía comunitaria" },
];

const services = [
  {
    image: "/images/procesos/jovemp/jov1.webp",
    titulo: "Charlas y Capacitaciones",
    descripcion:
      "Periódicamente se hacen capacitaciones y charlas enfocadas en la gestión de recursos, administración y emprendimientos.",
    icon: "fa-chalkboard-user",
  },
  {
    image: "/images/procesos/jovemp/jov2.webp",
    titulo: "Red de Empresarios",
    descripcion:
      "Articulamos todos los negocios nuevos y emprendimientos que quieren promocionar sus productos y posicionarlos en el mercado.",
    icon: "fa-handshake",
  },
  {
    image: "/images/procesos/jovemp/jov3.webp",
    titulo: "Ferias y Eventos",
    descripcion:
      "Las ferias de emprendimiento y los eventos de empresarios nos ayudan a mostrar productos y servicios, aumentar ventas y posicionar marca.",
    icon: "fa-store",
  },
];

export default function JovempContent() {
  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ── */}
      <div className="rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/5 border border-[#872075]/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
        {/* Logo */}
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <Image
            src="/images/procesos/Jovemp.webp"
            alt="Logo Jovemp"
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </div>

        {/* Texto + pills */}
        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Jóvenes Emprendedores
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Jovemp es una organización de jóvenes emprendedores que trabajan
              para que los emprendimientos y unidades productivas potencien su
              economía y generen un impacto positivo en el sector donde se
              encuentran.
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
            Nuestros Servicios
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <article
              key={s.titulo}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={s.image}
                  alt={s.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#872075]/10">
                    <i
                      className={`fa-solid ${s.icon} text-[#872075] text-xs`}
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="font-bold text-gray-800 text-sm">{s.titulo}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {s.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── CONTACTO / REDES ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Contáctanos
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#872075]/10 to-[#c3171c]/5 border border-[#872075]/20 p-8">
          <div className="flex flex-wrap justify-center gap-6">
            {/* Email */}
            <a
              href="mailto:jovemprend@gmail.com"
              className="flex flex-col items-center gap-2 group min-w-[140px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#872075]/10 group-hover:bg-[#872075]/20 transition-colors">
                <i className="fa-solid fa-envelope text-[#872075] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Correo</span>
              <span className="text-sm font-semibold text-gray-800 break-all group-hover:text-[#872075] transition-colors underline underline-offset-2 decoration-[#872075]/40">
                jovemprend@gmail.com
              </span>
            </a>

            {/* Facebook */}
            <a
              href="http://www.facebook.com/pages/example-account/197494372329"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group min-w-[140px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2]/10 group-hover:bg-[#1877f2]/20 transition-colors">
                <i className="fa-brands fa-facebook-f text-[#1877f2] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Facebook</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#1877f2] transition-colors underline underline-offset-2 decoration-[#1877f2]/40">
                Jovemp Jóvenes Emprendedores
                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
              </span>
            </a>

            {/* Twitter / X */}
            <a
              href="https://twitter.com/Jovemprend"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group min-w-[140px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900/10 group-hover:bg-gray-900/20 transition-colors">
                <i className="fa-brands fa-x-twitter text-gray-800 text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Twitter / X</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors underline underline-offset-2 decoration-gray-400/60">
                @Jovemprend
                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
