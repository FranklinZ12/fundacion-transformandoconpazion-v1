"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function getCallerProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export async function createServiceActivity(formData) {
  try {
    const { user, profile } = await getCallerProfile();

    if (!user || !profile || profile.status !== "approved") {
      return { error: "No autorizado." };
    }

    if (profile.role !== "alfabetizador") {
      return { error: "Sin permisos para registrar actividades." };
    }

    const activityDate = formData.get("activity_date")?.toString();
    const activityName = formData.get("activity_name")?.toString().trim();
    const hours = Number(formData.get("hours"));

    if (!activityDate || !activityName) {
      return { error: "Fecha y actividad son requeridas." };
    }

    if (!Number.isFinite(hours) || hours <= 0) {
      return { error: "Horas inválidas." };
    }

    // Asegura configuración semestral automática (40h por defecto)
    const activity = new Date(activityDate);
    const year = activity.getFullYear();
    const term = activity.getMonth() + 1 <= 6 ? 1 : 2;

    const admin = createAdminClient();
    const { error: semesterError } = await admin
      .from("service_semesters")
      .upsert(
        {
          year,
          term,
          required_hours: 40,
          created_by: user.id,
        },
        { onConflict: "year,term", ignoreDuplicates: true }
      );

    if (semesterError) {
      return { error: "No se pudo preparar el semestre automático." };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("service_activities").insert({
      user_id: user.id,
      activity_date: activityDate,
      activity_name: activityName,
      hours,
    });

    if (error) {
      return { error: error.message || "No se pudo registrar la actividad." };
    }

    revalidatePath("/admin/servicio-social");
    return { success: true };
  } catch {
    return { error: "Error al registrar la actividad." };
  }
}

export async function upsertSemesterRequirement(formData) {
  try {
    const { profile } = await getCallerProfile();

    if (!profile || profile.status !== "approved" || profile.role !== "leader") {
      return { error: "Solo el líder puede configurar metas." };
    }

    const year = Number(formData.get("year"));
    const term = Number(formData.get("term"));
    const requiredHours = Number(formData.get("required_hours"));

    if (!Number.isInteger(year) || year < 2020) {
      return { error: "Año inválido." };
    }

    if (![1, 2].includes(term)) {
      return { error: "Semestre inválido." };
    }

    if (!Number.isFinite(requiredHours) || requiredHours <= 0) {
      return { error: "Horas requeridas inválidas." };
    }

    const admin = createAdminClient();
    const { error } = await admin
      .from("service_semesters")
      .upsert(
        { year, term, required_hours: requiredHours },
        { onConflict: "year,term" }
      );

    if (error) {
      return {
        error:
          error.message?.includes("semestres pasados")
            ? "No puedes modificar semestres pasados."
            : "No se pudo guardar la configuración.",
      };
    }

    revalidatePath("/admin/servicio-social");
    return { success: true };
  } catch {
    return { error: "Error al guardar la configuración." };
  }
}
