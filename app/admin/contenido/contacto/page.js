import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import { getContent } from "@/lib/content";
import ContactoEditor from "@/components/admin/contenido/ContactoEditor";
import Link from "next/link";

export const metadata = { title: "Editar Contacto" };

export default async function EditarContactoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions, status")
    .eq("id", user.id)
    .single();

  if (!hasPermission(profile, "edit:content")) redirect("/admin");

  const content = await getContent("contacto");

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/admin/contenido" className="hover:text-[#872075] transition-colors">
          Contenido
        </Link>
        <i className="fa-solid fa-angle-right text-xs" aria-hidden="true" />
        <span className="text-gray-700 font-semibold">Contacto</span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Editar Contacto</h1>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza la información de contacto visible en el sitio público.
        </p>
      </div>

      <ContactoEditor content={content} />
    </div>
  );
}
