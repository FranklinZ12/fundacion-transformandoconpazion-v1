import Image from "next/image";

export default function TeamCard({ image, nombre, puesto, bio, instagram, facebook, twitter, featured = false, onClick }) {
  const socials = [
    { href: instagram, icon: "fa-brands fa-instagram", label: "Instagram" },
    { href: facebook, icon: "fa-brands fa-facebook-f", label: "Facebook" },
    { href: twitter, icon: "fa-brands fa-x-twitter", label: "Twitter" },
  ].filter((s) => s.href);

  return (
    <article
      className={`group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${featured ? "ring-2 ring-[#872075]/30" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`Ver perfil de ${nombre}`}
    >
      {/* Photo */}
      <div className={`relative overflow-hidden bg-gray-100 ${featured ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
        <Image
          src={`/images/teamImages/${image}.webp`}
          alt={`Foto de ${nombre}`}
          fill
          sizes={featured ? "(max-width: 640px) 100vw, 400px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#872075]/80 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
          <span className="text-white text-sm font-semibold">Ver perfil</span>
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={`${s.label} de ${nombre}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-[#872075] transition-colors">
                  <i className={`${s.icon} text-sm`} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
      </div>

      {/* Info */}
      <div className="px-5 py-4">
        <h3 className={`font-bold text-gray-900 ${featured ? "text-lg" : "text-base"}`}>{nombre}</h3>
        <span className="inline-block mt-1 text-xs font-semibold text-[#872075] bg-[#872075]/10 px-3 py-0.5 rounded-full">
          {puesto}
        </span>
        {bio && (
          <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">{bio}</p>
        )}
      </div>
    </article>
  );
}
