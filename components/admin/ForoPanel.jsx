"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createForum,
  updateForum,
  deleteForum,
  createPost,
  updatePost,
  deletePost,
  updateMembershipStatus,
  removeMembership,
  updateApplicationStatus,
} from "@/app/foro/actions";

const TABS = [
  { id: "posts", label: "Posts", icon: "fa-newspaper" },
  { id: "miembros", label: "Miembros", icon: "fa-users" },
  { id: "postulaciones", label: "Postulaciones", icon: "fa-file-signature" },
  { id: "config", label: "Configuración", icon: "fa-gear" },
];

function getRelFirst(rel) {
  return Array.isArray(rel) ? rel[0] : rel;
}

const TYPE_LABELS = {
  anuncio: "Anuncio",
  debate: "Debate",
  general: "General",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const APP_STATUS_LABELS = {
  pending: "Pendiente",
  reviewed: "Revisada",
  contacted: "Contactado",
  cancelled: "Cancelada",
};

export default function ForoPanel({ profile, forums, posts, memberships, applications, users }) {
  const isAdmin = profile.role === "administrador";
  const router = useRouter();
  const [selectedForumId, setSelectedForumId] = useState(forums[0]?.id || "");
  const [activeTab, setActiveTab] = useState("posts");
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const selectedForum = useMemo(
    () => forums.find((f) => f.id === selectedForumId) || forums[0] || null,
    [forums, selectedForumId]
  );

  const forumPosts = useMemo(
    () => posts.filter((p) => p.forum_id === selectedForum?.id),
    [posts, selectedForum]
  );

  const forumMemberships = useMemo(
    () => memberships.filter((m) => m.forum_id === selectedForum?.id),
    [memberships, selectedForum]
  );

  const forumApplications = useMemo(
    () =>
      (applications ?? []).filter((a) => {
        const post = Array.isArray(a.forum_posts) ? a.forum_posts[0] : a.forum_posts;
        return post?.forum_id === selectedForum?.id;
      }),
    [applications, selectedForum]
  );

  function showMessage(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  function submitWith(action, form, okText, onDone) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        showMessage("error", result.error);
        return;
      }
      showMessage("ok", okText);
      form.reset();
      router.refresh();
      if (onDone) onDone();
    });
  }

  async function handleMemberAction(membershipId, status) {
    const formData = new FormData();
    formData.set("membership_id", membershipId);
    formData.set("status", status);
    const result = await updateMembershipStatus(formData);
    if (result?.error) {
      showMessage("error", result.error);
      return;
    }
    showMessage("ok", status === "approved" ? "Miembro aprobado." : "Solicitud rechazada.");
    router.refresh();
  }

  async function handleRemoveMembership(membershipId) {
    if (!confirm("¿Eliminar esta membresía?")) return;
    const formData = new FormData();
    formData.set("membership_id", membershipId);
    const result = await removeMembership(formData);
    if (result?.error) {
      showMessage("error", result.error);
      return;
    }
    showMessage("ok", "Miembro eliminado.");
    router.refresh();
  }

  async function handleDeletePost(postId) {
    if (!confirm("¿Eliminar este post?")) return;
    const formData = new FormData();
    formData.set("post_id", postId);
    const result = await deletePost(formData);
    if (result?.error) {
      showMessage("error", result.error);
      return;
    }
    showMessage("ok", "Post eliminado.");
    router.refresh();
  }

  async function handleDeleteForum(forumId) {
    if (!confirm("¿Eliminar este foro? Se borrarán todos sus posts y comentarios.")) return;
    const formData = new FormData();
    formData.set("forum_id", forumId);
    const result = await deleteForum(formData);
    if (result?.error) {
      showMessage("error", result.error);
      return;
    }
    showMessage("ok", "Foro eliminado.");
    router.refresh();
  }

  async function handleAppStatus(applicationId, status) {
    const formData = new FormData();
    formData.set("application_id", applicationId);
    formData.set("status", status);
    const result = await updateApplicationStatus(formData);
    if (result?.error) {
      showMessage("error", result.error);
      return;
    }
    showMessage("ok", "Estado actualizado.");
    router.refresh();
  }

  function startEditPost(post) {
    setEditingPost(post);
    setActiveTab("posts");
  }

  if (forums.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Foros</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tableros de anuncios y debate por proyecto.
          </p>
        </div>
        {isAdmin ? (
          <CreateForumForm users={users} action={createForum} onSuccess={() => router.refresh()} />
        ) : (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            No tienes foros asignados como coordinador.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Foros</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tableros de anuncios y debate por proyecto.
          </p>
        </div>
        {selectedForum && (
          <Link
            href={`/foro/${selectedForum.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#872075] bg-[#872075]/8 hover:bg-[#872075]/15 transition-colors px-4 py-2 rounded-full"
          >
            <i className="fa-solid fa-external-link-alt text-xs" aria-hidden="true" />
            Ver foro público
          </Link>
        )}
      </div>

      {msg && (
        <p
          className={`text-sm rounded-xl px-4 py-3 border ${
            msg.type === "ok"
              ? "text-green-700 border-green-100 bg-green-50"
              : "text-red-700 border-red-100 bg-red-50"
          }`}
        >
          {msg.text}
        </p>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar de foros */}
        <aside className="lg:col-span-1 space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-extrabold text-gray-800 mb-3 uppercase tracking-wide">
              Foros
            </h2>
            <div className="space-y-1">
              {forums.map((forum) => (
                <button
                  key={forum.id}
                  onClick={() => {
                    setSelectedForumId(forum.id);
                    setEditingPost(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    selectedForumId === forum.id
                      ? "bg-[#872075]/10 text-[#872075]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {forum.name}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <h2 className="text-sm font-extrabold text-gray-800 mb-3 uppercase tracking-wide">
                Nuevo foro
              </h2>
              <CreateForumForm users={users} action={createForum} onSuccess={() => router.refresh()} />
            </div>
          )}
        </aside>

        {/* Contenido principal */}
        <main className="lg:col-span-3 space-y-6">
          {selectedForum && (
            <>
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-800">{selectedForum.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedForum.description || "Sin descripción"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Slug: <span className="font-mono">{selectedForum.slug}</span> ·
                      Coordinador:{" "}
                      {selectedForum.coordinator?.name || "Sin asignar"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      selectedForum.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {selectedForum.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-100 overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {TABS.filter((t) => {
                    if (!isAdmin && t.id === "config") return false;
                    if (t.id === "postulaciones" && !selectedForum?.allow_applications) return false;
                    return true;
                  }).map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (tab.id !== "posts") setEditingPost(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? "border-[#872075] text-[#872075]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <i className={`fa-solid ${tab.icon} text-xs`} aria-hidden="true" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "posts" && (
                <PostsTab
                  forum={selectedForum}
                  posts={forumPosts}
                  isPending={isPending}
                  editingPost={editingPost}
                  onCreate={(form) =>
                    submitWith(createPost, form, "Post publicado.", () => setEditingPost(null))
                  }
                  onUpdate={(form) =>
                    submitWith(updatePost, form, "Post actualizado.", () => setEditingPost(null))
                  }
                  onEdit={startEditPost}
                  onDelete={handleDeletePost}
                  onCancelEdit={() => setEditingPost(null)}
                />
              )}

              {activeTab === "miembros" && (
                <MiembrosTab
                  memberships={forumMemberships}
                  onApprove={(id) => handleMemberAction(id, "approved")}
                  onReject={(id) => handleMemberAction(id, "rejected")}
                  onRemove={handleRemoveMembership}
                />
              )}

              {activeTab === "postulaciones" && selectedForum?.allow_applications && (
                <PostulacionesTab
                  forumSlug={selectedForum?.slug}
                  applications={forumApplications}
                  onUpdateStatus={handleAppStatus}
                />
              )}

              {activeTab === "config" && isAdmin && (
                <ConfigTab
                  forum={selectedForum}
                  users={users}
                  isPending={isPending}
                  onUpdate={(form) => submitWith(updateForum, form, "Foro actualizado.")}
                  onDelete={() => handleDeleteForum(selectedForum.id)}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function CreateForumForm({ users, action, onSuccess }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);

  function handleSubmit(form) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: "Foro creado." });
      form.reset();
      if (onSuccess) onSuccess();
    });
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e.currentTarget);
      }}
    >
      {msg && (
        <p
          className={`text-sm rounded-xl px-3 py-2 border ${
            msg.type === "ok"
              ? "text-green-700 border-green-100 bg-green-50"
              : "text-red-700 border-red-100 bg-red-50"
          }`}
        >
          {msg.text}
        </p>
      )}
      <input
        name="name"
        placeholder="Nombre del foro"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        required
      />
      <input
        name="slug"
        placeholder="Slug (ej: club-deportivo-tcp)"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
        required
      />
      <textarea
        name="description"
        placeholder="Descripción (opcional)"
        rows={2}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
      />
      <select
        name="coordinator_id"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
      >
        <option value="">Coordinador (opcional)</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <select
        name="visibility"
        defaultValue="public"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
      >
        <option value="public">Visible para todos</option>
        <option value="authenticated">Solo usuarios logueados</option>
      </select>
      <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
        <input
          type="checkbox"
          name="allow_comments"
          value="true"
          defaultChecked
        />
        Permitir comentarios de miembros
      </label>
      <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
        <input
          type="checkbox"
          name="allow_applications"
          value="true"
        />
        Permitir postulaciones (ofertas de empleo)
      </label>
      <button
        disabled={isPending}
        className="w-full rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
      >
        {isPending ? "Creando..." : "Crear foro"}
      </button>
    </form>
  );
}

function PostsTab({
  forum,
  posts,
  isPending,
  editingPost,
  onCreate,
  onUpdate,
  onEdit,
  onDelete,
  onCancelEdit,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-lg font-extrabold text-gray-800">
          {editingPost ? "Editar post" : "Nuevo post"}
        </h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (editingPost) {
              onUpdate(e.currentTarget);
            } else {
              onCreate(e.currentTarget);
            }
          }}
        >
          <input type="hidden" name="forum_id" value={forum.id} />
          {editingPost && <input type="hidden" name="post_id" value={editingPost.id} />}
          <input
            name="title"
            defaultValue={editingPost?.title || ""}
            placeholder="Título"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            required
          />
          <textarea
            name="content"
            defaultValue={editingPost?.content || ""}
            placeholder="Contenido"
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            <select
              name="type"
              defaultValue={editingPost?.type || "general"}
              className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            >
              <option value="general">General</option>
              <option value="anuncio">Anuncio</option>
              <option value="debate">Debate</option>
            </select>
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
              <input
                type="checkbox"
                name="is_pinned"
                value="true"
                defaultChecked={editingPost?.is_pinned || false}
              />
              Fijar al inicio
            </label>
          </div>
          <div className="flex gap-3">
            <button
              disabled={isPending}
              className="flex-1 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
            >
              {editingPost ? "Guardar cambios" : "Publicar"}
            </button>
            {editingPost && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-extrabold text-gray-800">Posts publicados</h3>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay posts en este foro.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 shadow-sm ${
                  post.is_pinned ? "border-[#872075]/20 bg-[#872075]/5" : "border-gray-100 bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {TYPE_LABELS[post.type] || post.type}
                      </span>
                      {post.is_pinned && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#872075]/10 text-[#872075]">
                          Fijado
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-extrabold text-gray-800">
                      <Link
                        href={`/foro/${forum.slug}/post/${post.id}`}
                        className="hover:text-[#872075] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Por {getRelFirst(post.profiles)?.name || "Anónimo"} ·{" "}
                      {new Date(post.created_at).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(post)}
                      className="text-xs font-semibold text-[#872075] hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(post.id)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MiembrosTab({ memberships, onApprove, onReject, onRemove }) {
  const pending = memberships.filter((m) => m.status === "pending");
  const approved = memberships.filter((m) => m.status === "approved");
  const rejected = memberships.filter((m) => m.status === "rejected");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-amber-800 mb-3">
          Solicitudes pendientes ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <p className="text-sm text-amber-700">No hay solicitudes pendientes.</p>
        ) : (
          <div className="space-y-2">
            {pending.map((m) => (
              <div
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{getRelFirst(m.profiles)?.name}</p>
                  <p className="text-xs text-gray-500">
                    Solicitó el {new Date(m.joined_at).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(m.id)}
                    className="rounded-lg bg-green-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => onReject(m.id)}
                    className="rounded-lg bg-red-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-red-700"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-gray-800 mb-3">
          Miembros aprobados ({approved.length})
        </h3>
        {approved.length === 0 ? (
          <p className="text-sm text-gray-500">No hay miembros aprobados aún.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {approved.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-700">{getRelFirst(m.profiles)?.name}</span>
                <button
                  onClick={() => onRemove(m.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Expulsar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-gray-800 mb-3">
          Rechazados ({rejected.length})
        </h3>
        {rejected.length === 0 ? (
          <p className="text-sm text-gray-500">No hay solicitudes rechazadas.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {rejected.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-700">{getRelFirst(m.profiles)?.name}</span>
                <button
                  onClick={() => onRemove(m.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function PostulacionesTab({ forumSlug, applications, onUpdateStatus }) {
  if (!applications || applications.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">Postulaciones</h3>
        <p className="text-sm text-gray-500">Aún no hay postulaciones en este foro.</p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => {
        const post = Array.isArray(app.forum_posts) ? app.forum_posts[0] : app.forum_posts;
        const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
        return (
          <div
            key={app.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#872075]/10 text-[#872075] text-xs font-bold shrink-0">
                    {(profile?.name || "A")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{profile?.name || "Desconocido"}</p>
                    <p className="text-xs text-gray-500">Postulante</p>
                  </div>
                </div>
                {(profile?.phone_number || profile?.address) && (
                  <div className="mt-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2 space-y-1 text-xs">
                    {profile?.phone_number && (
                      <p className="text-gray-600 break-all">
                        <i className="fa-solid fa-phone text-gray-400 mr-1" aria-hidden="true" />
                        {profile.phone_number}
                      </p>
                    )}
                    {profile?.address && (
                      <p className="text-gray-600 break-all">
                        <i className="fa-solid fa-location-dot text-gray-400 mr-1" aria-hidden="true" />
                        {profile.address}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Oferta:</span>{" "}
                  <Link
                    href={`/foro/${forumSlug}/post/${app.post_id}`}
                    className="text-[#872075] hover:underline"
                  >
                    {post?.title || "Oferta"}
                  </Link>
                </p>
                <p className="text-xs text-gray-500">
                  Postuló el {new Date(app.created_at).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                {app.message && (
                  <div className="mt-2 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-600 whitespace-pre-wrap break-words">{app.message}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 sm:shrink-0">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    app.status === "pending"
                      ? "bg-amber-50 text-amber-700"
                      : app.status === "reviewed"
                      ? "bg-blue-50 text-blue-700"
                      : app.status === "contacted"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {APP_STATUS_LABELS[app.status] || app.status}
                </span>
                {app.status !== "cancelled" && (
                  <select
                    value={app.status}
                    onChange={(e) => {
                      if (e.target.value !== app.status) {
                        onUpdateStatus(app.id, e.target.value);
                      }
                    }}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs font-semibold"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="reviewed">Revisada</option>
                    <option value="contacted">Contactado</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ConfigTab({ forum, users, isPending, onUpdate, onDelete }) {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
        <h3 className="text-lg font-extrabold text-gray-800">Configuración del foro</h3>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onUpdate(e.currentTarget);
          }}
        >
          <input type="hidden" name="forum_id" value={forum.id} />
          <input
            name="name"
            defaultValue={forum.name}
            placeholder="Nombre del foro"
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
            required
          />
          <textarea
            name="description"
            defaultValue={forum.description || ""}
            placeholder="Descripción"
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          />
          <select
            name="coordinator_id"
            defaultValue={forum.coordinator_id || ""}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          >
            <option value="">Sin coordinador</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            name="visibility"
            defaultValue={forum.visibility || "public"}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
          >
            <option value="public">Visible para todos</option>
            <option value="authenticated">Solo usuarios logueados</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_active"
              value="true"
              defaultChecked={forum.is_active}
            />
            Foro activo
          </label>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
            <input
              type="checkbox"
              name="allow_comments"
              value="true"
              defaultChecked={forum.allow_comments !== false}
            />
            Permitir comentarios de miembros
          </label>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700">
            <input
              type="checkbox"
              name="allow_applications"
              value="true"
              defaultChecked={forum.allow_applications === true}
            />
            Permitir postulaciones (ofertas de empleo)
          </label>
          <button
            disabled={isPending}
            className="w-full rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
          >
            Guardar cambios
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
        <h3 className="text-lg font-extrabold text-red-800 mb-2">Zona peligrosa</h3>
        <p className="text-sm text-red-700 mb-4">
          Eliminar el foro borrará todos sus posts y comentarios. Esta acción no se puede deshacer.
        </p>
        <button
          onClick={onDelete}
          className="rounded-xl bg-red-600 text-white font-bold py-2.5 px-4 text-sm hover:bg-red-700"
        >
          Eliminar foro
        </button>
      </section>
    </div>
  );
}
