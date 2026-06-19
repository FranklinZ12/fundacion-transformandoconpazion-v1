"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { hasPermission, ALL_PERMISSIONS } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

async function getCallerProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, role, permissions, status")
    .eq("id", user.id)
    .single();
  return data;
}

export async function approveUser(userId) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ status: "approved" })
    .eq("id", userId);

  revalidatePath("/admin/usuarios");
}

export async function rejectUser(userId) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", userId);

  revalidatePath("/admin/usuarios");
}

export async function updateUserPermissions(userId, role, permissions) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  // Validar que los permisos sean válidos
  const validCodes = ALL_PERMISSIONS.map((p) => p.code);
  const sanitized = permissions.filter((p) => validCodes.includes(p));

  const supabase = createAdminClient();
  await supabase
    .from("profiles")
    .update({ role, permissions: sanitized })
    .eq("id", userId);

  if (role !== "consultor" && !sanitized.includes("manage:sports")) {
    await supabase
      .from("sports_user_categories")
      .delete()
      .eq("user_id", userId);
  }

  revalidatePath("/admin/usuarios");
}

export async function deleteUser(userId) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  const supabase = createAdminClient();
  // Eliminar de auth elimina también el perfil por cascade
  await supabase.auth.admin.deleteUser(userId);

  revalidatePath("/admin/usuarios");
}

export async function updateUserPasswordByLeader(userId, newPassword) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  const password = String(newPassword || "").trim();
  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password,
  });

  if (error) {
    throw new Error("No se pudo actualizar la contraseña");
  }

  revalidatePath("/admin/usuarios");
}

export async function updateUserCategories(userId, categoryIds) {
  const caller = await getCallerProfile();
  if (!hasPermission(caller, "manage:users")) throw new Error("Sin permisos");

  const supabase = createAdminClient();
  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("role, permissions")
    .eq("id", userId)
    .single();

  const canHaveCategories =
    targetProfile?.role === "consultor" ||
    (Array.isArray(targetProfile?.permissions) && targetProfile.permissions.includes("manage:sports"));

  if (!targetProfile || !canHaveCategories) {
    throw new Error("Solo puedes asignar categorias a consultores o gestores deportivos");
  }

  const sanitized = Array.isArray(categoryIds)
    ? [...new Set(categoryIds.map((id) => String(id)).filter(Boolean))]
    : [];

  const { error: deleteError } = await supabase
    .from("sports_user_categories")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error("No se pudieron limpiar las categorias previas");
  }

  if (sanitized.length > 0) {
    const rows = sanitized.map((categoryId) => ({ user_id: userId, category_id: categoryId }));
    const { error: insertError } = await supabase
      .from("sports_user_categories")
      .insert(rows);

    if (insertError) {
      throw new Error("No se pudieron guardar las categorias");
    }
  }

  revalidatePath("/admin/usuarios");
}
