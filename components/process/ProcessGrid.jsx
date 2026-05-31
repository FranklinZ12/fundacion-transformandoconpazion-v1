import { procesosData } from "@/lib/procesos";
import ProcessCard from "./ProcessCard";

export default function ProcessGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-8 w-full">
      {procesosData.map((proceso, i) => (
        <ProcessCard
          key={proceso.image}
          image={proceso.image}
          nombre={proceso.nombre}
          descripcion={proceso.descripcion}
          link={proceso.link}
          priority={i === 0}
        />
      ))}
    </div>
  );
}
