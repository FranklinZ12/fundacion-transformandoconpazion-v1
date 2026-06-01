import { principios as defaultPrincipios } from "@/lib/principios";
import InfoCardList from "../InfoCardList";

export default function PrincipiosSection({ items }) {
  return (
    <section aria-labelledby="principios-heading" className="pt-4 pb-8">
      <div className="text-center mb-6">
        <h2 id="principios-heading" className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Principios <span className="text-[#872075]">Corporativos</span>
        </h2>
        <p className="text-gray-500 mt-2">Los pilares que guían nuestra gestión</p>
      </div>
      <InfoCardList items={items ?? defaultPrincipios} />
    </section>
  );
}
