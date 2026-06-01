import Image from "next/image";
import Link from "next/link";
import WaveHeader from "@/components/ui/WaveHeader";
import { getContent } from "@/lib/content";

export const metadata = {
  title: "Voluntario y Donación",
  description:
    "Únete como voluntario o realiza una donación a la Fundación Transformando Con Pazión.",
};

const TIER_STYLES = [
  { color: "from-[#872075]/10 to-[#872075]/5", iconBg: "bg-[#872075]/10 text-[#872075]" },
  { color: "from-[#c3171c]/10 to-[#c3171c]/5", iconBg: "bg-[#c3171c]/10 text-[#c3171c]" },
  { color: "from-purple-50 to-pink-50",         iconBg: "bg-purple-100 text-purple-600" },
];

export default async function AboutDonationsPage() {
  const {
    voluntariado_titulo, voluntariado_subtitulo, roles,
    donaciones_titulo, donaciones_subtitulo, tiers,
    impacto_titulo, impacto_subtitulo, impact_stats,
    cta_titulo, cta_subtitulo,
  } = await getContent("voluntario");

  return (
    <>
      <WaveHeader title="Voluntario y Donación" subtitle="Transformamos la vida de cada joven" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">

        {/* VOLUNTARIADO */}
        <section aria-labelledby="voluntariado-heading">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-widest text-[#872075] uppercase mb-3">
              Voluntariado
            </span>
            <h2 id="voluntariado-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {voluntariado_titulo}
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              {voluntariado_subtitulo}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <article key={i} className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={role.image}
                    alt={role.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#872075] px-3 py-1 text-[11px] font-bold text-white shadow">
                    <i className={`${role.icon} text-[10px]`} aria-hidden="true" />
                    {role.badge}
                  </span>
                </div>
                <div className="px-5 py-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{role.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 mb-8 flex justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full bg-[#872075] hover:bg-[#6a195b] text-white font-semibold text-sm px-8 py-3.5 transition-colors shadow-lg shadow-[#872075]/30"
            >
              <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
              Quiero ser voluntario
            </Link>
          </div>
        </section>

      </div>

      {/* DONACIONES */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <section aria-labelledby="donaciones-heading">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">

              <div>
                <span className="inline-block text-xs font-bold tracking-widest text-[#c3171c] uppercase mb-3">
                  Donaciones
                </span>
                <h2 id="donaciones-heading" className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                  {donaciones_titulo}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-md">
                  {donaciones_subtitulo}
                </p>

                <div className="space-y-4">
                  {tiers.map((tier, i) => {
                    const style = TIER_STYLES[i] ?? TIER_STYLES[0];
                    return (
                      <div key={i} className={`flex items-start gap-4 rounded-2xl bg-gradient-to-r ${style.color} p-5`}>
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}>
                          <i className={`${tier.icon} text-lg`} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                            <h3 className="text-sm font-bold text-gray-900">{tier.title}</h3>
                            <span className="text-xs font-semibold text-gray-500 bg-white/70 px-2.5 py-0.5 rounded-full">
                              {tier.value}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{tier.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl bg-gradient-to-br from-[#872075] to-[#5a1050] p-8 text-white shadow-xl">
                  <div className="mb-6">
                    <p className="text-xs font-bold tracking-widest text-purple-200 uppercase mb-1">Nuestro impacto</p>
                    <h3 className="text-xl font-extrabold">{impacto_titulo}</h3>
                    <p className="text-sm text-purple-200 mt-1 leading-relaxed">{impacto_subtitulo}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {impact_stats.map((s, i) => (
                      <div key={i} className="rounded-2xl bg-white/10 p-4 text-center">
                        <i className={`${s.icon} text-xl text-purple-200 mb-2`} aria-hidden="true" />
                        <div className="text-2xl font-extrabold">{s.value}</div>
                        <div className="text-[11px] text-purple-200 leading-tight mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/contacto"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-[#c3171c] hover:bg-[#a01216] text-white font-semibold text-sm py-4 transition-colors shadow-lg shadow-[#c3171c]/30"
                >
                  <i className="fa-solid fa-coins" aria-hidden="true" />
                  Contactar para donar
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-r from-[#872075] to-[#5a1050] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            {cta_titulo}
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            {cta_subtitulo}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#872075] font-bold text-sm px-8 py-3.5 hover:bg-purple-50 transition-colors"
            >
              <i className="fa-solid fa-hand-holding-heart" aria-hidden="true" />
              Ser Voluntario
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/60 text-white font-bold text-sm px-8 py-3.5 hover:bg-white/10 transition-colors"
            >
              <i className="fa-solid fa-coins" aria-hidden="true" />
              Hacer Donación
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
