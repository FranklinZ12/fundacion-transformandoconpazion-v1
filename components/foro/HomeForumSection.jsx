import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { TYPE_LABELS, getRelFirst } from "@/components/foro/ForumPageLayout";

export default async function HomeForumSection() {
  const admin = createAdminClient();

  const [{ data: forums }, { data: posts }] = await Promise.all([
    admin
      .from("forums")
      .select("id, slug, name, description")
      .eq("is_active", true)
      .order("name", { ascending: true })
      .limit(4),
    admin
      .from("forum_posts")
      .select("*, profiles(id, name), forums(slug, name)")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const activeForums = forums ?? [];
  const recentPosts = posts ?? [];

  if (activeForums.length === 0 && recentPosts.length === 0) return null;

  return (
    <section aria-label="Foros de la comunidad" className="bg-[#f9fafb] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-gray-900">Comunidad</h2>
          <p className="mt-2 text-lg text-gray-500">
            Foros de nuestros proyectos. Entérate y participa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Posts recientes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
              <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">
                Últimas publicaciones
              </h3>
            </div>
            {recentPosts.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <p className="text-sm text-gray-500">Aún no hay publicaciones.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPosts.map((post) => {
                  const forum = getRelFirst(post.forums);
                  return (
                    <Link
                      key={post.id}
                      href={`/foro/${forum?.slug}/post/${post.id}`}
                      className="block rounded-2xl bg-white border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md hover:border-[#872075]/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#872075]/10 text-[#872075]">
                          {forum?.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {TYPE_LABELS[post.type] || post.type}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-gray-900 line-clamp-1">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {getRelFirst(post.profiles)?.name} ·{" "}
                        {new Date(post.created_at).toLocaleDateString("es-CO")}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Foros disponibles */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-6 w-1 rounded-full bg-[#872075]" aria-hidden="true" />
              <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-wide">
                Foros disponibles
              </h3>
            </div>
            {activeForums.length === 0 ? (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <p className="text-sm text-gray-500">Aún no hay foros activos.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {activeForums.map((forum) => (
                  <Link
                    key={forum.id}
                    href={`/foro/${forum.slug}`}
                    className="flex items-center justify-between rounded-2xl bg-white border border-gray-100 shadow-sm p-4 transition-all hover:shadow-md hover:border-[#872075]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#872075]/10 text-[#872075]">
                        <i className="fa-solid fa-comments text-sm" aria-hidden="true" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-gray-900">{forum.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{forum.description}</p>
                      </div>
                    </div>
                    <i
                      className="fa-solid fa-arrow-right text-[#872075] text-xs"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/foro"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#872075] hover:underline"
            >
              Ver todos los foros
              <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
