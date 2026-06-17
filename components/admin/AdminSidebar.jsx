"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { hasPermission } from "@/lib/permissions";

const ROLE_ES = {
  leader:        "Líder",
  administrador: "Administrador",
  alfabetizador: "Alfabetizador",
  consultor:     "Consultor",
  miembro:       "Miembro",
};

const navItems = [
  { href: "/admin",             icon: "fa-gauge",           label: "Dashboard",     permission: null },
  { href: "/admin/club-deportivo", icon: "fa-futbol", label: "Club deportivo", permission: null, roles: ["leader", "administrador", "consultor"] },
  { href: "/admin/servicio-social", icon: "fa-hand-holding-heart", label: "Servicio social", permission: null, roles: ["leader", "alfabetizador"] },
  { href: "/admin/contenido",   icon: "fa-file-pen",        label: "Contenido",     permission: "edit:content" },
  { href: "/admin/usuarios",    icon: "fa-users",           label: "Usuarios",      permission: "manage:users" },
];

export default function AdminSidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const visibleItems = navItems.filter((item) => {
    const hasRole = !item.roles || item.roles.includes(profile.role);
    const hasPerm = item.permission === null || hasPermission(profile, item.permission);
    return hasRole && hasPerm;
  });

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 flex flex-col min-h-screen hidden md:flex">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#872075] font-extrabold text-lg leading-none">TCP</span>
          <span className="text-xs text-gray-400 font-medium">Admin</span>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#872075]/10 text-[#872075]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-4 text-center text-xs`} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[#872075]/5 transition-colors group"
        >
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#872075]/10 flex items-center justify-center shrink-0 group-hover:bg-[#872075]/20 transition-colors">
              <span className="text-xs font-bold text-[#872075]">{profile.name?.[0]?.toUpperCase()}</span>
            </div>
          )}
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-gray-800 truncate">{profile.name}</p>
            <p className="text-[10px] text-gray-400">{ROLE_ES[profile.role] ?? profile.role}</p>
          </div>
          <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-[#872075] transition-colors" aria-hidden="true" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors font-semibold"
        >
          <i className="fa-solid fa-arrow-right-from-bracket text-xs" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
