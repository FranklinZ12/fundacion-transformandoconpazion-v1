import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import CurvedHeader from "@/components/ui/CurvedHeader";
import JoinForumButton from "@/components/foro/JoinForumButton";
import NewPostForm from "@/components/foro/NewPostForm";
import {
  ForumPageLayout,
  ForumSectionTitle,
  ForumCard,
  TYPE_LABELS,
  getRelFirst,
} from "@/components/foro/ForumPageLayout";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const { data: forum } = await admin
    .from("forums")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return {
    title: forum?.name ? `Foro ${forum.name}` : "Foro",
    description: forum?.description || "",
  };
}

export default async function ForumPublicPage({ params }) {
  const { slug } = await params;

  const admin = createAdminClient();
  const { data: forum } = await admin
    .from("forums")
    .select("*, coordinator:coordinator_id(id, name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!forum) notFound();

  const { data: posts } = await admin
    .from("forum_posts")
    .select("*, profiles(id, name), forum_comments(id)")
    .eq("forum_id", forum.id)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let membership = null;
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
        profile.role === "administrador" || forum.coordinator?.id === profile.id;

      const { data: m } = await supabase
        .from("forum_members")
        .select("id, status")
        .eq("forum_id", forum.id)
        .eq("user_id", profile.id)
        .maybeSingle();
      membership = m;
    }
  }

  return (
    <>
      <CurvedHeader title={forum.name} subtitle={forum.description || "Foro de la comunidad"} />
      <ForumPageLayout backHref="/foro" backLabel="Volver a foros">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ForumSectionTitle
              title="Publicaciones"
              subtitle={isCoordinator ? "Podés crear anuncios y debates" : "Novedades del foro"}
            />

            {isCoordinator && <NewPostForm forumId={forum.id} slug={forum.slug} />}

            {(posts ?? []).length === 0 ? (
              <ForumCard className="p-8 text-center">
                <i className="fa-solid fa-newspaper text-4xl text-gray-300 mb-4 block" aria-hidden="true" />
                <p className="text-gray-500">Este foro aún no tiene publicaciones.</p>
              </ForumCard>
            ) : (
              <div className="space-y-4">
                {(posts ?? []).map((post) => (
                  <article
                    key={post.id}
                    className={`rounded-2xl border p-6 transition-all hover:shadow-md ${
                      post.is_pinned
                        ? "border-[#872075]/20 bg-[#872075]/5"
                        : "border-gray-100 bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {TYPE_LABELS[post.type] || post.type}
                      </span>
                      {post.is_pinned && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#872075]/10 text-[#872075]">
                          Fijado
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-900 mb-2">
                      <Link
                        href={`/foro/${forum.slug}/post/${post.id}`}
                        className="hover:text-[#872075] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                      <span>
                        Por {getRelFirst(post.profiles)?.name || "Anónimo"} ·{" "}
                        {new Date(post.created_at).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <i className="fa-solid fa-comment text-[10px]" aria-hidden="true" />
                        {Array.isArray(post.forum_comments) ? post.forum_comments.length : 0}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
                {forum.description || "Espacio de anuncios y conversación de la comunidad."}
              </p>
              <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
                <p>
                  <span className="font-semibold">Coordinador:</span>{" "}
                  {forum.coordinator?.name || "Por asignar"}
                </p>
              </div>
            </ForumCard>

            {!user && (
              <ForumCard className="p-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-3">¿Querés participar?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Iniciá sesión para unirte al foro y comentar en las publicaciones.
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-[#872075] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6f1a60] transition-colors"
                >
                  <i className="fa-solid fa-circle-user text-sm" aria-hidden="true" />
                  Iniciar sesión
                </Link>
              </ForumCard>
            )}

            {user && profile?.status === "approved" && !isCoordinator && (
              <ForumCard className="p-6">
                <h3 className="text-base font-extrabold text-gray-900 mb-3">Tu membresía</h3>
                {membership?.status === "approved" ? (
                  <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
                    <p className="text-sm text-green-700">
                      <i className="fa-solid fa-check-circle mr-1" aria-hidden="true" />
                      Sos miembro de este foro. Podés comentar.
                    </p>
                  </div>
                ) : membership?.status === "pending" ? (
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                    <p className="text-sm text-amber-700">
                      Tu solicitud está pendiente de aprobación.
                    </p>
                  </div>
                ) : (
                  <JoinForumButton forumId={forum.id} />
                )}
              </ForumCard>
            )}

            {user && profile?.status !== "approved" && (
              <ForumCard className="p-6">
                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                  <p className="text-sm text-amber-700">
                    Tu cuenta aún no ha sido aprobada. Esperá la aprobación del administrador para
                    participar.
                  </p>
                </div>
              </ForumCard>
            )}
          </aside>
        </div>
      </ForumPageLayout>
    </>
  );
}
