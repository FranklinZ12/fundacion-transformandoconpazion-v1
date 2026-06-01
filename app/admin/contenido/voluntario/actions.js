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

function getArr(formData, prefix, count) {
  return Array.from({ length: count }, (_, i) => {
    const keys = [...formData.keys()].filter((k) => k.startsWith(`${prefix}_${i}_`));
    const obj = {};
    for (const k of keys) {
      obj[k.replace(`${prefix}_${i}_`, "")] = formData.get(k)?.toString().trim();
    }
    return obj;
  });
}

export async function saveVoluntario(formData) {
  const userId = await requireEditPermission();

  const data = {
    voluntariado_titulo:    formData.get("voluntariado_titulo")?.toString().trim(),
    voluntariado_subtitulo: formData.get("voluntariado_subtitulo")?.toString().trim(),
    roles: getArr(formData, "role", 3),

    donaciones_titulo:    formData.get("donaciones_titulo")?.toString().trim(),
    donaciones_subtitulo: formData.get("donaciones_subtitulo")?.toString().trim(),
    tiers: getArr(formData, "tier", 3),

    impacto_titulo:    formData.get("impacto_titulo")?.toString().trim(),
    impacto_subtitulo: formData.get("impacto_subtitulo")?.toString().trim(),
    impact_stats: getArr(formData, "stat", 4),

    cta_titulo:    formData.get("cta_titulo")?.toString().trim(),
    cta_subtitulo: formData.get("cta_subtitulo")?.toString().trim(),
  };

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert({
    id: "voluntario", section: "voluntario", data,
    updated_at: new Date().toISOString(), updated_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/nosotros/voluntario-y-donaciones");
  revalidatePath("/admin/contenido/voluntario");
}
