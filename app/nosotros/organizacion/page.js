import WaveHeader from "@/components/ui/WaveHeader";
import PrincipiosSection from "@/components/about/principios/PrincipiosSection";
import ValoresSection from "@/components/about/valores/ValoresSection";
import LogotipoSection from "@/components/about/logotipo/LogotipoSection";

export const metadata = {
  title: "Nuestra Organización",
  description:
    "Conoce la esencia, historia, principios y valores de la Fundación Transformando Con Pazión.",
};

const stats = [
  { icon: "fa-solid fa-calendar-days", value: "2017", label: "Año de fundación" },
  { icon: "fa-solid fa-users", value: "14–28", label: "Rango de edad" },
  { icon: "fa-solid fa-location-dot", value: "Comuna 15", label: "Guayabal, Medellín" },
  { icon: "fa-solid fa-handshake-angle", value: "100%", label: "Sin ánimo de lucro" },
];

const timeline = [
  {
    year: "2017",
    icon: "fa-solid fa-flag",
    title: "Fundación TCP nace",
    desc: "Creada el 17 de diciembre en la comuna 15 Guayabal La Colinita, Medellín.",
  },
  {
    year: "2018",
    icon: "fa-solid fa-futbol",
    title: "Primeros talleres deportivos",
    desc: "Inicio de entrenamientos en Futsala y Fútbol de Salón para la población juvenil.",
  },
  {
    year: "2019",
    icon: "fa-solid fa-laptop",
    title: "Formación empresarial",
    desc: "Talleres de Office y liderazgo empresarial para potenciar el desarrollo integral.",
  },
  {
    year: "2020",
    icon: "fa-solid fa-trophy",
    title: "Liga Guayabal & Club Deportivo TCP",
    desc: "Proyectos sociales y económicos de gran impacto en la comunidad.",
  },
];

export default function AboutOrganizacionPage() {
  return (
    <>
      <WaveHeader title="Nuestra Organización" subtitle="Una historia hecha con pasión" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Stats bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#872075]/10">
                <i className={`${s.icon} text-[#872075] text-lg`} aria-hidden="true" />
              </div>
              <span className="text-2xl font-extrabold text-gray-900">{s.value}</span>
              <span className="text-xs text-gray-500 leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ¿Quiénes somos? — 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-7 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">¿Quiénes somos?</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Somos una fundación que trabaja con jóvenes, hinchas y comunidad en pro de la sana
              convivencia, formulando proyectos que lleven el significado de la paz y convivencia.
              Aportamos por medio de eventos a la integración de los demás grupos u organizaciones
              sociales con el fin de unir la ciudad y generar el gran aporte del trabajo en equipo
              y la paz por medio del deporte, educación y cultura.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "fa-solid fa-peace", label: "Paz y convivencia" },
              { icon: "fa-solid fa-futbol", label: "Deporte" },
              { icon: "fa-solid fa-book-open", label: "Educación" },
              { icon: "fa-solid fa-music", label: "Cultura" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 rounded-2xl bg-[#872075]/5 border border-[#872075]/10 p-6 text-center">
                <i className={`${item.icon} text-3xl text-[#872075]`} aria-hidden="true" />
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reseña histórica — 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-7 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reseña histórica</h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-4 text-sm">
              <p>
                <strong className="text-gray-900">La Fundación Transformando Con Pazión</strong> se crea el 17 de
                diciembre del año 2017 en Medellín y está ubicada en la comuna 15 Guayabal La Colinita.
              </p>
              <p>
                Con más de dos años de experiencia, se inicia con un objetivo específico que es disminuir
                las problemáticas que existen entre aficionados al deporte o hinchas, así como crear
                oportunidades para la población juvenil donde su rango de edad es entre los 14 a los 28
                años, estrategias del aprovechamiento del tiempo libre y aumento del desarrollo integral
                de las comunidades.
              </p>
              <p>
                Por medio de diferentes actividades y acciones sociales, actualmente se realizan varios
                talleres de formación: entrenamiento deportivo en Futsala y Fútbol de Salón,
                talleres de formación en herramientas en Office y liderazgo empresarial. Entre los
                proyectos sociales y económicos de gran impacto se encuentra la Liga Guayabal 2020
                y el Club Deportivo TCP.
              </p>
              <p>
                La Fundación TCP lleva un trabajo articulado con la alcaldía de Medellín, comunidad y
                líderes sociales con el fin de aumentar la participación, generar un ambiente de
                convivencia y paz y crear nuevas economías que impulsen el desarrollo y auto
                sostenimiento de la comuna 15.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative pl-8 border-l-2 border-[#872075]/20 space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-[#872075] ring-4 ring-white">
                  <i className={`${item.icon} text-white text-xs`} aria-hidden="true" />
                </div>
                <span className="text-xs font-bold text-[#872075] uppercase tracking-widest">{item.year}</span>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <PrincipiosSection />
        <ValoresSection />
        <LogotipoSection />

      </div>
    </>
  );
}
