import ProcessHero from "@/components/process/ProcessHero";
import ProcessGrid from "@/components/process/ProcessGrid";

export const metadata = {
  title: "Proyectos y Procesos",
  description:
    "Conoce todos los proyectos y procesos sociales, deportivos y culturales de la Fundación Transformando Con Pazión.",
};

export default function ProcesosPage() {
  return (
    <>
      <ProcessHero titulo="Proyectos y" titulo2="Procesos" subtitulo={`2019\u2013${new Date().getFullYear()}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <ProcessGrid />
      </div>
    </>
  );
}
