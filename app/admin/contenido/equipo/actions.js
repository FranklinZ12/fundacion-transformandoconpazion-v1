"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function requireEditPermission() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles").select("role, permissions, status").eq("id", user.id).single();
  if (!hasPermission(profile, "edit:content")) throw new Error("Sin permisos");
  return user.id;
}

export async function saveEquipo(formData) {
  const userId = await requireEditPermission();

  const count = parseInt(formData.get("member_count") ?? "6", 10);

  const members = Array.from({ length: count }, (_, i) => ({
    image:       formData.get(`member_${i}_image`)?.toString().trim()       ?? "",
    nombre:      formData.get(`member_${i}_nombre`)?.toString().trim()      ?? "",
    puesto:      formData.get(`member_${i}_puesto`)?.toString().trim()      ?? "",
    bio:         formData.get(`member_${i}_bio`)?.toString().trim()         ?? "",
    bioExtended: formData.get(`member_${i}_bioExtended`)?.toString().trim() ?? "",
    instagram:   formData.get(`member_${i}_instagram`)?.toString().trim()   ?? "",
    facebook:    formData.get(`member_${i}_facebook`)?.toString().trim()    ?? "",
    twitter:     formData.get(`member_${i}_twitter`)?.toString().trim()     ?? "",
  })).filter((m) => m.nombre);

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert({
    id: "equipo", section: "equipo", data: { members },
    updated_at: new Date().toISOString(), updated_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/nosotros/equipo");
  revalidatePath("/admin/contenido/equipo");
}
