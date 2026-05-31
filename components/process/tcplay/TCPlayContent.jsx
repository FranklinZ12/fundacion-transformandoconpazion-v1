import Image from "next/image";
import DescripcionItem from "@/components/ui/DescripcionItem";

const paquetes = [
  { subtitulo: "TC Play Classic", descripcion: "Pronóstico Clásico 4 partidos", valor: "1.000$" },
  { subtitulo: "TC Play Premium", descripcion: "Pronóstico 5 partidos", valor: "2.000$" },
  { subtitulo: "TC Play Platinum", descripcion: "Pronóstico Exclusivo 6 partidos", valor: "4.000$" },
];

export default function TCPlayContent() {
  return (
    <>
      {/* Hero */}
      <div className="hero py-12">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <Image
            src="/images/procesos/TCPlay.webp"
            alt="TC Play"
            width={400}
            height={400}
            className="max-w-xs rounded-xl shadow-2xl"
            loading="lazy"
          />
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Quiénes somos?</h2>
            <ul className="text-gray-700 space-y-3 leading-relaxed list-none">
              <li>— Este es el espacio para pronosticar y acertar resultados del deporte.</li>
              <li>— Se estará actualizando constantemente la página ya que los partidos son cambiantes en sus horarios.</li>
              <li>— El ganador dejará para #TCPlay el 10% de fondos de administración.</li>
              <li>— Sé el más Tezo y acierta en los resultados.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Paquetes */}
      <section aria-labelledby="tcplay-paquetes-heading" className="mt-8">
        <div className="mb-4">
          <h2 id="tcplay-paquetes-heading" className="font-bold text-xl text-gray-800 uppercase tracking-wide">
            Paquetes — Valores
          </h2>
        </div>
        {paquetes.map((p) => (
          <DescripcionItem key={p.subtitulo} subtitulo={p.subtitulo} descripcion={p.descripcion} valor={p.valor} />
        ))}
      </section>

      {/* Detalles de cada paquete */}
      <div className="mt-10 space-y-6">
        <div>
          <h3 className="title-descripcion">TCPlay Classic</h3>
          <p className="text-gray-700">
            Este paquete Classic tiene un valor correspondiente de 1.000$. Para ganarse el acumulado completo debe
            estar pronosticando siempre en cada paquete publicado (Gana, Pierde o Empate). Si pronosticó uno de los
            paquetes y el siguiente no, pero el que le sigue sí, solo participa de los pronosticados, mas no del
            acumulado completo.
          </p>
        </div>
        <hr className="border-gray-200" />
        <div>
          <h3 className="title-descripcion">TCPlay Premium</h3>
          <p className="text-gray-700">
            Este paquete Premium tiene un valor correspondiente de 2.000$. Para ganarse el acumulado completo debe
            estar pronosticando siempre en cada paquete publicado (Gana, Pierde o Empate). Si pronosticó uno de los
            paquetes y el siguiente no, pero el que le sigue sí, solo participa de los pronosticados, mas no del
            acumulado completo.
          </p>
        </div>
        <hr className="border-gray-200" />
        <div>
          <h3 className="title-descripcion">TCPlay Platinum</h3>
          <p className="text-gray-700">
            Este paquete Platinum tiene un valor correspondiente de 4.000$. Para ganarse el acumulado completo debe
            estar pronosticando siempre en cada paquete publicado (Gana, Pierde o Empate). Si pronosticó uno de los
            paquetes y el siguiente no, pero el que le sigue sí, solo participa de los pronosticados, mas no del
            acumulado completo.
          </p>
        </div>
      </div>
    </>
  );
}
