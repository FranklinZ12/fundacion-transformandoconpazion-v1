import Image from "next/image";

/**
 * GenericProcessContent
 * Renders the standard layout shared by all processes:
 *   - Hero section  (logo-box layout OR full-photo layout)
 *   - Pills / tags row
 *   - Items grid  (services / iniciativas / sections)
 *
 * Props: data object from CMS (see lib/content.js procesos defaults)
 */
export default function GenericProcessContent({ data = {} }) {
  const {
    hero_layout     = "logo",
    hero_image      = null,
    hero_descripcion = "",
    pills           = [],
    items           = [],
  } = data;

  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ─────────────────────────────────────────── */}
      {hero_layout === "logo" ? (
        <LogoHero image={hero_image} descripcion={hero_descripcion} pills={pills} />
      ) : (
        <PhotoHero image={hero_image} descripcion={hero_descripcion} pills={pills} />
      )}

      {/* ── ITEMS GRID ───────────────────────────────────── */}
      {items.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
              Lo que hacemos
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Logo hero (gradient card + square logo box) ─────────── */
function LogoHero({ image, descripcion, pills }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/5 border border-[#872075]/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
      {image && (
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <Image
            src={image}
            alt="Logo del proceso"
            fill
            sizes="144px"
            className="object-contain"
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-4 text-center sm:text-left">
        <p className="text-gray-600 leading-relaxed max-w-xl">{descripcion}</p>

        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {pills.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#872075]/10 text-[#872075] text-xs font-semibold px-3 py-1"
              >
                <i className={`fa-solid ${p.icon} text-[10px]`} aria-hidden="true" />
                {p.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Photo hero (large image + description block below) ───── */
function PhotoHero({ image, descripcion, pills }) {
  return (
    <div className="space-y-6">
      {image && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={image}
            alt="Imagen del proceso"
            fill
            sizes="(max-width: 1024px) 100vw, 80vw"
            className="object-cover"
            priority
            unoptimized={image?.startsWith("http")}
          />
        </div>
      )}

      <p className="text-gray-600 leading-relaxed">{descripcion}</p>

      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((p, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#872075]/10 text-[#872075] text-xs font-semibold px-3 py-1"
            >
              <i className={`fa-solid ${p.icon} text-[10px]`} aria-hidden="true" />
              {p.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Item card ────────────────────────────────────────────── */
function ItemCard({ item }) {
  const { icon, titulo, descripcion, image } = item;

  return (
    <article className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      {image && (
        <div className="relative aspect-video w-full">
          <Image
            src={image}
            alt={titulo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            unoptimized={image?.startsWith("http")}
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        {icon && (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#872075]/10">
              <i className={`fa-solid ${icon} text-[#872075] text-sm`} aria-hidden="true" />
            </span>
          </div>
        )}
        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{titulo}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{descripcion}</p>
      </div>
    </article>
  );
}
