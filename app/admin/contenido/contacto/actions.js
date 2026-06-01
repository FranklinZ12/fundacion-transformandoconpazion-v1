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

export async function saveContacto(formData) {
  const userId = await requireEditPermission();

  const data = {
    address:      formData.get("address")?.toString().trim(),
    schedule:     formData.get("schedule")?.toString().trim(),
    whatsapp:     formData.get("whatsapp")?.toString().trim(),
    whatsapp_url: formData.get("whatsapp_url")?.toString().trim(),
    email:        formData.get("email")?.toString().trim(),
    socials: {
      youtube:   formData.get("social_youtube")?.toString().trim(),
      twitter:   formData.get("social_twitter")?.toString().trim(),
      instagram: formData.get("social_instagram")?.toString().trim(),
      facebook:  formData.get("social_facebook")?.toString().trim(),
    },
  };

  const admin = createAdminClient();
  const { error } = await admin.from("site_content").upsert({
    id:         "contacto",
    section:    "contacto",
    data,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/contacto");
  revalidatePath("/admin/contenido/contacto");
}
