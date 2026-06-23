import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import CurvedHeader from "@/components/ui/CurvedHeader";
import CommentForm from "@/components/foro/CommentForm";
import JoinForumButton from "@/components/foro/JoinForumButton";
import {
  ForumPageLayout,
  ForumCard,
  TYPE_LABELS,
  getRelFirst,
} from "@/components/foro/ForumPageLayout";

export async function generateMetadata({ params }) {
  const { slug, postId } = await params;
  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("title, forums(slug, is_active)")
    .eq("id", postId)
    .eq("forums.slug", slug)
    .maybeSingle();

  return {
    title: post?.title ? `${post.title}` : "Publicación",
  };
}

export default async function ForumPostPage({ params }) {
  const { slug, postId } = await params;

  const admin = createAdminClient();
  const { data: post } = await admin
    .from("forum_posts")
    .select("*, profiles(id, name), forums(*)")
    .eq("id", postId)
    .eq("forums.slug", slug)
    .maybeSingle();

  if (!post || !post.forums?.is_active) notFound();

  const forum = getRelFirst(post.forums);

  const { data: forumDetail } = await admin
    .from("forums")
    .select("id, name, description, coordinator_id, allow_comments, coordinator:coordinator_id(id, name)")
    .eq("id", forum.id)
    .single();

  const { data: comments } = await admin
    .from("forum_comments")
    .select("*, profiles(id, name)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(50);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let membership = null;
  let canComment = false;
  let isCoordinator = false;

  if (user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("id, name, role, status")
      .eq("id", user.id)
      .single();
    profile = p;

    if (profile?.status === "approved") {
      isCoordinator =
        profile.role === "administrador" || forum.coordinator_id === profile.id;
      canComment = isCoordinator;

      if (!canComment) {
        const { data: m } = await supabase
          .from("forum_members")
          .select("id, status")
          .eq("forum_id", forum.id)
          .eq("user_id", profile.id)
          .eq("status", "approved")
          .maybeSingle();
        membership = m;
        canComment = !!m;
      }
    }
  }

  const forumAllowsComments = forumDetail?.allow_comments !== false;

  return (
    <>
      <CurvedHeader title={forum.name} subtitle="Foro de la comunidad" />
      <ForumPageLayout backHref={`/foro/${slug}`} backLabel="Volver al foro">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ForumCard className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {TYPE_LABELS[post.type] || post.type}
                </span>
                {post.is_pinned && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-[#872075]/10 text-[#872075]">
                    Fijado
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                {post.title}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                Por {getRelFirst(post.profiles)?.name || "Anónimo"} ·{" "}
                {new Date(post.created_at).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </ForumCard>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
                <h2 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">
                  Comentarios ({comments?.length || 0})
                </h2>
              </div>

              {forumAllowsComments ? (
                <>
                  {canComment ? (
                    <CommentForm postId={postId} />
                  ) : user ? (
                    membership?.status === "pending" ? (
                      <ForumCard className="p-6">
                        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                          <p className="text-sm text-amber-700">
                            Tu solicitud de membresía está pendiente. Una vez aprobada podrás comentar.
                          </p>
                        </div>
                      </ForumCard>
                    ) : (
                      <ForumCard className="p-6">
                        <h3 className="text-base font-extrabold text-gray-900 mb-2">
                          Unirse al foro para comentar
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Debés ser miembro aprobado de este foro para dejar un comentario.
                        </p>
                        <JoinForumButton forumId={forum.id} />
                      </ForumCard>
                    )
                  ) : (
                    <ForumCard className="p-6">
                      <h3 className="text-base font-extrabold text-gray-900 mb-2">
                        Iniciar sesión para comentar
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Ingresá a tu cuenta para unirte al foro y participar en la conversación.
                      </p>
                      <Link
                        href="/admin/login"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#872075] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6f1a60] transition-colors"
                      >
                        <i className="fa-solid fa-circle-user text-sm" aria-hidden="true" />
                        Iniciar sesión
                      </Link>
                    </ForumCard>
                  )}
                </>
              ) : (
                <ForumCard className="p-6">
                  <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                    <p className="text-sm text-blue-700">
                      <i className="fa-solid fa-circle-info mr-1" aria-hidden="true" />
                      Este es un foro informativo. Solo el coordinador puede publicar.
                    </p>
                  </div>
                </ForumCard>
              )}

              <div className="space-y-4">
                {(comments ?? []).length === 0 ? (
                  <ForumCard className="p-6 text-center">
                    <i className="fa-solid fa-comments text-4xl text-gray-300 mb-3 block" aria-hidden="true" />
                    <p className="text-sm text-gray-500">
                      {forumAllowsComments ? "Aún no hay comentarios. Sé el primero." : "Aún no hay comentarios."}
                    </p>
                  </ForumCard>
                ) : (
                  (comments ?? []).map((comment) => (
                    <ForumCard key={comment.id} className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#872075]/10 text-[#872075] text-xs font-bold">
                            {(getRelFirst(comment.profiles)?.name || "A")[0].toUpperCase()}
                          </div>
                      <span className="text-sm font-bold text-[#872075]">
                        {getRelFirst(comment.profiles)?.name || "Anónimo"}
                      </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleDateString("es-CO", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </ForumCard>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <ForumCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#872075]/10 text-[#872075]">
                  <i className="fa-solid fa-circle-info text-sm" aria-hidden="true" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">Sobre este foro</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {forumDetail?.description || forum.description || "Espacio de anuncios y conversación de la comunidad."}
              </p>
              <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
                <p>
                  <span className="font-semibold">Coordinador:</span>{" "}
                  {forumDetail?.coordinator?.name || "Por asignar"}
                </p>
              </div>
            </ForumCard>

            <Link
              href={`/foro/${forum.slug}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:border-[#872075]/30 hover:text-[#872075] transition-colors shadow-sm"
            >
              <i className="fa-solid fa-newspaper text-sm" aria-hidden="true" />
              Ver todas las publicaciones
            </Link>
          </aside>
        </div>
      </ForumPageLayout>
    </>
  );
}
