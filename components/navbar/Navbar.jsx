"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import MobileMenu from "./MobileMenu";

export const navLinks = [
  { href: "/", label: "Inicio", exact: true },
  {
    href: "/nosotros/organizacion",
    label: "Nosotros",
    dropdown: [
      { href: "/nosotros/organizacion", label: "Nuestra Organización", icon: "fa-building", desc: "Nuestra esencia e historia." },
      { href: "/nosotros/equipo", label: "Nuestro Equipo", icon: "fa-users", desc: "El equipo detrás de la misión." },
      { href: "/nosotros/voluntario-y-donaciones", label: "Voluntario y Donación", icon: "fa-hand-holding-heart", desc: "Únete y apoya la causa." },
    ],
  },
  {
    href: "/procesos",
    label: "Procesos",
    dropdown: [
      { href: "/procesos", label: "Todos los Procesos", icon: "fa-grip" },
      { href: "/procesos/medellin-barrista", label: "Medellín Barrista", icon: "fa-futbol" },
      { href: "/procesos/club-deportivo-tcp", label: "Club Deportivo TCP", icon: "fa-shirt" },
      { href: "/procesos/es-y-su", label: "ES&SU", icon: "fa-people-group" },
      { href: "/procesos/jovemp", label: "Jovemp", icon: "fa-person-running" },
      { href: "/procesos/a-g-a", label: "A.G.A Productions", icon: "fa-leaf" },
      { href: "/procesos/natural-woman", label: "Natural Woman", icon: "fa-venus" },
      { href: "/procesos/cronicas-y-pasion-deportiva", label: "Crónicas y Pasión", icon: "fa-microphone" },
      { href: "/procesos/tcplay", label: "TC Play", icon: "fa-gamepad" },
    ],
  },
  { href: "/foro", label: "Foros" },
  { href: "/contacto", label: "Contacto" },
];

function isActive(pathname, href, exact) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`navbar-fixed transition-all duration-300 ${
        scrolled ? "shadow-md shadow-black/8" : "shadow-sm"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6"
        aria-label="Navegación principal"
      >
        {/* Brand */}
        <Link
          href="/"
          aria-label="Inicio — Fundación TCP"
          className="flex items-center gap-3 flex-shrink-0 group"
        >
          <Logo />
          <div className="leading-tight hidden sm:block">
            <span className="block text-sm font-extrabold text-gray-900 group-hover:text-[#872075] transition-colors">
              Fundación TCP
            </span>
            <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-widest">
              Transformando Con Pazión
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5 flex-1 justify-center" role="list">
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return item.dropdown ? (
              <li key={item.href} className="relative group">
                <button
                  className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? "text-[#872075] bg-[#872075]/8"
                      : "text-gray-600 hover:text-[#872075] hover:bg-gray-50"
                  }`}
                  aria-haspopup="true"
                >
                  {item.label}
                  <i
                    className="fa-solid fa-angle-down text-[10px] transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                  {active && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[#872075]" />
                  )}
                </button>
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-2 opacity-0 pointer-events-none translate-y-2 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-200 ease-out"
                  role="menu"
                >
                  <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 z-10" />
                  <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-2 min-w-[240px]">
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        role="menuitem"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          pathname === sub.href
                            ? "bg-[#872075]/8 text-[#872075]"
                            : "text-gray-700 hover:bg-[#872075]/5 hover:text-[#872075]"
                        }`}
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#872075]/8 text-[#872075]">
                          <i className={`fa-solid ${sub.icon} text-xs`} aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block font-semibold">{sub.label}</span>
                          {sub.desc && (
                            <span className="block text-[11px] text-gray-400 mt-0.5 leading-tight">{sub.desc}</span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? "text-[#872075] bg-[#872075]/8"
                      : "text-gray-600 hover:text-[#872075] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-[#872075]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right: CTA + Login + Mobile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/admin/login"
            className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-[#872075] px-4 py-2.5 text-sm font-bold text-[#872075] hover:bg-[#872075]/8 transition-all duration-200"
          >
            <i className="fa-solid fa-circle-user text-sm" aria-hidden="true" />
            Ingresar
          </Link>
          <Link
            href="/contacto"
            className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-[#872075] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#872075]/20 hover:bg-[#6d1960] hover:shadow-[#872075]/30 transition-all duration-200"
          >
            Contáctanos
            <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
          </Link>
          <MobileMenu links={navLinks} pathname={pathname} />
        </div>
      </nav>
    </header>
  );
}
