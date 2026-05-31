import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { procesosData } from "@/lib/procesos";
import CurvedHeader from "@/components/ui/CurvedHeader";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import Descripcion from "@/components/ui/Descripcion";

// Lazy import sub-components (keep bundle per-page)
import TCPCategorias from "@/components/process/deportivoTCP/TCPCategorias";
import EsySuContent from "@/components/process/esysu/EsySuContent";
import JovempServices from "@/components/process/jovemp/JovempServices";
import AgaServices from "@/components/process/aga/AgaServices";
import NaturalWomanServices from "@/components/process/naturalWoman/NaturalWomanServices";
import CronicasServices from "@/components/process/cronicas/CronicasServices";
import TCPlayContent from "@/components/process/tcplay/TCPlayContent";

const headerMap = {
  "medellin-barrista":           { title: "Medellín Barrista",          subtitle: "Hinchas y Aficionados al Deporte" },
  "club-deportivo-tcp":          { title: "Club Deportivo TCP",          subtitle: "Fútbol de Salón" },
  "es-y-su":                     { title: "ES&SU",                       subtitle: "Estampación y Sublimación" },
  "jovemp":                      { title: "Jovemp",                      subtitle: "Jóvenes Emprendedores" },
  "a-g-a":                       { title: "Grupo Ambiental Juvenil",     subtitle: "TCP" },
  "natural-woman":               { title: "Natural Woman",               subtitle: "Mujeres Empoderadas" },
  "cronicas-y-pasion-deportiva": { title: "Crónicas y Pasión Deportiva", subtitle: "Programa deportivo" },
  "tcplay":                      { title: "TC Play",                     subtitle: "¡Sé el más Tezo!" },
};

export async function generateStaticParams() {
  return procesosData
    .filter((p) => p.link !== null)
    .map((p) => ({ slug: p.link }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const proceso = procesosData.find((p) => p.link === slug);
  return {
    title: proceso?.nombre ?? "Proceso",
    description: proceso?.descripcion ?? "",
  };
}

function BackButton() {
  return (
    <div className="my-4 px-4">
      <Link href="/procesos" className="btn btn-ghost btn-sm gap-2">
        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        Volver a Procesos
      </Link>
    </div>
  );
}

export default async function ProcesoSlugPage({ params }) {
  const { slug } = await params;
  const header = headerMap[slug];
  if (!header) notFound();

  let content;
  switch (slug) {
    case "medellin-barrista":
      content = (
        <>
          <Descripcion
            title="Misión"
            parrafo="Organización que busca transformar la problemática de barras bravas en el municipio de Medellín por medio del barrismo social, la convivencia, la paz y la sana afición."
          />
          <div className="mt-8 flex justify-center">
            <a
              href="https://guayabal-barrista.webnode.com.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-[#872075] hover:bg-[#6a195b] text-white border-none"
            >
              <i className="fa-solid fa-globe mr-2" aria-hidden="true" />
              Visitar sitio web
            </a>
          </div>
        </>
      );
      break;
    case "club-deportivo-tcp":
      content = (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
            {["uniforme1", "uniforme2", "uniformeDT"].map((name) => (
              <Image
                key={name}
                src={`/images/procesos/deportivoTCP/${name}.webp`}
                alt={name}
                width={400}
                height={400}
                className="w-full rounded-xl object-cover shadow"
                loading="lazy"
              />
            ))}
          </div>
          <Descripcion
            title="Categorías"
            parrafo="Nuestro Club Deportivo TCP tiene un proceso deportivo en formación de la disciplina de Fútbol de Salón con diferentes categorías."
          />
          <TCPCategorias />
        </>
      );
      break;

    case "es-y-su":
      content = (
        <>
          <Descripcion
            title="¿Quiénes somos?"
            parrafo={
              <>
                Somos una microempresa de estampados y sublimación de Mugs, Camisas y Gorras, basada en diseños
                personalizados y enfocados en el gusto y personalidad del cliente.
                <br /><br />
                Nuestros diseños buscan resaltar el amor por el deporte, la cultura urbana y la identidad de cada
                persona. Trabajamos con materiales de calidad garantizando la satisfacción de cada cliente.
                <br /><br />
                Contamos con variedad de productos para todos los gustos y necesidades, desde camisetas deportivas
                hasta mugs personalizados para regalar o usar en tu día a día.
                <br /><br />
                Pedidos personalizados y al por mayor. Consúltanos por nuestras redes sociales para más información.
              </>
            }
          />
          <EsySuContent />
        </>
      );
      break;

    case "jovemp":
      content = (
        <>
          <Descripcion
            title="¿Quiénes somos?"
            parrafo="Jovemp es una organización de jóvenes emprendedores que trabajan para que los emprendimientos y unidades productivas potencien su economía y generen un impacto positivo en el sector donde se encuentran."
          />
          <JovempServices />
        </>
      );
      break;

    case "a-g-a":
      content = (
        <>
          <Descripcion
            title="¿Quiénes somos?"
            parrafo="Somos una organización de líderes ambientales que trabaja en pro del medio ambiente y sus buenas prácticas ambientales. Desde la fundación, promovemos la conciencia ecológica y el cuidado del entorno en nuestras comunidades."
          />
          <AgaServices />
        </>
      );
      break;

    case "natural-woman":
      content = <NaturalWomanServices />;
      break;

    case "cronicas-y-pasion-deportiva":
      content = (
        <>
          <Descripcion
            title="¿Quiénes somos?"
            parrafo="Programa deportivo donde se habla y debate sobre temas del deporte a nivel nacional e internacional, analizando detalladamente deportistas, equipos y disciplinas."
          />
          <SectionSubtitle titulo="Nuestros Servicios" />
          <CronicasServices />
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.facebook.com/CronicasyPasionDeportiva/?epa=SEARCH_BOX"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline border-[#872075] text-[#872075] hover:bg-[#872075] hover:text-white"
            >
              <i className="fa-brands fa-facebook-f mr-2" aria-hidden="true" />
              Facebook
            </a>
          </div>
        </>
      );
      break;

    case "tcplay":
      content = <TCPlayContent />;
      break;

    default:
      notFound();
  }

  return (
    <>
      <CurvedHeader title={header.title} subtitle={header.subtitle} />
      <section className="mx-4 sm:mx-10 md:mx-28 my-8">
        <BackButton />
        {content}
      </section>
    </>
  );
}
