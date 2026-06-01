"use client";

import { useState } from "react";
import Image from "next/image";

const BASE = "https://7b43b669ac.cbaul-cdnwnd.com/abf8e19acfe234e91b6cc22d0e299ea6";

const fotos = [
  `${BASE}/200000047-ad900ae899/11215144_473885392762587_1766784739538051554_n.jpg`,
  `${BASE}/200000049-18ecf19e5b/FB_IMG_1464004938086.jpg`,
  `${BASE}/200000050-5a5ee5b5a3/IMG-20160608-WA0028.jpg`,
  `${BASE}/200000051-8f2cf9025f/13064459_251871358500231_1769695671608960954_o-4.jpg`,
  `${BASE}/200000052-598155a7c6/13351136_10208643395738914_757042554_o.jpg`,
  `${BASE}/200000053-6181663754/13389272_10208643389818766_643681781_o.jpg`,
  `${BASE}/200000055-b9749ba6ff/13393532_10208643393498858_658917823_n.jpg`,
  `${BASE}/200000057-c9200ca18f/13400910_10208643384978645_964739262_n-2.jpg`,
  `${BASE}/200000058-c6392c7329/13401354_10208643387978720_1969758356_n-4.jpg`,
  `${BASE}/200000118-b2bf5b3b90/IMG_20170610_120902.jpg`,
  `${BASE}/200000120-a3f65a4f04/IMG-20170602-WA0035.jpg`,
  `${BASE}/200000121-e54a7e6446/IMG-20170430-WA0006.jpg`,
  `${BASE}/200000127-ac6a5ad63b/IMG_20170429_132200.jpg`,
  `${BASE}/200000122-bff69c0f42/Product_294_Field_19.jpg`,
  `${BASE}/200000125-7f7f0807a3/20a40fb0-9508-4e94-9829-d52b6714153d.jpg`,
  `${BASE}/200000124-632d464271/49091dc7-d69d-4c72-b118-56af6914f566.jpg`,
  `${BASE}/200000123-5297153904/FB_IMG_1493172398696.jpg`,
  `${BASE}/200000128-a0b3da1acd/IMG-20170106-WA0010~2.jpg`,
  `${BASE}/200000130-085900952d/IMG-20170109-WA0006.jpg`,
  `${BASE}/200000126-a880fa97ca/IMG_20160423_180411.jpg`,
  `${BASE}/200000129-1fc9920c2f/IMG_20160513_193922.jpg`,
  `${BASE}/200000131-e4ec4e5e93/0ef96dd2-3f65-4230-9b2b-6b147dc5035b.jpg`,
  `${BASE}/200000132-15e4d16deb/2598e7ce-6372-4faa-972e-bc52a346ec02.jpg`,
  `${BASE}/200000134-ad575ae3e4/04325750-a89d-4c6c-9656-77dbb2d3e571.jpg`,
  `${BASE}/200000133-6bd466ccf0/aff47d5b-0b66-4481-bd38-f2ef4c311673.jpg`,
  `${BASE}/200000135-dc213dd1be/d875c2db-7da9-431c-b682-3085a763c21a.jpg`,
  `${BASE}/200000137-0e1000f09d/0bbe1518-c78b-4af1-a374-937234b1cc28.jpg`,
  `${BASE}/200000196-c34b8c43fa/FB_IMG_1489555679312~2.jpg`,
];

const INITIAL_COUNT = 9;

const videos = [
  { id: "usAw5lbJZyc", title: "Medellín Barrista — Video 1" },
  { id: "c_O3kmlFBvw",  title: "Medellín Barrista — Video 2" },
];

const stats = [
  { icon: "fa-solid fa-calendar",    value: "2013",    label: "Fundación" },
  { icon: "fa-solid fa-city",        value: "Medellín", label: "Ciudad" },
  { icon: "fa-solid fa-users",       value: "50+",     label: "Jóvenes impactados" },
  { icon: "fa-solid fa-layer-group", value: "3",       label: "Grupos activos" },
];

