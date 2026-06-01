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
    const keys = Object.keys(Object.fromEntries(formData)).filter(k => k.startsWith(`${prefix}_${i}_`));
    const obj = {};
    for (const k of keys) {
      obj[k.replace(`${prefix}_${i}_`, "")] = formData.get(k)?.toString().trim();
    }
    return obj;
  });
}

export async function saveOrganizacion(formData) {
  const userId = await requireEditPermission();

  const data = {
    quienes_somos: formData.get("quienes_somos")?.toString().trim(),
    resena: [0, 1, 2, 3].map(i => formData.get(`resena_${i}`)?.toString().trim()).filter(Boolean),
    stats:     getArr(formData, "stat",      4),
    pilares:   getArr(formData, "pilar",     4),
    timeline:  getArr(formData, "timeline",  4),
    principios:getArr(formData, "principio", 4),
    valores:   getArr(formData, "valor",     4),
  };

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert({
    id: "organizacion", section: "organizacion", data,
    updated_at: new Date().toISOString(), updated_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/nosotros/organizacion");
  revalidatePath("/admin/contenido/organizacion");
}
