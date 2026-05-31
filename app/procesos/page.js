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
      <ProcessHero titulo="Proyectos y" titulo2="Procesos" subtitulo="2019–2024" />
      <div className="mx-4 sm:mx-10 md:mx-20 my-12 flex justify-center">
        <ProcessGrid />
      </div>
    </>
  );
}
