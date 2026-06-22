import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";

export default async function ForumLink({ slug }) {
  const admin = createAdminClient();
  const { data: forum } = await admin
    .from("forums")
    .select("slug, name")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!forum) return null;

  return (
    <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#872075]/8 to-[#c3171c]/5 border border-[#872075]/15 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-[#872075]">
            <i className="fa-solid fa-comments text-lg" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#872075]">Foro de {forum.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Entérate de los anuncios y participa en la conversación de este proyecto.
            </p>
          </div>
        </div>
        <Link
          href={`/foro/${forum.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#872075] text-white font-bold py-3 px-6 text-sm hover:bg-[#6f1a60] transition-colors whitespace-nowrap shadow-lg shadow-[#872075]/20"
        >
          Ver foro
          <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
