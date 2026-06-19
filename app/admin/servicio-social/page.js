import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import ServiceSocialPanel from "@/components/admin/ServiceSocialPanel";

export const metadata = { title: "Servicio Social" };

function getSemesterCodeFromDate(date) {
  const year = date.getFullYear();
  const term = date.getMonth() + 1 <= 6 ? 1 : 2;
  return `${year}-${term}`;
}

export default async function ServicioSocialPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "approved") redirect("/admin");
  if (!["administrador", "alfabetizador"].includes(profile.role)) redirect("/admin");

  const [{ data: semesterConfigs }, { data: myActivities }, { data: myProgressRows }] = await Promise.all([
    supabase
      .from("service_semesters")
      .select("id, year, term, code, required_hours")
      .order("year", { ascending: false })
      .order("term", { ascending: false }),
    supabase
      .from("service_activities")
      .select("id, activity_date, activity_name, hours, semester_id")
      .eq("user_id", user.id)
      .order("activity_date", { ascending: false }),
    supabase
      .from("v_service_semester_progress")
      .select("semester_id, semester_code, required_hours, done_hours, missing_hours, status")
      .eq("user_id", user.id)
      .order("semester_code", { ascending: false }),
  ]);

  const todayCode = getSemesterCodeFromDate(new Date());
  const currentSemester = (semesterConfigs ?? []).find((s) => s.code === todayCode);
  const currentProgress = (myProgressRows ?? []).find((r) => r.semester_code === todayCode) ?? {
    done_hours: 0,
    required_hours: currentSemester?.required_hours ?? 40,
    missing_hours: currentSemester?.required_hours ?? 40,
    status: "En progreso",
  };
  const totalHistoricalHours = (myActivities ?? []).reduce((acc, item) => acc + Number(item.hours || 0), 0);

  let adminStats = null;

  if (profile.role === "administrador") {
    const admin = createAdminClient();
    const [{ data: alfabetizadores }, { data: allActivities }, { data: progressRows }] = await Promise.all([
      admin
        .from("profiles")
        .select("id")
        .eq("status", "approved")
        .eq("role", "alfabetizador"),
      admin
        .from("service_activities")
        .select("user_id, hours, semester_id, activity_date, profiles(name)")
        .order("activity_date", { ascending: false }),
      admin
        .from("v_service_semester_progress")
        .select("user_id, user_name, semester_code, done_hours, status"),
    ]);

    const totalAlfabetizadores = (alfabetizadores ?? []).length;
    const currentSemesterCode = todayCode;

    const progressCurrent = (progressRows ?? []).filter((r) => r.semester_code === currentSemesterCode);
    const usersCumplen = progressCurrent.filter((r) => r.status === "Cumplido").length;
    const usersPendientes = Math.max(totalAlfabetizadores - usersCumplen, 0);

    const semesterHoursMap = {};
    const rankingMap = {};

    (allActivities ?? []).forEach((a) => {
      const semester = (semesterConfigs ?? []).find((s) => s.id === a.semester_id);
      const code = semester?.code ?? "Sin semestre";
      semesterHoursMap[code] = (semesterHoursMap[code] ?? 0) + Number(a.hours || 0);

      const rowProfile = Array.isArray(a.profiles) ? a.profiles[0] : a.profiles;
      const label = rowProfile?.name || "Usuario";
      const key = `${a.user_id}:${label}`;
      rankingMap[key] = (rankingMap[key] ?? 0) + Number(a.hours || 0);
    });

    const ranking = Object.entries(rankingMap)
      .map(([key, hours]) => {
        const [, name] = key.split(":");
        return { name, hours: Number(hours.toFixed(2)) };
      })
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10);

    const bySemester = Object.entries(semesterHoursMap)
      .map(([semester, hours]) => ({ semester, hours: Number(hours.toFixed(2)) }))
      .sort((a, b) => (a.semester < b.semester ? 1 : -1));

    adminStats = {
      totalAlfabetizadores,
      usersCumplen,
      usersPendientes,
      bySemester,
      ranking,
    };
  }

  return (
    <ServiceSocialPanel
      profile={profile}
      currentSemesterCode={todayCode}
      currentSemesterRequired={currentSemester?.required_hours ?? 40}
      currentProgress={currentProgress}
      myActivities={myActivities ?? []}
      mySummary={myProgressRows ?? []}
      totalHistoricalHours={Number(totalHistoricalHours.toFixed(2))}
      semesterConfigs={semesterConfigs ?? []}
      adminStats={adminStats}
    />
  );
}
