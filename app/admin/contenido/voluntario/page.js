import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { getContent } from "@/lib/content";
import VoluntarioEditor from "@/components/admin/contenido/VoluntarioEditor";
import Link from "next/link";

export const metadata = { title: "Editar Voluntario y Donaciones" };

export default async function EditarVoluntarioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles").select("role, permissions, status").eq("id", user.id).single();

  if (!hasPermission(profile, "edit:content")) redirect("/admin");

  const content = await getContent("voluntario");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/contenido" className="hover:text-[#872075] transition-colors">Contenido</Link>
        <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
        <span className="text-gray-700 font-medium">Voluntario y Donaciones</span>
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Editar Voluntario y Donaciones</h1>
        <p className="text-sm text-gray-500 mt-1">Roles de voluntariado, tiers de donación, estadísticas de impacto y CTA final.</p>
      </div>
      <VoluntarioEditor content={content} />
    </div>
  );
}
