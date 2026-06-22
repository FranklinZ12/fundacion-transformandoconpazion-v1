import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import CurvedHeader from "@/components/ui/CurvedHeader";
import {
  ForumPageLayout,
  ForumSectionTitle,
  ForumCard,
  TYPE_LABELS,
  getRelFirst,
} from "@/components/foro/ForumPageLayout";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Foros",
  description: "Comunidad y foros de los proyectos de Fundación Transformando Con Pazión",
};

export default async function ForoIndexPage() {
  const admin = createAdminClient();

  const [{ data: forums }, { data: posts }] = await Promise.all([
    admin
      .from("forums")
      .select("*, coordinator:coordinator_id(id, name)")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    admin
      .from("forum_posts")
      .select("*, profiles(id, name), forums(slug, name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const activeForums = forums ?? [];
  const recentPosts = posts ?? [];

  return (
    <>
      <CurvedHeader title="Foros" subtitle="Comunidad y conversación de nuestros proyectos" />
      <ForumPageLayout>
        {activeForums.length === 0 ? (
          <ForumCard className="p-8 text-center">
            <i className="fa-solid fa-comments text-4xl text-gray-300 mb-4 block" aria-hidden="true" />
            <p className="text-gray-500">Aún no hay foros activos.</p>
          </ForumCard>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lista de foros */}
            <div className="lg:col-span-2 space-y-6">
              <ForumSectionTitle title="Foros disponibles" subtitle="Espacios de anuncios y debate por proyecto" />
              <div className="grid gap-4">
                {activeForums.map((forum) => (
                  <Link
                    key={forum.id}
                    href={`/foro/${forum.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm p-6 transition-all hover:shadow-md hover:border-[#872075]/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#872075]/10 text-[#872075]">
                        <i className="fa-solid fa-comments text-sm" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-[#872075] transition-colors">
                          {forum.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {forum.description || "Espacio de anuncios y conversación."}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Coordinador: {forum.coordinator?.name || "Por asignar"}
                        </p>
                      </div>
                    </div>
                    <i
                      className="fa-solid fa-arrow-right text-[#872075] mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Posts recientes */}
            <aside className="space-y-6">
              <ForumSectionTitle title="Publicaciones recientes" />
              {recentPosts.length === 0 ? (
                <ForumCard className="p-6">
                  <p className="text-sm text-gray-500">Aún no hay publicaciones.</p>
                </ForumCard>
              ) : (
                <div className="space-y-3">
                  {recentPosts.map((post) => {
                    const forum = getRelFirst(post.forums);
                    return (
                      <Link
                        key={post.id}
                        href={`/foro/${forum?.slug}/post/${post.id}`}
                        className="block rounded-2xl bg-white border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md hover:border-[#872075]/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#872075]/10 text-[#872075]">
                            {forum?.name}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {TYPE_LABELS[post.type] || post.type}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-gray-800 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {getRelFirst(post.profiles)?.name} ·{" "}
                          {new Date(post.created_at).toLocaleDateString("es-CO")}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        )}
      </ForumPageLayout>
    </>
  );
}
