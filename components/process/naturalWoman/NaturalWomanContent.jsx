import Image from "next/image";

const pills = [
  { icon: "fa-heart",       label: "Autoestima" },
  { icon: "fa-camera",      label: "Modelaje" },
  { icon: "fa-users",       label: "Proyecto social" },
  { icon: "fa-star",        label: "Empoderamiento" },
];

const services = [
  {
    image: "/images/procesos/naturalWoman/woman1.webp",
    isLogo: false,
    icon: "fa-chalkboard-user",
    titulo: "Charlas y Capacitaciones",
    descripcion:
      "Encuentros, charlas y capacitaciones enfocadas en el modelaje, la autoestima y el impacto social del cuerpo femenino.",
  },
  {
    image: "/images/procesos/naturalWoman/woman2.webp",
    isLogo: true,
    icon: "fa-calendar-star",
    titulo: "Eventos de Modelaje",
    descripcion:
      "Eventos que buscan mostrar la naturaleza del cuerpo femenino, rompiendo tabús y paradigmas sociales.",
  },
  {
    image: null,
    isLogo: false,
    icon: "fa-camera",
    titulo: "Estudio Audiovisual",
    descripcion:
      "Sesiones fotográficas, producción de video y presentaciones para visibilizar a las participantes del proyecto.",
  },
];

export default function NaturalWomanContent() {
  return (
    <div className="space-y-12 pb-12">

      {/* ── HERO ── */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/images/procesos/naturalWoman/woman3.webp"
            alt="Natural Woman — sesión fotográfica grupal"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden shadow">
              <Image
                src="/images/procesos/NaturalWoman.webp"
                alt="Logo Natural Woman"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800">Natural Woman</h2>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Somos un proyecto de modelos con enfoque social que busca aumentar la
            autoestima y la seguridad sobre el cuerpo femenino, generando confianza
            y mitigando los tabús que tiene la sociedad sobre la mujer.
          </p>

          <div className="flex flex-wrap gap-2">
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

      {/* ── CTA INSCRIPCIONES ── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#872075] to-[#c3171c] p-px shadow-lg">
        <div className="rounded-[calc(1rem-1px)] bg-white px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#872075] mb-1">
              ¡Inscripciones abiertas!
            </p>
            <h3 className="text-xl font-extrabold text-gray-800">
              Haz parte de Natural Woman
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Regístrate y únete a nuestra comunidad de mujeres empoderadas.
            </p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfXpZqnZmka6ym9MhrVSTRtxHMKymlwidyJxkHzdTw9OA0tFw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6e1960] transition-colors text-white font-bold px-6 py-3 text-sm shadow"
          >
            <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
            Inscribirme ahora
          </a>
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
              {s.image && !s.isLogo && (
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
              )}
              {s.image && s.isLogo && (
                <div className="relative aspect-video w-full bg-[#fdf2fb] flex items-center justify-center">
                  <Image
                    src={s.image}
                    alt={s.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain p-6"
                    loading="lazy"
                  />
                </div>
              )}
              {!s.image && (
                <div className="aspect-video w-full bg-gradient-to-br from-[#872075]/10 to-[#c3171c]/5 flex items-center justify-center">
                  <i className={`fa-solid ${s.icon} text-[#872075] text-4xl opacity-40`} aria-hidden="true" />
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
        <div className="rounded-2xl bg-gradient-to-br from-[#872075]/10 to-[#c3171c]/5 border border-[#872075]/20 p-8">
          <div className="flex flex-wrap justify-center gap-8">

            {/* Teléfono */}
            <a
              href="tel:+573005411725"
              className="flex flex-col items-center gap-2 group min-w-[120px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#872075]/10 group-hover:bg-[#872075]/20 transition-colors">
                <i className="fa-solid fa-phone text-[#872075] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Teléfono</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#872075] transition-colors underline underline-offset-2 decoration-[#872075]/40">
                300 541 1725
              </span>
            </a>

            {/* Email */}
            <a
              href="mailto:naturalwomanmed@gmail.com"
              className="flex flex-col items-center gap-2 group min-w-[120px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#872075]/10 group-hover:bg-[#872075]/20 transition-colors">
                <i className="fa-solid fa-envelope text-[#872075] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Correo</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#872075] transition-colors underline underline-offset-2 decoration-[#872075]/40 break-all">
                naturalwomanmed@gmail.com
              </span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/NaturalWomanMed/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group min-w-[120px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1877f2]/10 group-hover:bg-[#1877f2]/20 transition-colors">
                <i className="fa-brands fa-facebook-f text-[#1877f2] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Facebook</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#1877f2] transition-colors underline underline-offset-2 decoration-[#1877f2]/40">
                Natural Woman
                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/natural_woman_med?igsh=MWtqdzE3MjYyd2Y2Yw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group min-w-[120px]"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#e1306c]/10 group-hover:bg-[#e1306c]/20 transition-colors">
                <i className="fa-brands fa-instagram text-[#e1306c] text-lg" aria-hidden="true" />
              </span>
              <span className="text-xs text-gray-500 font-medium">Instagram</span>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-[#e1306c] transition-colors underline underline-offset-2 decoration-[#e1306c]/40">
                @natural_woman_med
                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px] opacity-50" aria-hidden="true" />
              </span>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}
