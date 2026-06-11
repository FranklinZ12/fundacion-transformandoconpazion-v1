"use client";

import { useState, useTransition, useEffect } from "react";
import { ALL_PERMISSIONS } from "@/lib/permissions";
import {
  approveUser,
  rejectUser,
  updateUserPermissions,
  deleteUser,
  updateUserPasswordByLeader,
} from "@/app/admin/usuarios/actions";

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const styles = {
    success: "bg-green-600",
    error:   "bg-red-500",
    info:    "bg-[#872075]",
  };
  const icons = {
    success: "fa-circle-check",
    error:   "fa-circle-xmark",
    info:    "fa-floppy-disk",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${styles[type]}`}>
      <i className={`fa-solid ${icons[type]}`} aria-hidden="true" />
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
      </button>
    </div>
  );
}

const ROLE_OPTIONS = [
  { value: "miembro",       label: "Miembro" },
  { value: "consultor",     label: "Consultor" },
  { value: "alfabetizador", label: "Alfabetizador" },
  { value: "administrador", label: "Administrador" },
];

const ROLE_ES = {
  leader:        "Líder",
  administrador: "Administrador",
  alfabetizador: "Alfabetizador",
  consultor:     "Consultor",
  miembro:       "Miembro",
};

export default function UsersPanel({ users }) {
  const [toast, setToast] = useState(null);

  const pending  = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved");
  const rejected = users.filter((u) => u.status === "rejected");

  function notify(message, type = "success") {
    setToast({ message, type, key: Date.now() });
  }

  return (
    <>
      <div className="space-y-10">
        {/* Solicitudes pendientes */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-clock" aria-hidden="true" />
              Solicitudes pendientes ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((u) => <UserCard key={u.id} user={u} notify={notify} />)}
            </div>
          </section>
        )}

        {/* Equipo activo */}
        {(approved.length > 0 || (pending.length === 0 && rejected.length === 0)) && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-users" aria-hidden="true" />
              Equipo activo ({approved.length})
            </h2>
            {approved.length === 0 ? (
              <div className="text-center py-16 text-gray-300">
                <i className="fa-solid fa-users text-4xl mb-3 block" aria-hidden="true" />
                <p className="text-sm">No hay usuarios registrados aún.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {approved.map((u) => <UserCard key={u.id} user={u} notify={notify} />)}
              </div>
            )}
          </section>
        )}

        {/* Rechazados */}
        {rejected.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-ban" aria-hidden="true" />
              Rechazados ({rejected.length})
            </h2>
            <div className="space-y-3">
              {rejected.map((u) => <UserCard key={u.id} user={u} notify={notify} />)}
            </div>
          </section>
        )}
      </div>

      {toast && (
        <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
}

function UserCard({ user, notify }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [role, setRole] = useState(
    ["miembro", "consultor", "alfabetizador", "administrador"].includes(user.role)
      ? user.role
      : "miembro"
  );
  const [perms, setPerms] = useState(user.permissions ?? []);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const roleLabel = ROLE_ES[user.role] ?? user.role;
  const initials = (user.name ?? "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const date = new Date(user.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });

  function togglePerm(code) {
    setPerms((prev) => prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]);
  }

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-opacity ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <div className="h-9 w-9 rounded-full bg-[#872075]/10 text-[#872075] flex items-center justify-center font-bold text-xs flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate leading-tight">{user.name ?? "Sin nombre"}</p>
          <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">{user.email ?? "—"}</p>
          <p className="text-[11px] text-gray-300 mt-0.5">{roleLabel} · {date}</p>
        </div>

        {/* Acciones inline para pendientes */}
        {user.status === "pending" && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => startTransition(async () => { await approveUser(user.id); notify(`${user.name ?? "Usuario"} aprobado`); })}
              className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <i className="fa-solid fa-check text-[10px]" aria-hidden="true" />
              Aprobar
            </button>
            <button
              onClick={() => startTransition(async () => { await rejectUser(user.id); notify(`${user.name ?? "Usuario"} rechazado`, "error"); })}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <i className="fa-solid fa-xmark text-[10px]" aria-hidden="true" />
              Rechazar
            </button>
          </div>
        )}

        {/* Reactivar rechazado */}
        {user.status === "rejected" && (
          <button
            onClick={() => startTransition(async () => { await approveUser(user.id); notify(`${user.name ?? "Usuario"} reactivado`); })}
            className="flex-shrink-0 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg px-3 py-1.5 transition-colors"
          >
            <i className="fa-solid fa-rotate-left text-[10px] mr-1" aria-hidden="true" />
            Reactivar
          </button>
        )}

        {/* Pill status — solo fuera de su sección (aprobados) */}
        {user.status === "approved" && (
          <span className="flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
            Activo
          </span>
        )}
      </div>

      {/* Expandir permisos (solo aprobados, no líderes) */}
      {user.status === "approved" && user.role !== "leader" && (
        <>
          <div className="border-t border-gray-100 px-5 py-2">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 hover:text-[#872075] transition-colors py-1"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                Rol y permisos
              </span>
              <i className={`fa-solid fa-angle-down transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          </div>

          {expanded && (
            <div className="px-5 pb-5 space-y-4 border-t border-gray-50 pt-3">
              {/* Rol */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Rol</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Permisos */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Permisos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.filter((p) => p.code !== "manage:users").map((p) => (
                    <label key={p.code} className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={perms.includes(p.code)}
                        onChange={() => togglePerm(p.code)}
                        className="rounded border-gray-300 text-[#872075] focus:ring-[#872075]/30"
                      />
                      <span className="flex items-center gap-1.5 text-sm text-gray-700 group-hover:text-[#872075] transition-colors">
                        <i className={`fa-solid ${p.icon} text-xs text-gray-400`} aria-hidden="true" />
                        {p.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Guardar */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => startTransition(async () => { await updateUserPermissions(user.id, role, perms); notify("Permisos guardados", "info"); })}
                  className="flex items-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6d1960] text-white text-sm font-semibold px-4 py-2 transition-colors"
                >
                  {isPending ? <i className="fa-solid fa-circle-notch fa-spin text-xs" aria-hidden="true" /> : <i className="fa-solid fa-floppy-disk text-xs" aria-hidden="true" />}
                  Guardar
                </button>

                {/* Eliminar usuario */}
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Eliminar cuenta
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-500 font-semibold">¿Confirmar?</span>
                    <button
                      onClick={() => startTransition(async () => { await deleteUser(user.id); notify("Usuario eliminado", "error"); })}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg font-semibold transition-colors"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              {/* Cambio de contraseña por líder */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Cambiar contraseña</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20"
                  />
                </div>
                <button
                  onClick={() => startTransition(async () => {
                    if (!newPassword || !confirmPassword) {
                      notify("Completa los dos campos", "error");
                      return;
                    }
                    if (newPassword.length < 8) {
                      notify("Mínimo 8 caracteres", "error");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      notify("Las contraseñas no coinciden", "error");
                      return;
                    }
                    try {
                      await updateUserPasswordByLeader(user.id, newPassword);
                      setNewPassword("");
                      setConfirmPassword("");
                      notify("Contraseña actualizada", "success");
                    } catch (err) {
                      notify(err?.message || "No se pudo cambiar la contraseña", "error");
                    }
                  })}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-2 transition-colors"
                >
                  <i className="fa-solid fa-key text-[10px]" aria-hidden="true" />
                  Guardar nueva contraseña
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
