"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hasPermission } from "@/lib/permissions";

async function getCaller() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status, phone_number, address")
    .eq("id", user.id)
    .single();

  return profile;
}

function isAdmin(profile) {
  return !!profile && profile.status === "approved" && profile.role === "administrador";
}

async function isForumCoordinator(profile, forumId) {
  if (!profile) return false;
  const admin = createAdminClient();
  const { data } = await admin
    .from("forums")
    .select("id")
    .eq("id", forumId)
    .eq("coordinator_id", profile.id)
    .maybeSingle();
  return !!data;
}

async function isForumMember(profile, forumId) {
  if (!profile) return false;
  const admin = createAdminClient();
  const { data } = await admin
    .from("forum_members")
    .select("id")
    .eq("forum_id", forumId)
    .eq("user_id", profile.id)
    .eq("status", "approved")
    .maybeSingle();
  return !!data;
}

async function canManageForum(profile, forumId) {
  if (isAdmin(profile)) return true;
  return isForumCoordinator(profile, forumId);
}

// ─────────────────────────────────────────────────────────
// ADMIN: CRUD de foros
// ─────────────────────────────────────────────────────────

export async function createForum(formData) {
  const caller = await getCaller();
  if (!isAdmin(caller)) return { error: "Sin permisos." };

  const slug = formData.get("slug")?.toString().trim().toLowerCase();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coordinatorId = formData.get("coordinator_id")?.toString() || null;
  const allowComments = formData.get("allow_comments") === "true";
  const visibility = formData.get("visibility")?.toString() || "public";
  const allowApplications = formData.get("allow_applications") === "true";

  if (!slug || !name) return { error: "Slug y nombre son requeridos." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { error: "Slug invalido. Use solo letras, numeros y guiones." };
  }

  const admin = createAdminClient();

  if (coordinatorId) {
    const { data: target } = await admin
      .from("profiles")
      .select("id, status")
      .eq("id", coordinatorId)
      .single();
    if (!target || target.status !== "approved") {
      return { error: "El coordinador debe ser un usuario aprobado." };
    }
  }

  const { error } = await admin.from("forums").insert({
    slug,
    name,
    description,
    coordinator_id: coordinatorId || null,
    allow_comments: allowComments,
    visibility,
    allow_applications: allowApplications,
  });

  if (error) {
    if (error.code === "23505") return { error: "Ya existe un foro con ese slug." };
    return { error: error.message || "No se pudo crear el foro." };
  }

  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function updateForum(formData) {
  const caller = await getCaller();
  const forumId = formData.get("forum_id")?.toString();
  if (!forumId) return { error: "Foro requerido." };
  if (!isAdmin(caller)) return { error: "Sin permisos." };

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const coordinatorId = formData.get("coordinator_id")?.toString() || null;
  const isActive = formData.get("is_active") === "true";
  const allowComments = formData.get("allow_comments") === "true";
  const visibility = formData.get("visibility")?.toString() || "public";
  const allowApplications = formData.get("allow_applications") === "true";

  if (!name) return { error: "Nombre requerido." };

  const admin = createAdminClient();

  if (coordinatorId) {
    const { data: target } = await admin
      .from("profiles")
      .select("id, status")
      .eq("id", coordinatorId)
      .single();
    if (!target || target.status !== "approved") {
      return { error: "El coordinador debe ser un usuario aprobado." };
    }
  }

  const { error } = await admin
    .from("forums")
    .update({ name, description, coordinator_id: coordinatorId || null, is_active: isActive, allow_comments: allowComments, visibility, allow_applications: allowApplications })
    .eq("id", forumId);

  if (error) return { error: error.message || "No se pudo actualizar el foro." };

  const { data: forum } = await admin
    .from("forums")
    .select("slug")
    .eq("id", forumId)
    .single();

  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forum?.slug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function deleteForum(formData) {
  const caller = await getCaller();
  const forumId = formData.get("forum_id")?.toString();
  if (!forumId) return { error: "Foro requerido." };
  if (!isAdmin(caller)) return { error: "Sin permisos." };

  const admin = createAdminClient();
  const { data: forum } = await admin
    .from("forums")
    .select("slug")
    .eq("id", forumId)
    .single();

  const { error } = await admin.from("forums").delete().eq("id", forumId);
  if (error) return { error: error.message || "No se pudo eliminar el foro." };

  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forum?.slug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────────────────

export async function createPost(formData) {
  const caller = await getCaller();
  const forumId = formData.get("forum_id")?.toString();
  if (!forumId) return { error: "Foro requerido." };
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const canManage = await canManageForum(caller, forumId);
  if (!canManage) return { error: "Solo el coordinador o administrador pueden publicar." };

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const type = formData.get("type")?.toString() || "general";
  const isPinned = formData.get("is_pinned") === "true";

  if (!title) return { error: "Titulo requerido." };
  if (!["anuncio", "debate", "general"].includes(type)) return { error: "Tipo invalido." };

  const admin = createAdminClient();
  const { data: forum } = await admin
    .from("forums")
    .select("slug")
    .eq("id", forumId)
    .single();

  const { error } = await admin.from("forum_posts").insert({
    forum_id: forumId,
    author_id: caller.id,
    title,
    content: content || null,
    type,
    is_pinned: isPinned,
  });

  if (error) return { error: error.message || "No se pudo crear el post." };

  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forum?.slug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function updatePost(formData) {
  const caller = await getCaller();
  const postId = formData.get("post_id")?.toString();
  if (!postId) return { error: "Post requerido." };
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("id, forum_id, forums(slug)")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Post no encontrado." };

  const canManage = await canManageForum(caller, post.forum_id);
  if (!canManage) return { error: "Sin permisos para editar este post." };

  const title = formData.get("title")?.toString().trim();
  const content = formData.get("content")?.toString().trim();
  const type = formData.get("type")?.toString() || "general";
  const isPinned = formData.get("is_pinned") === "true";

  if (!title) return { error: "Titulo requerido." };

  const { error } = await admin
    .from("forum_posts")
    .update({ title, content: content || null, type, is_pinned: isPinned })
    .eq("id", postId);

  if (error) return { error: error.message || "No se pudo actualizar el post." };

  const slug = Array.isArray(post.forums) ? post.forums[0]?.slug : post.forums?.slug;
  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${slug}`);
  revalidatePath(`/foro/${slug}/post/${postId}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function deletePost(formData) {
  const caller = await getCaller();
  const postId = formData.get("post_id")?.toString();
  if (!postId) return { error: "Post requerido." };
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("id, forum_id, forums(slug)")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Post no encontrado." };

  const canManage = await canManageForum(caller, post.forum_id);
  if (!canManage) return { error: "Sin permisos para eliminar este post." };

  const { error } = await admin.from("forum_posts").delete().eq("id", postId);
  if (error) return { error: error.message || "No se pudo eliminar el post." };

  const slug = Array.isArray(post.forums) ? post.forums[0]?.slug : post.forums?.slug;
  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${slug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// MEMBRESIAS
// ─────────────────────────────────────────────────────────

export async function requestMembership(forumId) {
  const caller = await getCaller();
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();

  const { data: forum } = await admin
    .from("forums")
    .select("id, allow_comments, allow_applications")
    .eq("id", forumId)
    .single();

  if (!forum?.allow_comments && !forum?.allow_applications) return { error: "Este foro es informativo, no se aceptan miembros." };

  const { data: existing } = await admin
    .from("forum_members")
    .select("id, status")
    .eq("forum_id", forumId)
    .eq("user_id", caller.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "approved") return { error: "Ya eres miembro de este foro." };
    if (existing.status === "pending") return { error: "Tu solicitud esta pendiente." };
    // Si fue rechazado, actualizar a pending
    const { error } = await admin
      .from("forum_members")
      .update({ status: "pending" })
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidatePath("/admin/foro");
    return { success: true };
  }

  const { error } = await admin.from("forum_members").insert({
    forum_id: forumId,
    user_id: caller.id,
    status: "pending",
  });

  if (error) return { error: error.message || "No se pudo enviar la solicitud." };

  revalidatePath("/admin/foro");
  return { success: true };
}

async function getForumSlugById(admin, forumId) {
  const { data } = await admin.from("forums").select("slug").eq("id", forumId).single();
  return data?.slug;
}

export async function updateMembershipStatus(formData) {
  const caller = await getCaller();
  const membershipId = formData.get("membership_id")?.toString();
  const status = formData.get("status")?.toString();
  if (!membershipId || !["approved", "rejected"].includes(status)) {
    return { error: "Solicitud invalida." };
  }
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("forum_members")
    .select("id, forum_id")
    .eq("id", membershipId)
    .single();

  if (!membership) return { error: "Membresia no encontrada." };

  const canManage = await canManageForum(caller, membership.forum_id);
  if (!canManage) return { error: "Sin permisos." };

  const { error } = await admin
    .from("forum_members")
    .update({ status })
    .eq("id", membershipId);

  if (error) return { error: error.message || "No se pudo actualizar la membresia." };

  const forumSlug = await getForumSlugById(admin, membership.forum_id);
  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forumSlug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function removeMembership(formData) {
  const caller = await getCaller();
  const membershipId = formData.get("membership_id")?.toString();
  if (!membershipId) return { error: "Membresia requerida." };
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();
  const { data: membership } = await admin
    .from("forum_members")
    .select("id, forum_id, user_id")
    .eq("id", membershipId)
    .single();

  if (!membership) return { error: "Membresia no encontrada." };

  const canManage = await canManageForum(caller, membership.forum_id);
  if (!canManage && membership.user_id !== caller.id) return { error: "Sin permisos." };

  const { error } = await admin.from("forum_members").delete().eq("id", membershipId);
  if (error) return { error: error.message || "No se pudo eliminar la membresia." };

  const forumSlug = await getForumSlugById(admin, membership.forum_id);
  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forumSlug}`);
  revalidatePath("/admin/foro");
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// COMENTARIOS
// ─────────────────────────────────────────────────────────

export async function createComment(formData) {
  const caller = await getCaller();
  const postId = formData.get("post_id")?.toString();
  const content = formData.get("content")?.toString().trim();

  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion para comentar." };
  if (!postId || !content) return { error: "Post y comentario requeridos." };

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("id, forum_id, forums(slug, allow_comments)")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Post no encontrado." };

  const forumData = Array.isArray(post.forums) ? post.forums[0] : post.forums;
  if (!forumData?.allow_comments) return { error: "Este foro es informativo, no se permiten comentarios." };

  const isMember = await isForumMember(caller, post.forum_id);
  const canManage = await canManageForum(caller, post.forum_id);

  if (!isMember && !canManage) {
    return { error: "Debes ser miembro del foro para comentar." };
  }

  const { error } = await admin.from("forum_comments").insert({
    post_id: postId,
    author_id: caller.id,
    content,
  });

  if (error) return { error: error.message || "No se pudo guardar el comentario." };

  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${forumData.slug}/post/${postId}`);
  revalidatePath(`/foro/${forumData.slug}`);
  return { success: true };
}

export async function deleteComment(formData) {
  const caller = await getCaller();
  const commentId = formData.get("comment_id")?.toString();
  if (!commentId) return { error: "Comentario requerido." };
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };

  const admin = createAdminClient();
  const { data: comment } = await admin
    .from("forum_comments")
    .select("id, post_id, author_id")
    .eq("id", commentId)
    .single();

  if (!comment) return { error: "Comentario no encontrado." };

  const { data: post } = await admin
    .from("forum_posts")
    .select("id, forum_id, forums(slug)")
    .eq("id", comment.post_id)
    .single();

  const forumId = post?.forum_id;
  const canManage = await canManageForum(caller, forumId);
  if (!canManage && comment.author_id !== caller.id) return { error: "Sin permisos." };

  const { error } = await admin.from("forum_comments").delete().eq("id", commentId);
  if (error) return { error: error.message || "No se pudo eliminar el comentario." };

  const slug = Array.isArray(post?.forums) ? post.forums[0]?.slug : post?.forums?.slug;
  revalidatePath("/");
  revalidatePath("/foro");
  revalidatePath(`/foro/${slug}/post/${comment.post_id}`);
  revalidatePath(`/foro/${slug}`);
  return { success: true };
}

// ─────────────────────────────────────────────────────────
// POSTULACIONES (ofertas de empleo, etc.)
// ─────────────────────────────────────────────────────────

export async function createApplication(formData) {
  const caller = await getCaller();
  const postId = formData.get("post_id")?.toString();
  const message = formData.get("message")?.toString().trim() || null;

  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion para postular." };
  if (!postId) return { error: "Oferta requerida." };

  if (!caller.phone_number || !caller.address) {
    return { error: "Debes completar tu perfil con teléfono y dirección antes de postular.", profileIncomplete: true };
  }

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("id, forum_id, forums(slug, allow_applications)")
    .eq("id", postId)
    .single();

  if (!post) return { error: "Oferta no encontrada." };

  const forumData = Array.isArray(post.forums) ? post.forums[0] : post.forums;
  if (!forumData?.allow_applications) return { error: "Este foro no acepta postulaciones." };

  const isMember = await isForumMember(caller, post.forum_id);
  const canManage = await canManageForum(caller, post.forum_id);

  if (!isMember && !canManage) {
    return { error: "Debes ser miembro del foro para postular." };
  }

  const { data: existing } = await admin
    .from("forum_applications")
    .select("id, status")
    .eq("post_id", postId)
    .eq("user_id", caller.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === "cancelled") {
      const { error: reactError } = await admin
        .from("forum_applications")
        .update({ status: "pending", message, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (reactError) return { error: reactError.message || "No se pudo reenviar la postulación." };

      revalidatePath(`/foro/${forumData.slug}/post/${postId}`);
      revalidatePath("/admin/mis-postulaciones");
      revalidatePath("/admin/foro");
      return { success: true, application: { id: existing.id, status: "pending" } };
    }
    return { error: "Ya te postulaste a esta oferta." };
  }

  const { data: inserted, error } = await admin.from("forum_applications").insert({
    post_id: postId,
    user_id: caller.id,
    message,
  }).select("id").single();

  if (error) return { error: error.message || "No se pudo enviar la postulacion." };

  revalidatePath(`/foro/${forumData.slug}/post/${postId}`);
  revalidatePath("/admin/mis-postulaciones");
  revalidatePath("/admin/foro");
  return { success: true, application: { id: inserted.id, status: "pending" } };
}

export async function cancelApplication(applicationId) {
  const caller = await getCaller();
  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };
  if (!applicationId) return { error: "Postulacion requerida." };

  const admin = createAdminClient();
  const { data: app } = await admin
    .from("forum_applications")
    .select("id, user_id, post_id, status")
    .eq("id", applicationId)
    .single();

  if (!app) return { error: "Postulacion no encontrada." };
  if (app.user_id !== caller.id) return { error: "Sin permisos." };

  const { error } = await admin
    .from("forum_applications")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (error) return { error: error.message || "No se pudo cancelar la postulacion." };

  revalidatePath("/admin/mis-postulaciones");
  revalidatePath("/admin/foro");
  return { success: true };
}

export async function updateApplicationStatus(formData) {
  const caller = await getCaller();
  const applicationId = formData.get("application_id")?.toString();
  const status = formData.get("status")?.toString();

  if (!caller || caller.status !== "approved") return { error: "Debes iniciar sesion." };
  if (!applicationId || !["reviewed", "contacted"].includes(status)) {
    return { error: "Estado invalido." };
  }

  const admin = createAdminClient();
  const { data: app } = await admin
    .from("forum_applications")
    .select("id, post_id, forum_posts(forum_id)")
    .eq("id", applicationId)
    .single();

  if (!app) return { error: "Postulacion no encontrada." };

  const forumId = Array.isArray(app.forum_posts) ? app.forum_posts[0]?.forum_id : app.forum_posts?.forum_id;
  const canManage = await canManageForum(caller, forumId);
  if (!canManage) return { error: "Sin permisos." };

  const { error } = await admin
    .from("forum_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  if (error) return { error: error.message || "No se pudo actualizar el estado." };

  revalidatePath("/admin/foro");
  return { success: true };
}
