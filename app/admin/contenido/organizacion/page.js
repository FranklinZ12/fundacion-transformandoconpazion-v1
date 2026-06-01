import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { getContent } from "@/lib/content";
import OrganizacionEditor from "@/components/admin/contenido/OrganizacionEditor";
import Link from "next/link";

export const metadata = { title: "Editar Organización" };

export default async function EditarOrganizacionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles").select("role, permissions, status").eq("id", user.id).single();

  if (!hasPermission(profile, "edit:content")) redirect("/admin");

  const content = await getContent("organizacion");

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/contenido" className="hover:text-[#872075] transition-colors">Contenido</Link>
        <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
        <span className="text-gray-700 font-medium">Organización</span>
      </div>
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Editar Organización</h1>
        <p className="text-sm text-gray-500 mt-1">Quiénes somos, reseña histórica, timeline, principios y valores.</p>
      </div>
      <OrganizacionEditor content={content} />
    </div>
  );
}
