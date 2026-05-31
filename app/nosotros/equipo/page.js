import WaveHeader from "@/components/ui/WaveHeader";
import TeamGrid from "@/components/about/team/TeamGrid";

export const metadata = {
  title: "Nuestro Equipo",
  description: "Conoce el equipo administrativo de la Fundación Transformando Con Pazión.",
};

export default function AboutTeamPage() {
  return (
    <>
      <WaveHeader title="Nuestro Equipo" subtitle="Las personas que mueven la fundación" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Somos un equipo comprometido con la transformación social de la comunidad. Cada persona aporta
            su talento, pasión y liderazgo para construir un mejor presente y futuro en la comuna 15.
          </p>
        </div>
        <TeamGrid />
      </div>
    </>
  );
}
