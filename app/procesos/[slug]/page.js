import { notFound } from "next/navigation";
import Link from "next/link";
import { getContent, CONTENT_DEFAULTS } from "@/lib/content";
import { createAdminClient } from "@/lib/supabase/server";
import CurvedHeader from "@/components/ui/CurvedHeader";
import GenericProcessContent from "@/components/process/GenericProcessContent";

// Static extra-section imports (complex processes keep their unique sections)
import ClubDeportivoTCPContent from "@/components/process/deportivoTCP/ClubDeportivoTCPContent";
import EsySuContent from "@/components/process/esysu/EsySuContent";
import TCPlayContent from "@/components/process/tcplay/TCPlayContent";
import TorneoBarrialContent from "@/components/process/torneoBarrial/TorneoBarrialContent";
import LigaGuayabalContent from "@/components/process/ligaGuayabal/LigaGuayabalContent";
import MedellinBarristaContent from "@/components/process/medellinBarrista/MedellinBarristaContent";

// Processes whose layout is fully handled by GenericProcessContent

export async function generateStaticParams() {
  // Must use admin client (no cookies) — generateStaticParams runs at build time
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("site_content")
      .select("data")
      .eq("id", "procesos")
      .single();
    const processes = data?.data?.processes ?? CONTENT_DEFAULTS.procesos?.processes ?? [];
    return processes.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
  } catch {
    // Fallback to static defaults if DB unreachable at build time
    return (CONTENT_DEFAULTS.procesos?.processes ?? [])
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug }));
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { processes } = await getContent("procesos");
  const proceso = processes.find((p) => p.slug === slug);
  return {
    title: proceso?.nombre ?? "Proceso",
    description: proceso?.card_descripcion ?? "",
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

// Processes fully handled by GenericProcessContent
const GENERIC_SLUGS = new Set([
  "jovemp",
  "grupo-ambiental",
  "aga-productions",
  "natural-woman",
  "cronicas-y-pasion-deportiva",
]);

export default async function ProcesoSlugPage({ params }) {
  const { slug } = await params;
  const { processes } = await getContent("procesos");
  const proceso = processes.find((p) => p.slug === slug);
  if (!proceso) notFound();

  let content;
  if (GENERIC_SLUGS.has(slug)) {
    content = <GenericProcessContent data={proceso} />;
  } else {
    switch (slug) {
      case "medellin-barrista":
        content = <MedellinBarristaContent descripcion={proceso.hero_descripcion} />;
        break;
      case "club-deportivo-tcp":
        content = <ClubDeportivoTCPContent descripcion={proceso.hero_descripcion} />;
        break;
      case "es-y-su":
        content = <EsySuContent descripcion={proceso.hero_descripcion} />;
        break;
      case "tcplay":
        content = <TCPlayContent />;
        break;
      case "liga-guayabal":
        content = <LigaGuayabalContent descripcion={proceso.hero_descripcion} />;
        break;
      case "torneo-barrial":
        content = <TorneoBarrialContent descripcion={proceso.hero_descripcion} />;
        break;
      default:
        notFound();
    }
  }

  return (
    <>
      <CurvedHeader title={proceso.header_title} subtitle={proceso.header_subtitle} />
      <section className="mx-4 sm:mx-10 md:mx-28 my-8">
        <BackButton />
        {content}
      </section>
    </>
  );
}
