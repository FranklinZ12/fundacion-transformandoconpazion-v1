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
