import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros/organizacion", label: "Organización" },
  { href: "/nosotros/equipo", label: "Equipo" },
  { href: "/nosotros/voluntarios-donaciones", label: "Voluntarios" },
  { href: "/procesos", label: "Procesos" },
  { href: "/contacto", label: "Contacto" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/fundacion_tcp/",
    label: "Instagram",
    icon: "fa-brands fa-instagram",
  },
  {
    href: "https://www.facebook.com/transformando.con.pazionn/",
    label: "Facebook",
    icon: "fa-brands fa-facebook-f",
  },
  {
    href: "https://twitter.com/FundacionTCP/",
    label: "Twitter / X",
    icon: "fa-brands fa-x-twitter",
  },
  {
    href: "https://www.youtube.com/@FundacionTCP",
    label: "YouTube",
    icon: "fa-brands fa-youtube",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#872075] text-white" role="contentinfo">
      {/* Wave transition from page background */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="block w-full h-12 sm:h-14">
          <path d="M0,32 C360,60 1080,0 1440,32 L1440,0 L0,0 Z" fill="#f9fafb" />
        </svg>
      </div>
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/pajaroTCP.png"
                alt="Logo Fundación TCP"
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
              <div className="leading-tight">
                <span className="block text-base font-extrabold tracking-tight">Fundación TCP</span>
                <span className="block text-[11px] text-purple-200 uppercase tracking-wide">
                  Transformando Con Pazión
                </span>
              </div>
            </div>
            <p className="text-sm text-purple-100 leading-relaxed max-w-xs">
              Organización sin ánimo de lucro que transforma vidas a través del deporte, la cultura
              y la educación en las comunidades de Colombia.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} Fundación TCP`}
                  className="text-purple-200 hover:text-white transition-colors text-lg"
                >
                  <i className={s.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
              Navegación
            </h3>
            <nav aria-label="Navegación footer">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-purple-100 hover:text-white transition-colors hover:underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-purple-100">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-0.5 text-purple-300" aria-hidden="true" />
                <span>Medellín, Antioquia, Colombia</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-envelope mt-0.5 text-purple-300" aria-hidden="true" />
                <a
                  href="mailto:fundaciontransformandoconpazion@gmail.com"
                  className="hover:text-white transition-colors break-words"
                >
                  fundaciontransformandoconpazion@gmail.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                <i className="fa-solid fa-paper-plane text-xs" aria-hidden="true" />
                Envíanos un mensaje
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-purple-200">
            © {new Date().getFullYear()} Fundación Transformando Con Pazión — Todos los derechos reservados
          </p>
          <p className="text-xs text-purple-300">Hecho con <span aria-label="amor">❤️</span> en Colombia</p>
        </div>
      </div>
    </footer>
  );
}
