"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireEditPermission() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions, status")
    .eq("id", user.id)
    .single();

  if (!hasPermission(profile, "edit:content")) throw new Error("Sin permisos");
  return user.id;
}

export async function saveInicio(formData) {
  const userId = await requireEditPermission();

  const data = {
    hero: {
      badge:       formData.get("hero_badge")?.toString().trim(),
      title_line1: formData.get("hero_title_line1")?.toString().trim(),
      title_line2: formData.get("hero_title_line2")?.toString().trim(),
      subtitle:    formData.get("hero_subtitle")?.toString().trim(),
      image:       formData.get("hero_image")?.toString().trim(),
    },
    stats: [0, 1, 2, 3].map((i) => ({
      number: formData.get(`stat_${i}_number`)?.toString().trim(),
      label:  formData.get(`stat_${i}_label`)?.toString().trim(),
    })),
    mision: formData.get("mision")?.toString().trim(),
    vision: formData.get("vision")?.toString().trim(),
    objectives: [0, 1].map((i) => ({
      icon:  formData.get(`obj_${i}_icon`)?.toString().trim(),
      title: formData.get(`obj_${i}_title`)?.toString().trim(),
      text:  formData.get(`obj_${i}_text`)?.toString().trim(),
    })),
  };

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert({
    id:         "inicio",
    section:    "inicio",
    data,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/contenido/inicio");
}
