import { createClient } from "@/lib/supabase/server";
import { canAccessAdmin } from "@/lib/permissions";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: {
    default: "Panel Admin",
    template: "%s | Admin — Fundación TCP",
  },
};

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Sin sesión o rutas públicas (login/register/pendiente): solo renderizar children
  if (!user) {
    return <>{children}</>;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, permissions, status, avatar_url")
    .eq("id", user.id)
    .single();

  // Usuario no aprobado: solo children (la página pendiente se muestra sola)
  if (!canAccessAdmin(profile)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar profile={profile} />
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
