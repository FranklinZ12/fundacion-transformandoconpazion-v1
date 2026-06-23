import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import CancelApplicationButton from "@/components/foro/CancelApplicationButton";

export const metadata = { title: "Mis Postulaciones" };

const STATUS_LABELS = {
  pending: "Pendiente",
  reviewed: "Revisada",
  contacted: "Contactado",
  cancelled: "Cancelada",
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  reviewed: "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-gray-50 text-gray-500 border-gray-100",
};

function getRelFirst(rel) {
  return Array.isArray(rel) ? rel[0] : rel;
}

export default async function MisPostulacionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.status !== "approved") redirect("/admin");

  const admin = createAdminClient();

  const { data: applications } = await admin
    .from("forum_applications")
    .select("*, forum_posts(id, title, forum_id, forums(slug, name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Mis Postulaciones</h1>
        <p className="text-sm text-gray-500 mt-1">
          Ofertas a las que te has postulado.
        </p>
      </div>

      {!applications || applications.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <i className="fa-solid fa-file-signature text-4xl text-gray-300 mb-4 block" aria-hidden="true" />
          <h2 className="text-lg font-extrabold text-gray-800 mb-2">Sin postulaciones</h2>
          <p className="text-sm text-gray-500 mb-6">
            Aún no te has postulado a ninguna oferta.
          </p>
          <Link
            href="/foro"
            className="inline-flex items-center gap-2 rounded-xl bg-[#872075] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6f1a60] transition-colors"
          >
            <i className="fa-solid fa-bullhorn text-sm" aria-hidden="true" />
            Ver foros
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const post = getRelFirst(app.forum_posts);
            const forum = post ? getRelFirst(post.forums) : null;
            const canCancel = app.status === "pending" || app.status === "reviewed";

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-gray-800">
                        {post?.title || "Oferta"}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`}
                      >
                        {STATUS_LABELS[app.status] || app.status}
                      </span>
                    </div>
                    {forum && (
                      <p className="text-sm text-gray-500">
                        Foro:{" "}
                        <Link
                          href={`/foro/${forum.slug}`}
                          className="text-[#872075] hover:underline font-semibold"
                        >
                          {forum.name}
                        </Link>
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Postulaste el{" "}
                      {new Date(app.created_at).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={forum ? `/foro/${forum.slug}/post/${app.post_id}` : "#"}
                      className="text-xs font-semibold text-[#872075] hover:underline"
                    >
                      Ver oferta
                    </Link>
                    {canCancel && <CancelApplicationButton applicationId={app.id} />}
                  </div>
                </div>
                {app.message && (
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Tu mensaje:</p>
                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{app.message}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