const historia = [
  {
    year: "2013",
    text: "Se reúnen alrededor de 8 hinchas de equipos paisas con la idea de crear procesos y proyectos. Se forma el grupo Guayabal Barrista y se eligen 2 delegados para Presupuesto Participativo Medellín 2013, gestionando recursos para talleres de formación e instrumental del barrio.",
  },
  {
    year: "2014",
    text: "Con los delegados trabajando de la mano de la JAC Colinita, se crean: Taller Estampados Guayabal, Club Deportivo Guayabal, Instrumental Guayabal y Barrismo Social 15. Se aporta a la creación de la comisión de juventud en PP.",
  },
  {
    year: "2015",
    text: "La Organización Guayabal Barrista es reconocida a nivel de la Comuna 15, dando oportunidad a más de 50 jóvenes en diferentes procesos de formación: Instrumental Guayabal, Estampados Guayabal y Club Deportivo Guayabal.",
  },
  {
    year: "2016",
    text: "Se crea la Mesa de Paz y Convivencia enfocada en el hincha. La organización recibe charlas y capacitaciones de la Secretaría de Juventud y apuesta a todos los procesos de aprovechamiento del tiempo libre — niños, jóvenes, adultos y adultos mayores.",
  },
  {
    year: "2017",
    text: "Se crea el proyecto de la única Fundación de Hinchas de la ciudad. Los procesos evolucionan: Guayabal FC, ES&SU Guayabal y la Fundación Transformando Con Pazión que los vincula. Se planean alianzas estratégicas para el beneficio de la comuna.",
  },
  {
    year: "2019",
    text: "Se expande el proyecto a toda la ciudad de Medellín creando la Organización Medellín Barrista, buscando acompañar y ejecutar proyectos sociales de barristas e hinchas en toda la ciudad.",
  },
];

const grupos = [
  {
    icon: "fa-solid fa-users",
    title: "Guayabal Barrista",
    accent: "#872075",
    text: "Reúne a todos los hinchas de la Comuna 15 y la ciudad para que la cultura del fútbol se viva en paz, respetando el color de la camisa del club. Brinda apoyo a los procesos de hinchas y capacitaciones sobre temas de convivencia social.",
  },
  {
    icon: "fa-solid fa-shield",
    title: "DIM — Poderoso Rojo",
    accent: "#c3171c",
    text: "Espacio para los hinchas del Deportivo Independiente Medellín en los barrios de la ciudad. Cuenta con el apoyo de la organización para el progreso y proyección del hincha del Medellín, asistiendo al estadio en paz y en familia.",
  },
  {
    icon: "fa-solid fa-leaf",
    title: "NAL — Pasión Verdolaga",
    accent: "#16a34a",
    text: "Espacio para los hinchas del Atlético Nacional a nivel ciudad. Cuenta con el apoyo de la organización para el progreso y proyección del hincha verdolaga, creando unión desde la pasión por el fútbol.",
  },
];

const contacto = [
  { icon: "fa-solid fa-location-dot",  label: "Sede",      value: "Social La Colinita — Guayabal, Medellín" },
  { icon: "fa-solid fa-envelope",      label: "Correo",    value: "medellinbarrista@gmail.com", href: "mailto:medellinbarrista@gmail.com" },
  { icon: "fa-brands fa-facebook-f",   label: "Facebook",  value: "Medellín Barrista", href: "https://www.facebook.com/Guayabalbarrista/" },
  { icon: "fa-brands fa-instagram",    label: "Instagram", value: "@MedellínBarrista" },
  { icon: "fa-brands fa-x-twitter",    label: "Twitter",   value: "@MedellínBarrista" },
];

