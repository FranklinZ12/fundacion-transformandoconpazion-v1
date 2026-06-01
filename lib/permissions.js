/**
 * Permisos disponibles para asignar a usuarios.
 * El Líder tiene todos implícitamente — no necesita lista explícita.
 */
export const ALL_PERMISSIONS = [
  { code: "edit:content",  label: "Editar contenido",   icon: "fa-pen-to-square" },
  { code: "manage:users", label: "Gestionar Usuarios", icon: "fa-user-shield" },
];

/**
 * Verifica si un perfil de usuario tiene un permiso específico.
 *
 * @param {object|null} profile - Fila de la tabla profiles de Supabase
 * @param {string} permission   - Código del permiso, ej: "edit:processes"
 * @returns {boolean}
 */
export function hasPermission(profile, permission) {
  if (!profile) return false;
  if (profile.status !== "approved") return false;
  if (profile.role === "leader") return true;
  return Array.isArray(profile.permissions) && profile.permissions.includes(permission);
}

/**
 * Verifica si un perfil tiene al menos uno de los permisos dados.
 *
 * @param {object|null} profile
 * @param {string[]} permissions
 * @returns {boolean}
 */
export function hasAnyPermission(profile, permissions) {
  return permissions.some((p) => hasPermission(profile, p));
}

/**
 * Devuelve true si el perfil puede acceder al panel admin (aprobado + cualquier rol).
 */
export function canAccessAdmin(profile) {
  return !!profile && profile.status === "approved";
}
