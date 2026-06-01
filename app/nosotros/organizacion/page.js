import WaveHeader from "@/components/ui/WaveHeader";
import PrincipiosSection from "@/components/about/principios/PrincipiosSection";
import ValoresSection from "@/components/about/valores/ValoresSection";
import LogotipoSection from "@/components/about/logotipo/LogotipoSection";
import { getContent } from "@/lib/content";

export const metadata = {
  title: "Nuestra Organización",
  description:
    "Conoce la esencia, historia, principios y valores de la Fundación Transformando Con Pazión.",
};

export default async function AboutOrganizacionPage() {
  const { quienes_somos, resena, stats, pilares, timeline, principios, valores } = await getContent("organizacion");
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
              {quienes_somos}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {pilares.map((item) => (
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
              {resena.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
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

        <PrincipiosSection items={principios} />
        <ValoresSection items={valores} />
        <LogotipoSection />

      </div>
    </>
  );
}
