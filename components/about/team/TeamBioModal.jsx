"use client";
import { useEffect } from "react";
import Image from "next/image";

export default function TeamBioModal({ member, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const socials = [
    { href: member.instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
    { href: member.facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { href: member.twitter, icon: "fa-brands fa-x-twitter", label: "Twitter" },
  ].filter((s) => s.href);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-label={`Perfil de ${member.nombre}`}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar perfil"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
        >
          <i className="fa-solid fa-xmark" aria-hidden="true" />
        </button>

        {/* Photo header */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={member.image}
            alt={`Foto de ${member.nombre}`}
            fill
            className="object-cover object-top"
            sizes="512px"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#872075] to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h2 className="text-xl font-extrabold text-white">{member.nombre}</h2>
            <span className="inline-block mt-1 text-xs font-semibold text-white/80 bg-white/20 px-3 py-0.5 rounded-full">
              {member.puesto}
            </span>
          </div>
        </div>

        {/* Bio content */}
        <div className="px-6 py-6 space-y-3">
          {member.bio && (
            <p className="text-sm text-gray-700 leading-relaxed font-medium">{member.bio}</p>
          )}
          {member.bioExtended && (
            <p className="text-sm text-gray-500 leading-relaxed">{member.bioExtended}</p>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div className="pt-3 flex items-center gap-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Redes sociales</span>
              <div className="flex gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={`${s.label} de ${member.nombre}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#872075]/10 text-[#872075] hover:bg-[#872075] hover:text-white transition-colors">
                    <i className={`${s.icon} text-sm`} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