export default function MedellinBarristaContent({ descripcion }) {
  const [lightbox, setLightbox] = useState(null);
  const [showAll, setShowAll]   = useState(false);

  const visibleFotos = showAll ? fotos : fotos.slice(0, INITIAL_COUNT);

  return (
    <div className="max-w-4xl mx-auto space-y-14 py-4">

      {/* ── Hero ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={`${BASE}/200000136-ad3efae383/received_689831647860118~2.jpeg`}
            alt="Medellín Barrista — Guayabal sin Fronteras"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="space-y-5">
          <div>
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-2">
              Organización · Desde 2013
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
              Hinchas que construyen territorio de paz
            </h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {descripcion ?? "Medellín Barrista apoya proyectos sociales de hinchas y barristas, promoviendo el deporte en paz, la convivencia y el aprovechamiento del tiempo libre en dinámicas deportivas y culturales en los barrios de Medellín."}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#872075]/10">
                  <i className={`${s.icon} text-[#872075] text-sm`} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-gray-900 leading-none">{s.value}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Misión ────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#872075]/5 border border-[#872075]/20 p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#872075] text-white">
            <i className="fa-solid fa-bullseye text-sm" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Misión</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-sm">
          Somos una organización que apoya y acompaña proyectos sociales de hinchas, siempre orientados
          al <strong>deporte en paz y convivencia</strong>. Apostamos a <strong>redimensionar las formas
          de expresión</strong> de los barristas que inciden negativamente, y a potenciar sus aspectos
          positivos, fundamentándonos en el diálogo de saberes para que los hinchas, sin perder su
          esencia, re-signifiquen su realidad y asuman su identidad como <strong>sujetos sociales y
          políticos</strong>. Que la diferencia entre hinchas por el color de la camisa se respete,
          y que el fútbol se comparta en unión familiar.
        </p>
      </div>

      {/* Historia */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Nuestra Historia</h2>
        </div>
        <div className="relative ml-4 border-l-2 border-[#872075]/20 pl-8 space-y-8">
          {historia.map((h) => (
            <div key={h.year} className="relative">
              <div className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-[#872075] text-white text-xs font-extrabold shadow">
                {h.year.slice(2)}
              </div>
              <div>
                <span className="text-xs font-bold text-[#872075] tracking-widest uppercase">{h.year}</span>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nuestros grupos */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Nuestros Grupos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {grupos.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl bg-white border border-gray-100 p-6 flex flex-col gap-4 shadow-sm"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg shadow-sm"
                style={{ backgroundColor: g.accent }}
              >
                <i className={g.icon} aria-hidden="true" />
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-sm mb-2">{g.title}</p>
                <p className="text-xs text-gray-500 leading-snug">{g.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Videos ────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
          <h2 className="text-xl font-extrabold text-gray-900">Videos</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {videos.map((v) => (
            <div key={v.id} className="rounded-2xl overflow-hidden shadow-md aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${v.id}`}
                title={v.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Galería ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-gray-900">Galería de fotos</h2>
          </div>
          <span className="text-xs text-gray-400">{fotos.length} fotos</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleFotos.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox({ src, index: i })}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#872075]"
            >
              <Image
                src={src}
                alt={`Medellín Barrista — foto ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <i className="fa-solid fa-magnifying-glass-plus text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
        {!showAll && fotos.length > INITIAL_COUNT && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#872075] px-6 py-2.5 text-sm font-semibold text-[#872075] hover:bg-[#872075] hover:text-white transition-colors"
            >
              <i className="fa-solid fa-images text-sm" aria-hidden="true" />
              Ver todas las fotos ({fotos.length - INITIAL_COUNT} más)
            </button>
          </div>
        )}
      </div>

      {/* ── Contacto ──────────────────────────────────── */}
      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#872075] text-white">
            <i className="fa-solid fa-address-book text-sm" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Contacto</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacto.map((c) => (
            <div key={c.label} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#872075]/10">
                <i className={`${c.icon} text-[#872075] text-sm`} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{c.label}</p>
                {c.href ? (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#872075] hover:underline font-medium"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-700 font-medium">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
            </button>
            {lightbox.index > 0 && (
              <button
                onClick={() => setLightbox({ src: fotos[lightbox.index - 1], index: lightbox.index - 1 })}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Anterior"
              >
                <i className="fa-solid fa-chevron-left text-sm" aria-hidden="true" />
              </button>
            )}
            {lightbox.index < fotos.length - 1 && (
              <button
                onClick={() => setLightbox({ src: fotos[lightbox.index + 1], index: lightbox.index + 1 })}
                className="absolute right-12 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Siguiente"
              >
                <i className="fa-solid fa-chevron-right text-sm" aria-hidden="true" />
              </button>
            )}
            <Image
              src={lightbox.src}
              alt={`Foto ${lightbox.index + 1} de ${fotos.length}`}
              width={900}
              height={600}
              className="w-full h-auto object-contain max-h-[85vh]"
              sizes="(max-width: 768px) 100vw, 900px"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-white text-xs">
              {lightbox.index + 1} / {fotos.length}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
