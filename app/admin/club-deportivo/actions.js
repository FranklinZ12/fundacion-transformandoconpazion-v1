"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function getScope() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, categoryIds: [] };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("id", user.id)
    .single();

  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("sports_user_categories")
    .select("category_id")
    .eq("user_id", user.id);

  return {
    user,
    profile,
    categoryIds: (rows ?? []).map((r) => r.category_id),
  };
}

function canManageSports(profile) {
  if (!profile || profile.status !== "approved") return false;
  return ["leader", "administrador"].includes(profile.role);
}

function canUseCategory(profile, categoryIds, categoryId) {
  if (profile?.role === "leader") return true;
  return categoryIds.includes(categoryId);
}

export async function createAthlete(formData) {
  const { user, profile, categoryIds } = await getScope();
  if (!user || !canManageSports(profile)) return { error: "Sin permisos." };

  const fullName = formData.get("full_name")?.toString().trim();
  const selectedCategoryId = formData.get("category_id")?.toString();
  const consultorUserId = formData.get("consultor_user_id")?.toString().trim() || null;
  const height = Number(formData.get("height_cm") || 0);
  const weight = Number(formData.get("weight_kg") || 0);
  const physicalStatus = formData.get("physical_status")?.toString().trim() || null;

  if (!fullName) return { error: "Nombre requerido." };

  const admin = createAdminClient();
  let categoryId = selectedCategoryId || null;

  if (consultorUserId) {
    const { data: consultor } = await admin
      .from("profiles")
      .select("id, role, status")
      .eq("id", consultorUserId)
      .single();

    if (!consultor || consultor.role !== "consultor" || consultor.status !== "approved") {
      return { error: "El usuario vinculado debe ser consultor aprobado." };
    }

    const { data: existing } = await admin
      .from("sports_athletes")
      .select("id")
      .eq("user_id", consultorUserId)
      .maybeSingle();

    if (existing) {
      return { error: "Este consultor ya esta vinculado a un deportista." };
    }

    const { data: consultorCategories } = await admin
      .from("sports_user_categories")
      .select("category_id")
      .eq("user_id", consultorUserId);

    const assigned = [...new Set((consultorCategories ?? []).map((r) => r.category_id))];
    if (assigned.length === 0) {
      return { error: "El consultor no tiene categoria asignada." };
    }
    if (assigned.length > 1) {
      return { error: "El consultor tiene varias categorias. Deja solo una para vincularlo." };
    }

    categoryId = assigned[0];
  }

  if (!categoryId) return { error: "Categoria requerida si no vinculas consultor." };
  if (!canUseCategory(profile, categoryIds, categoryId)) return { error: "No puedes gestionar esa categoria." };

  const { error } = await admin.from("sports_athletes").insert({
    full_name: fullName,
    user_id: consultorUserId,
    category_id: categoryId,
    height_cm: height || null,
    weight_kg: weight || null,
    physical_status: physicalStatus,
    created_by: user.id,
  });

  if (error) return { error: error.message || "No se pudo crear el deportista." };

  revalidatePath("/admin/club-deportivo");
  return { success: true };
}

export async function createTraining(formData) {
  const { profile, categoryIds } = await getScope();
  if (!canManageSports(profile)) return { error: "Sin permisos." };

  const categoryId = formData.get("category_id")?.toString();
  const weekday = Number(formData.get("weekday"));
  const startTime = formData.get("start_time")?.toString();
  const endTime = formData.get("end_time")?.toString();
  const location = formData.get("location")?.toString().trim() || null;

  if (!categoryId || !weekday || !startTime || !endTime) {
    return { error: "Completa todos los campos obligatorios." };
  }
  if (!canUseCategory(profile, categoryIds, categoryId)) return { error: "No puedes gestionar esa categoria." };

  const admin = createAdminClient();
  const { error } = await admin.from("sports_trainings").insert({
    category_id: categoryId,
    weekday,
    start_time: startTime,
    end_time: endTime,
    location: location,
  });

  if (error) return { error: error.message || "No se pudo crear el entrenamiento." };

  revalidatePath("/admin/club-deportivo");
  return { success: true };
}

export async function createMatch(formData) {
  const { profile, categoryIds } = await getScope();
  if (!canManageSports(profile)) return { error: "Sin permisos." };

  const categoryId = formData.get("category_id")?.toString();
  const matchDate = formData.get("match_date")?.toString();
  const opponent = formData.get("opponent")?.toString().trim();
  const location = formData.get("location")?.toString().trim() || null;

  if (!categoryId || !matchDate || !opponent) {
    return { error: "Categoria, fecha y rival son requeridos." };
  }
  if (!canUseCategory(profile, categoryIds, categoryId)) return { error: "No puedes gestionar esa categoria." };

  const admin = createAdminClient();
  const { error } = await admin.from("sports_matches").insert({
    category_id: categoryId,
    match_date: matchDate,
    opponent,
    location,
  });

  if (error) return { error: error.message || "No se pudo crear el partido." };

  revalidatePath("/admin/club-deportivo");
  return { success: true };
}

export async function upsertAthleteFinance(formData) {
  const { profile, categoryIds } = await getScope();
  if (!canManageSports(profile)) return { error: "Sin permisos." };

  const athleteId = formData.get("athlete_id")?.toString();
  const period = formData.get("period")?.toString().trim();
  const status = formData.get("status")?.toString();
  const balance = Number(formData.get("balance") || 0);

  if (!athleteId || !period || !status) {
    return { error: "Deportista, periodo y estado son requeridos." };
  }

  const admin = createAdminClient();
  const { data: athlete } = await admin
    .from("sports_athletes")
    .select("id, category_id")
    .eq("id", athleteId)
    .single();

  if (!athlete) return { error: "Deportista no encontrado." };
  if (!canUseCategory(profile, categoryIds, athlete.category_id)) {
    return { error: "No puedes gestionar ese deportista." };
  }

  const { error } = await admin
    .from("sports_finance")
    .upsert(
      {
        athlete_id: athleteId,
        period,
        status,
        balance,
      },
      { onConflict: "athlete_id,period" }
    );

  if (error) return { error: error.message || "No se pudo actualizar estado financiero." };

  revalidatePath("/admin/club-deportivo");
  return { success: true };
}
