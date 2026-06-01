"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";

async function requireEditPermission() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  const { data: profile } = await supabase
    .from("profiles").select("role, permissions, status").eq("id", user.id).single();
  if (!hasPermission(profile, "edit:content")) throw new Error("Sin permisos");
  return user.id;
}

export async function saveProcesos(formData) {
  await requireEditPermission();

  // ── Build processes array ────────────────────────────────
  const count = parseInt(formData.get("process_count") ?? "0", 10);

  const processes = Array.from({ length: count }, (_, i) => {
    const prefix = `process_${i}`;

    // Pills (up to 6)
    const pills = Array.from({ length: 6 }, (_, pi) => ({
      icon:  formData.get(`${prefix}_pill_${pi}_icon`)  ?? "",
      label: formData.get(`${prefix}_pill_${pi}_label`) ?? "",
    })).filter((p) => p.label.trim());

    // Items (up to 4)
    const items = Array.from({ length: 4 }, (_, ii) => ({
      image:       formData.get(`${prefix}_item_${ii}_image`)       || null,
      icon:        formData.get(`${prefix}_item_${ii}_icon`)        ?? "",
      titulo:      formData.get(`${prefix}_item_${ii}_titulo`)      ?? "",
      descripcion: formData.get(`${prefix}_item_${ii}_descripcion`) ?? "",
    })).filter((it) => it.titulo.trim());

    return {
      slug:             formData.get(`${prefix}_slug`)             ?? "",
      nombre:           formData.get(`${prefix}_nombre`)           ?? "",
      categoria:        formData.get(`${prefix}_categoria`)        ?? "Social",
      card_image:       formData.get(`${prefix}_card_image`)       || "",
      card_descripcion: formData.get(`${prefix}_card_descripcion`) ?? "",
      header_title:     formData.get(`${prefix}_header_title`)     ?? "",
      header_subtitle:  formData.get(`${prefix}_header_subtitle`)  ?? "",
      hero_layout:      formData.get(`${prefix}_hero_layout`)      ?? "logo",
      hero_image:       formData.get(`${prefix}_hero_image`)       || "",
      hero_descripcion: formData.get(`${prefix}_hero_descripcion`) ?? "",
      pills,
      items,
    };
  });

  // ── Upsert ──────────────────────────────────────────────
  const admin = createAdminClient();
  const { error } = await admin
    .from("site_content")
    .upsert({ id: "procesos", data: { processes } }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/procesos");
  revalidatePath("/procesos/[slug]", "page");

  return { ok: true };
}

/* ── Save a single process by slug ──────────────────────────────────────────── */
export async function saveUnProceso(slug, processData) {
  await requireEditPermission();

  const admin = createAdminClient();

  // Read current full list
  const { data: row } = await admin
    .from("site_content")
    .select("data")
    .eq("id", "procesos")
    .single();

  const processes = row?.data?.processes ?? [];
  const idx = processes.findIndex((p) => p.slug === slug);

  if (idx === -1) {
    processes.push(processData);
  } else {
    processes[idx] = { ...processes[idx], ...processData };
  }

  const { error } = await admin
    .from("site_content")
    .upsert({ id: "procesos", data: { processes } }, { onConflict: "id" });

  if (error) return { error: error.message };

  revalidatePath("/procesos");
  revalidatePath("/procesos/[slug]", "page");

  return { ok: true };
}
