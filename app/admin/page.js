import { createClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import Link from "next/link";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role, permissions, status")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">
          Bienvenido, {profile?.name ?? "usuario"} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Panel de administración — Fundación Transformando Con Pazión
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {hasPermission(profile, "edit:content") && (
          <DashCard
            icon="fa-file-pen"
            title="Editar contenido"
            desc="Modifica textos, imágenes y logos del sitio."
            href="/admin/contenido"
            color="bg-[#872075]/10 text-[#872075]"
          />
        )}
        {hasPermission(profile, "manage:users") && (
          <DashCard
            icon="fa-users"
            title="Gestionar usuarios"
            desc="Aprueba solicitudes y asigna roles."
            href="/admin/usuarios"
            color="bg-[#c3171c]/10 text-[#c3171c]"
          />
        )}
        <DashCard
          icon="fa-house"
          title="Ver el sitio"
          desc="Abre el sitio público en una nueva pestaña."
          href="/"
          external
          color="bg-gray-100 text-gray-600"
        />
      </div>
    </div>
  );
}

function DashCard({ icon, title, desc, href, external, color }) {
  const extraProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...extraProps}
      className="group flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <i className={`fa-solid ${icon} text-lg`} aria-hidden="true" />
      </div>
      <div>
        <p className="font-extrabold text-gray-800 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}
