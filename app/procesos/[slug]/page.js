import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { procesosData } from "@/lib/procesos";
import CurvedHeader from "@/components/ui/CurvedHeader";
import SectionSubtitle from "@/components/ui/SectionSubtitle";
import Descripcion from "@/components/ui/Descripcion";

// Lazy import sub-components (keep bundle per-page)
import TCPCategorias from "@/components/process/deportivoTCP/TCPCategorias";
import ClubDeportivoTCPContent from "@/components/process/deportivoTCP/ClubDeportivoTCPContent";
import EsySuContent from "@/components/process/esysu/EsySuContent";
import JovempContent from "@/components/process/jovemp/JovempContent";
import GrupoAmbientalContent from "@/components/process/grupoAmbiental/GrupoAmbientalContent";
import AgaProductionsContent from "@/components/process/agaProductions/AgaProductionsContent";
import NaturalWomanContent from "@/components/process/naturalWoman/NaturalWomanContent";
import CronicasContent from "@/components/process/cronicas/CronicasContent";
import TCPlayContent from "@/components/process/tcplay/TCPlayContent";
import TorneoBarrialContent from "@/components/process/torneoBarrial/TorneoBarrialContent";
import LigaGuayabalContent from "@/components/process/ligaGuayabal/LigaGuayabalContent";
import MedellinBarristaContent from "@/components/process/medellinBarrista/MedellinBarristaContent";

const headerMap = {
  "medellin-barrista":           { title: "Medellín Barrista",          subtitle: "Hinchas y Aficionados al Deporte" },
  "club-deportivo-tcp":          { title: "Club Deportivo TCP",          subtitle: "Fútbol de Salón" },
  "es-y-su":                     { title: "ES&SU",                       subtitle: "Estampación y Sublimación" },
  "jovemp":                      { title: "Jovemp",                      subtitle: "Jóvenes Emprendedores" },
  "grupo-ambiental":             { title: "Grupo Ambiental Juvenil",     subtitle: "TCP" },
  "aga-productions":             { title: "A.G.A. Productions",           subtitle: "Música · Eventos · Comunidad" },
  "natural-woman":               { title: "Natural Woman",               subtitle: "Mujeres Empoderadas" },
  "cronicas-y-pasion-deportiva": { title: "Crónicas y Pasión Deportiva", subtitle: "Programa deportivo" },
  "tcplay":                      { title: "TC Play",                     subtitle: "¡Sé el más Tezo!" },
  "torneo-barrial":              { title: "Torneo Barrial",              subtitle: "Vamos pa' la cancha" },
  "liga-guayabal":               { title: "Liga Guayabal",               subtitle: "Fuerza, Talento y Pasión" },
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
    <div className="mb-6">
      <Link
        href="/procesos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#872075] bg-[#872075]/8 hover:bg-[#872075]/15 transition-colors px-4 py-2 rounded-full group"
      >
        <i className="fa-solid fa-arrow-left text-xs transition-transform duration-200 group-hover:-translate-x-1.5" aria-hidden="true" />
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
      content = <MedellinBarristaContent />;
      break;
    case "club-deportivo-tcp":
      content = <ClubDeportivoTCPContent />;
      break;

    case "es-y-su":
      content = <EsySuContent />;
      break;

    case "jovemp":
      content = <JovempContent />;
      break;

    case "grupo-ambiental":
      content = <GrupoAmbientalContent />;
      break;

    case "aga-productions":
      content = <AgaProductionsContent />;
      break;

    case "natural-woman":
      content = <NaturalWomanContent />;
      break;

    case "cronicas-y-pasion-deportiva":
      content = <CronicasContent />;
      break;

    case "torneo-barrial":
      content = <TorneoBarrialContent />;
      break;

    case "liga-guayabal":
      content = <LigaGuayabalContent />;
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
