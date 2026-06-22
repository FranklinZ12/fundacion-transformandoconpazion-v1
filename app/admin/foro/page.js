import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import ForoPanel from "@/components/admin/ForoPanel";

export const metadata = { title: "Foros" };

export default async function ForoAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "administrador" && profile?.status === "approved";

  if (!profile || profile.status !== "approved") {
    redirect("/admin");
  }

  const admin = createAdminClient();

  const { data: forums } = await admin
    .from("forums")
    .select("*, coordinator:coordinator_id(id, name)")
    .order("name", { ascending: true });

  const accessibleForums = (forums ?? []).filter((f) => {
    if (isAdmin) return true;
    const coordId = f.coordinator?.id || f.coordinator_id;
    return coordId === user.id;
  });

  if (!isAdmin && accessibleForums.length === 0) {
    redirect("/foro");
  }

  const { data: users } = isAdmin
    ? await admin
        .from("profiles")
        .select("id, name")
        .eq("status", "approved")
        .order("name")
    : { data: [] };

  const forumIds = accessibleForums.map((f) => f.id);

  const [{ data: posts }, { data: memberships }] = await Promise.all([
    forumIds.length > 0
      ? admin
          .from("forum_posts")
          .select("*, profiles(id, name), forums(slug)")
          .in("forum_id", forumIds)
          .order("is_pinned", { ascending: false })
          .order("created_at", { ascending: false })
      : { data: [] },
    admin.from("forum_members").select("*").limit(500),
  ]);

  return (
    <ForoPanel
      profile={profile}
      forums={accessibleForums}
      posts={posts ?? []}
      memberships={memberships ?? []}
      users={users ?? []}
    />
  );
}
