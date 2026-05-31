import Image from "next/image";

const pills = [
  { icon: "fa-leaf",          label: "Medio ambiente" },
  { icon: "fa-recycle",       label: "Reciclaje" },
  { icon: "fa-seedling",      label: "Sostenibilidad" },
  { icon: "fa-users",         label: "Liderazgo juvenil" },
  { icon: "fa-earth-americas",label: "Conciencia ecológica" },
];

const iniciativas = [
  {
    icon: "fa-chalkboard-user",
    titulo: "Educación Ambiental",
    descripcion:
      "Talleres y jornadas formativas para jóvenes y comunidades sobre el cuidado del medio ambiente y la adopción de hábitos ecológicos sostenibles.",
  },
  {
    icon: "fa-recycle",
    titulo: "Buenas Prácticas",
    descripcion:
      "Promovemos el reciclaje, la reducción de residuos y el uso responsable de los recursos naturales como pilares de nuestra acción comunitaria.",
  },
  {
    icon: "fa-star",
    titulo: "Liderazgo Juvenil",
    descripcion:
      "Formamos líderes ambientales comprometidos con la transformación de su entorno, impulsando proyectos de impacto en sus barrios y comunidades.",
  },
];

export default function GrupoAmbientalContent() {
  return (
    <div className="space-y-14 pb-12">

      {/* ── HERO ── */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-600/10 to-teal-500/5 border border-emerald-600/15 px-8 py-10 flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md bg-white p-2">
          <Image
            src="/images/procesos/grupoAmbiental.webp"
            alt="Logo Grupo Ambiental Juvenil TCP"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="flex flex-col gap-4 text-center sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
              Grupo Ambiental Juvenil TCP
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl">
              Somos una organización de líderes ambientales que trabaja en pro
              del medio ambiente y sus buenas prácticas ambientales. Desde la
              fundación, promovemos la conciencia ecológica y el cuidado del
              entorno en nuestras comunidades.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {pills.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 text-emerald-700 text-xs font-semibold px-3 py-1"
              >
                <i className={`fa-solid ${p.icon} text-[10px]`} aria-hidden="true" />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── INICIATIVAS ── */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-6 w-1 rounded-full bg-emerald-600" />
          <h2 className="text-xl font-extrabold text-gray-800 uppercase tracking-wide">
            Nuestras Iniciativas
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {iniciativas.map((item) => (
            <article
              key={item.titulo}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-3"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600/10 self-start">
                <i
                  className={`fa-solid ${item.icon} text-emerald-700 text-base`}
                  aria-hidden="true"
                />
              </span>
              <h3 className="font-bold text-gray-800">{item.titulo}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.descripcion}</p>
            </article>
          ))}
        </div>
      </div>

    </div>
  );
}
