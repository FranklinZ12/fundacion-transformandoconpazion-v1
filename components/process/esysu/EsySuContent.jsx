import Image from "next/image";

const BASE = "/images/procesos/esysu";

const stats = [
  { icon: "fa-solid fa-shirt",         value: "Estampación",  label: "Técnica 1" },
  { icon: "fa-solid fa-mug-hot",        value: "Sublimación",  label: "Técnica 2" },
  { icon: "fa-solid fa-box-open",       value: "4+",           label: "Productos" },
  { icon: "fa-solid fa-people-group",   value: "A medida",     label: "Pedidos" },
];

const productos = [
  {
    icon: "fa-solid fa-mug-hot",
    accent: "#872075",
    nombre: "Mugs",
    variantes: [
      { label: "Sencillo",       precio: "$14.000" },
      { label: "Color interno",  precio: "$16.000" },
      { label: "Mágico",         precio: "$18.000" },
    ],
  },
  {
    icon: "fa-solid fa-hat-cowboy",
    accent: "#c3171c",
    nombre: "Gorras",
    variantes: [
      { label: "Personalizada",  precio: "$15.000" },
    ],
  },
  {
    icon: "fa-solid fa-shirt",
    accent: "#0ea5e9",
    nombre: "Camisas",
    variantes: [
      { label: "Estampada",      precio: "$22.000" },
    ],
  },
  {
    icon: "fa-solid fa-gift",
    accent: "#16a34a",
    nombre: "Anchetas",
    variantes: [
      { label: "Personalizadas", precio: "Consultar" },
    ],
  },
];

const servicios = [
  {
    icon: "fa-solid fa-spray-can-sparkles",
    titulo: "Estampación",
    desc: "Aplicamos tu diseño sobre camisas, gorras y más usando técnicas de alta calidad y durabilidad.",
  },
  {
    icon: "fa-solid fa-fire",
    titulo: "Sublimación",
    desc: "Impresión permanente en mugs, telas y superficies especiales con colores vivos que no se borran.",
  },
  {
    icon: "fa-solid fa-chalkboard-user",
    titulo: "Capacitación",
    desc: "Talleres de formación en técnicas de estampación y sublimación para emprendedores y comunidad.",
  },
];

export default function EsySuContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-14 py-4">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={`${BASE}/esysu1.webp`}
            alt="ES&SU — Estampación y Sublimación"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-5">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-2">
              Microempresa · Guayabal
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              Diseños que reflejan tu estilo y pasión
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>ES&SU</strong> es una microempresa de estampados y sublimación especializada en diseños
            personalizados que resaltan el amor por el deporte, la cultura urbana y la identidad de cada
            persona. Trabajamos con materiales de calidad garantizando la satisfacción total.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#872075]/10">
                  <i className={`${s.icon} text-[#872075] text-sm`} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Productos y Precios ───────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Productos y Precios</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {productos.map((p) => (
            <div
              key={p.nombre}
              className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shrink-0"
                  style={{ backgroundColor: p.accent }}
                >
                  <i className={p.icon} aria-hidden="true" />
                </div>
                <h3 className="font-extrabold text-gray-900">{p.nombre}</h3>
              </div>
              <div className="space-y-2">
                {p.variantes.map((v) => (
                  <div
                    key={v.label}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5"
                  >
                    <span className="text-sm text-gray-600">{v.label}</span>
                    <span className="text-sm font-extrabold text-gray-900">{v.precio}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-gray-400 text-center">
          * Precios de referencia. Pedidos al por mayor con descuento especial.
        </p>
      </div>

      {/* ── Servicios ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Servicios</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {servicios.map((s) => (
            <div
              key={s.titulo}
              className="rounded-2xl bg-white border border-gray-100 p-6 flex flex-col gap-3 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#872075] text-white text-lg">
                <i className={s.icon} aria-hidden="true" />
              </div>
              <p className="font-extrabold text-gray-900 text-sm">{s.titulo}</p>
              <p className="text-xs text-gray-500 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Galería ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Galería</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["esysu1", "esysu2", "esysu3"].map((img) => (
            <div key={img} className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-gray-100">
              <Image
                src={`${BASE}/${img}.webp`}
                alt={`ES&SU — ${img}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 33vw, 200px"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Instagram CTA ─────────────────────────────────── */}
      <div className="rounded-2xl bg-gradient-to-r from-[#f9a8d4] via-[#c084fc] to-[#818cf8] p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white text-2xl shadow">
          <i className="fa-brands fa-instagram" aria-hidden="true" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-extrabold text-white">Síguenos en Instagram</p>
          <p className="text-sm text-white/80 mt-0.5">
            Últimos diseños, promociones y pedidos en nuestras redes.
          </p>
        </div>
        <a
          href="https://www.instagram.com/esysu_personalizado/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white text-[#872075] hover:bg-white/90 px-5 py-2.5 text-sm font-bold transition-colors shadow"
        >
          <i className="fa-brands fa-instagram text-sm" aria-hidden="true" />
          @esysu_personalizado
        </a>
      </div>

    </div>
  );
}

