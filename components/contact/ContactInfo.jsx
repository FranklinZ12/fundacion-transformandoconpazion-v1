import { getContent } from "@/lib/content";

export default async function ContactInfo() {
  const c = await getContent("contacto");

  const items = [
    { icon: "fa-solid fa-location-dot",  label: "Dirección",          text: c.address },
    { icon: "fa-solid fa-clock",         label: "Horario de oficina", text: c.schedule },
    { icon: "fa-brands fa-whatsapp",     label: "WhatsApp",           text: c.whatsapp,  href: c.whatsapp_url },
    { icon: "fa-solid fa-envelope",      label: "Correo",             text: c.email,     href: `mailto:${c.email}` },
  ];

  const socials = [
    { icon: "fa-brands fa-youtube",    label: "YouTube",    href: c.socials?.youtube },
    { icon: "fa-brands fa-twitter",    label: "Twitter",    href: c.socials?.twitter },
    { icon: "fa-brands fa-instagram",  label: "Instagram",  href: c.socials?.instagram },
    { icon: "fa-brands fa-facebook-f", label: "Facebook",   href: c.socials?.facebook },
  ].filter((s) => s.href);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#872075] to-[#4a1040] p-10 text-white shadow-2xl h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
          Fundación TCP
        </span>
        <h2 className="text-3xl font-extrabold leading-tight">
          Hablemos.<br />
          <span className="text-white/70 font-normal text-2xl">Estamos para ayudarte.</span>
        </h2>
        <p className="mt-4 text-white/60 text-sm leading-relaxed">
          Escríbenos, llámanos o visítanos. Nuestro equipo responde entre semana en horario de oficina.
        </p>
      </div>

      {/* Contact items */}
      <address className="not-italic mt-10 space-y-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10">
              <i className={`${item.icon} text-lg`} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-0.5">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white hover:text-white/80 transition-colors whitespace-pre-line"
                >
                  {item.text}
                </a>
              ) : (
                <span className="text-sm font-semibold text-white/90 whitespace-pre-line">{item.text}</span>
              )}
            </div>
          </div>
        ))}
      </address>

      {/* Social links */}
      <div className="mt-10 border-t border-white/10 pt-8">
        <p className="text-xs font-bold uppercase tracking-wider text-white/50 mb-4">Síguenos</p>
        <div className="flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <i className={`${s.icon} text-base`} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

