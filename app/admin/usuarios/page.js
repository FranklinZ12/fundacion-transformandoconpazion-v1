import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import UsersPanel from "@/components/admin/UsersPanel";

export const metadata = { title: "Usuarios" };

export default async function UsuariosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, permissions, status")
    .eq("id", user.id)
    .single();

  if (!hasPermission(profile, "manage:users")) redirect("/admin");

  // Usar cliente admin para bypassear RLS y leer todos los perfiles
  const adminSupabase = createAdminClient();
  const [{ data: profiles }, { data: { users: authUsers } }, { data: categories }, { data: assignments }] = await Promise.all([
    adminSupabase
      .from("profiles")
      .select("id, name, role, permissions, status, created_at")
      .neq("id", user.id)
      .order("created_at", { ascending: false }),
    adminSupabase.auth.admin.listUsers({ perPage: 1000 }),
    adminSupabase
      .from("sports_categories")
      .select("id, code, name")
      .eq("active", true)
      .order("name"),
    adminSupabase
      .from("sports_user_categories")
      .select("user_id, category_id"),
  ]);

  // Adjuntar email de auth a cada perfil
  const emailMap = Object.fromEntries((authUsers ?? []).map((u) => [u.id, u.email]));
  const assignmentMap = (assignments ?? []).reduce((acc, row) => {
    acc[row.user_id] = acc[row.user_id] ?? [];
    acc[row.user_id].push(row.category_id);
    return acc;
  }, {});
  const users = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.id] ?? null,
    categoryIds: assignmentMap[p.id] ?? [],
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Usuarios</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona solicitudes de acceso y permisos del equipo.
        </p>
      </div>
      <UsersPanel users={users ?? []} categories={categories ?? []} currentUserId={user.id} />
    </div>
  );
}
