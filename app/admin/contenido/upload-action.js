"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";

const BUCKET = "site-images";

async function ensureBucket(admin) {
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    await admin.storage.createBucket(BUCKET, { public: true });
  }
}

export async function uploadContentImage(formData) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Debes iniciar sesión para subir imágenes.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("permissions, role")
    .eq("id", user.id)
    .single();

  const canEdit =
    profile?.role === "administrador" ||
    (Array.isArray(profile?.permissions) && profile.permissions.includes("edit:content"));

  if (!canEdit) throw new Error("No tienes permiso para subir imágenes.");

  const file = formData.get("file");
  if (!file || file.size === 0) throw new Error("Selecciona un archivo de imagen.");

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!ALLOWED_TYPES.includes(file.type))
    throw new Error("Formato no permitido. Usa JPG, PNG, WebP o GIF.");
  if (file.size > 5 * 1024 * 1024)
    throw new Error("La imagen es demasiado grande. El límite es 5 MB.");

  const ext = file.name.split(".").pop().toLowerCase();
  const filename = `content-${Date.now()}.${ext}`;
  const path = `uploads/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const admin = createAdminClient();

  // Auto-create bucket if it doesn't exist
  await ensureBucket(admin);

  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) throw new Error("No se pudo subir la imagen. Intenta de nuevo.");

  const { data: { publicUrl } } = admin.storage
    .from(BUCKET)
    .getPublicUrl(path);

  // Delete previous image if it was stored in this bucket
  const oldUrl = formData.get("oldUrl")?.toString();
  if (oldUrl && oldUrl.includes(`/${BUCKET}/`)) {
    const oldPath = oldUrl.split(`/${BUCKET}/`)[1];
    if (oldPath) {
      await admin.storage.from(BUCKET).remove([oldPath]);
    }
  }

  return { url: publicUrl };
}
