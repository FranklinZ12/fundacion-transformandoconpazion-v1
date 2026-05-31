"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

function isActive(pathname, href, exact) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function MobileMenu({ links, pathname }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        className="p-2 rounded-xl text-gray-600 hover:text-[#872075] hover:bg-[#872075]/8 transition-colors"
      >
        <i className="fa-solid fa-bars text-xl" aria-hidden="true" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <nav
        id="mobile-drawer"
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Menú móvil"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-sm font-extrabold text-gray-900">Fundación TCP</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
            className="ml-2 flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
          </button>
        </div>

        {/* Links */}
        <ul className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5" role="list">
          {links.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <li key={item.href}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() =>
                        setExpanded(expanded === item.href ? null : item.href)
                      }
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#872075]/8 text-[#872075]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#872075]"
                      }`}
                      aria-expanded={expanded === item.href}
                    >
                      <span className="flex items-center gap-2">
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#872075]" />}
                        {item.label}
                      </span>
                      <i
                        className={`fa-solid fa-angle-down text-xs transition-transform duration-200 ${
                          expanded === item.href ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {expanded === item.href && (
                      <ul className="mt-1 ml-3 border-l-2 border-[#872075]/15 pl-3 pb-1 space-y-0.5">
                        {item.dropdown.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                                pathname === sub.href
                                  ? "bg-[#872075]/8 text-[#872075] font-semibold"
                                  : "text-gray-600 hover:text-[#872075] hover:bg-[#872075]/5"
                              }`}
                            >
                              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#872075]/8 text-[#872075]">
                                <i className={`fa-solid ${sub.icon} text-xs`} aria-hidden="true" />
                              </span>
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#872075]/8 text-[#872075]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#872075]"
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-[#872075]" />}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="px-4 pb-4 pt-2 border-t border-gray-100">
          <Link
            href="/contacto"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#872075] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#872075]/20 hover:bg-[#6d1960] transition-all duration-200 mb-4"
          >
            <i className="fa-solid fa-envelope text-xs" aria-hidden="true" />
            Contáctanos
          </Link>
          {/* Social */}
          <div className="flex items-center justify-center gap-5">
            <a href="https://www.instagram.com/fundacion_tcp/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Fundación TCP" className="text-gray-400 hover:text-[#872075] transition-colors">
              <i className="fa-brands fa-instagram text-lg" aria-hidden="true" />
            </a>
            <a href="https://www.facebook.com/transformando.con.pazionn/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Fundación TCP" className="text-gray-400 hover:text-[#872075] transition-colors">
              <i className="fa-brands fa-facebook-f text-lg" aria-hidden="true" />
            </a>
            <a href="https://twitter.com/FundacionTCP/" target="_blank" rel="noopener noreferrer" aria-label="Twitter Fundación TCP" className="text-gray-400 hover:text-[#872075] transition-colors">
              <i className="fa-brands fa-twitter text-lg" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@transformandoconpazion" target="_blank" rel="noopener noreferrer" aria-label="YouTube Fundación TCP" className="text-gray-400 hover:text-[#c3171c] transition-colors">
              <i className="fa-brands fa-youtube text-lg" aria-hidden="true" />
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
