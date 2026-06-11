"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function updateUserProfile(formData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "No autenticado." };
    }

    const name = formData.get("name");
    const avatar = formData.get("avatar");
    const adminClient = createAdminClient();

    let avatarUrl = null;
    if (avatar && avatar.size > 0) {
      const bytes = await avatar.arrayBuffer();
      const path = `${user.id}/${Date.now()}-${avatar.name}`;
      const { error: uploadError } = await adminClient.storage
        .from("avatares")
        .upload(path, bytes, { upsert: true });

      if (uploadError) {
        return { error: "Error al subir la imagen." };
      }

      const { data } = adminClient.storage.from("avatares").getPublicUrl(path);
      avatarUrl = data.publicUrl;
    }

    const updateData = { name };
    if (avatarUrl) updateData.avatar_url = avatarUrl;

    const { error } = await adminClient
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      return { error: "No se pudo actualizar el perfil." };
    }

    return { success: true, avatarUrl };
  } catch (err) {
    return { error: "Error al actualizar el perfil." };
  }
}

export async function updateUserPassword(currentPassword, newPassword) {
  try {
    const supabase = await createClient();

    // Validar contraseña actual intentando re-autenticarse
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { error: "No autenticado." };
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: "Contraseña actual incorrecta." };
    }

    // Actualizar contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return { error: "No se pudo actualizar la contraseña." };
    }

    return { success: true };
  } catch (err) {
    return { error: "Error al cambiar la contraseña." };
  }
}
