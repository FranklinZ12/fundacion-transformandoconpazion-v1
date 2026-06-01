import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import { getContent } from "@/lib/content";
import ProcesosEditor from "@/components/admin/contenido/ProcesosEditor";
import Link from "next/link";

export const metadata = { title: "Procesos · Admin" };

export default async function ProcesosAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles").select("role, permissions, status").eq("id", user.id).single();

  if (!hasPermission(profile, "edit:content")) redirect("/admin");

  const content = await getContent("procesos");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/contenido" className="hover:text-[#872075] transition-colors">Contenido</Link>
        <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
        <span className="text-gray-700 font-medium">Procesos</span>
      </nav>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Proyectos y Procesos</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edita la tarjeta, el encabezado, la descripción, etiquetas y servicios de cada proceso.
        </p>
      </div>

      <ProcesosEditor content={content} />
    </div>
  );
}
