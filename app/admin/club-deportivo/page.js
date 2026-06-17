import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ClubDeportivoPanel from "@/components/admin/ClubDeportivoPanel";

export const metadata = { title: "Club Deportivo" };

const ALLOWED_ROLES = ["leader", "administrador", "consultor", "alfabetizador"];

export default async function ClubDeportivoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "approved" || !ALLOWED_ROLES.includes(profile.role)) {
    redirect("/admin");
  }

  const admin = createAdminClient();

  const [{ data: categories }, { data: userCategories }] = await Promise.all([
    admin.from("sports_categories").select("id, code, name").eq("active", true).order("name"),
    admin.from("sports_user_categories").select("category_id").eq("user_id", user.id),
  ]);

  const canManage = ["leader", "administrador"].includes(profile.role);
  const consultorUsers = canManage
    ? ((await admin
      .from("profiles")
      .select("id, name")
      .eq("role", "consultor")
      .eq("status", "approved")
      .order("name")).data ?? [])
    : [];

  if (profile.role === "consultor") {
    const { data: myAthlete } = await admin
      .from("sports_athletes")
      .select("id, full_name, user_id, category_id, height_cm, weight_kg, physical_status, active, sports_categories(name,code)")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!myAthlete) {
      return (
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold text-gray-800">Club Deportivo</h1>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            Tu usuario consultor no esta vinculado a un deportista. Pide al lider que haga la vinculacion.
          </p>
        </div>
      );
    }

    const [{ data: trainings }, { data: matches }, { data: financeRows }] = await Promise.all([
      admin
        .from("sports_trainings")
        .select("id, category_id, weekday, start_time, end_time, location, sports_categories(name,code)")
        .eq("category_id", myAthlete.category_id)
        .order("weekday")
        .order("start_time"),
      admin
        .from("sports_matches")
        .select("id, category_id, match_date, opponent, location, status, sports_categories(name,code)")
        .eq("category_id", myAthlete.category_id)
        .gte("match_date", new Date().toISOString())
        .order("match_date", { ascending: true })
        .limit(20),
      admin
        .from("sports_finance")
        .select("id, athlete_id, period, status, balance, sports_athletes(full_name, category_id)")
        .eq("athlete_id", myAthlete.id)
        .order("updated_at", { ascending: false })
        .limit(100),
    ]);

    return (
      <ClubDeportivoPanel
        profile={profile}
        categories={categories ?? []}
        scopedCategoryIds={[myAthlete.category_id]}
        athletes={[myAthlete]}
        trainings={trainings ?? []}
        matches={matches ?? []}
        financeRows={financeRows ?? []}
        consultorUsers={consultorUsers}
      />
    );
  }

  const categoryIds = (userCategories ?? []).map((r) => r.category_id);
  const scopedCategoryIds = profile.role === "leader"
    ? (categories ?? []).map((c) => c.id)
    : categoryIds;

  const hasAccess = profile.role === "leader" || scopedCategoryIds.length > 0;
  if (!hasAccess) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-extrabold text-gray-800">Club Deportivo</h1>
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          No tienes categorias asignadas. Pide al lider que te asigne al menos una.
        </p>
      </div>
    );
  }

  const categoryFilter = scopedCategoryIds;

  const [{ data: athletes }, { data: trainings }, { data: matches }, { data: financeRows }] = await Promise.all([
    admin
      .from("sports_athletes")
      .select("id, full_name, category_id, height_cm, weight_kg, physical_status, active, sports_categories(name,code)")
      .in("category_id", categoryFilter)
      .order("full_name"),
    admin
      .from("sports_trainings")
      .select("id, category_id, weekday, start_time, end_time, location, sports_categories(name,code)")
      .in("category_id", categoryFilter)
      .order("weekday")
      .order("start_time"),
    admin
      .from("sports_matches")
      .select("id, category_id, match_date, opponent, location, status, sports_categories(name,code)")
      .in("category_id", categoryFilter)
      .gte("match_date", new Date().toISOString())
      .order("match_date", { ascending: true })
      .limit(20),
    admin
      .from("sports_finance")
      .select("id, athlete_id, period, status, balance, sports_athletes(full_name, category_id)")
      .order("updated_at", { ascending: false })
      .limit(300),
  ]);

  const filteredFinance = (financeRows ?? []).filter((row) => {
    const athlete = Array.isArray(row.sports_athletes) ? row.sports_athletes[0] : row.sports_athletes;
    return athlete && categoryFilter.includes(athlete.category_id);
  });

  return (
    <ClubDeportivoPanel
      profile={profile}
      categories={categories ?? []}
      scopedCategoryIds={categoryFilter}
      athletes={athletes ?? []}
      trainings={trainings ?? []}
      matches={matches ?? []}
      financeRows={filteredFinance}
      consultorUsers={consultorUsers}
    />
  );
}
