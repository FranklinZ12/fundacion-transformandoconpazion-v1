import { valores as defaultValores } from "@/lib/valores";
import InfoCardList from "../InfoCardList";

export default function ValoresSection({ items }) {
  return (
    <section aria-labelledby="valores-heading" className="pt-4 pb-8">
      <div className="text-center mb-6">
        <h2 id="valores-heading" className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Nuestros <span className="text-[#872075]">Valores</span>
        </h2>
        <p className="text-gray-500 mt-2">Lo que nos mueve como equipo y como fundación</p>
      </div>
      <InfoCardList items={items ?? defaultValores} />
    </section>
  );
}
