import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/permissions";
import Link from "next/link";

export const metadata = { title: "Contenido" };

const SECTIONS = [
  {
    id:    "inicio",
    label: "Inicio",
    desc:  "Hero, estadísticas, misión, visión y objetivos.",
    icon:  "fa-house",
    href:  "/admin/contenido/inicio",
  },
  {
    id:    "contacto",
    label: "Contacto",
    desc:  "Dirección, horario, WhatsApp, correo y redes sociales.",
    icon:  "fa-address-book",
    href:  "/admin/contenido/contacto",
  },
  {
    id:    "organizacion",
    label: "Organización",
    desc:  "Quiénes somos, reseña, timeline, principios y valores.",
    icon:  "fa-building-columns",
    href:  "/admin/contenido/organizacion",
  },  {
    id:    "equipo",
    label: "Equipo",
    desc:  "Fotos, nombres, cargos y redes del equipo administrativo.",
    icon:  "fa-people-group",
    href:  "/admin/contenido/equipo",
  },
  {
    id:    "voluntario",
    label: "Voluntario y Donaciones",
    desc:  "Roles de voluntariado, tiers de donaci\u00f3n, impacto y CTA.",
    icon:  "fa-hand-holding-heart",
    href:  "/admin/contenido/voluntario",
  },
  {
    id:    "procesos",
    label: "Procesos",
    desc:  "Tarjetas, encabezados, descripciones y servicios de los 11 procesos.",
    icon:  "fa-diagram-project",
    href:  "/admin/contenido/procesos",
  },
];

export default async function ContenidoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, permissions, status")
    .eq("id", user.id)
    .single();

  if (!hasPermission(profile, "edit:content")) redirect("/admin");

  // Leer metadatos (última actualización) de cada sección
  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("site_content")
    .select("id, updated_at")
    .in("id", SECTIONS.map((s) => s.id));

  const updatedMap = Object.fromEntries((rows ?? []).map((r) => [r.id, r.updated_at]));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Contenido</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edita los textos e información visible en el sitio público.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {SECTIONS.map((s) => {
          const updatedAt = updatedMap[s.id];
          const date = updatedAt
            ? new Date(updatedAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })
            : null;

          return (
            <Link
              key={s.id}
              href={s.href}
              className="group flex flex-col gap-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#872075]/10 flex items-center justify-center">
                  <i className={`fa-solid ${s.icon} text-[#872075] text-lg`} aria-hidden="true" />
                </div>
                <i className="fa-solid fa-arrow-right text-gray-300 group-hover:text-[#872075] transition-colors mt-1" aria-hidden="true" />
              </div>
              <div>
                <p className="font-extrabold text-gray-800">{s.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              </div>
              {date ? (
                <p className="text-[11px] text-gray-400">
                  <i className="fa-solid fa-clock mr-1" aria-hidden="true" />
                  Actualizado el {date}
                </p>
              ) : (
                <p className="text-[11px] text-gray-300">Sin cambios guardados aún</p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
