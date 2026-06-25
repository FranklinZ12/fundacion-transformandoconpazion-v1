"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile, updateUserPassword } from "@/app/admin/profile/actions";

export default function ProfileForm({ profile, user }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || "");
  const [address, setAddress] = useState(profile.address || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || name.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("phone_number", phoneNumber.trim());
    formData.append("address", address.trim());
    if (avatarFile) formData.append("avatar", avatarFile);

    const result = await updateUserProfile(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    if (result.avatarUrl) setAvatarUrl(result.avatarUrl);
    setAvatarFile(null);
    router.refresh();
    setTimeout(() => setSuccess(false), 3000);
    setLoading(false);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son requeridos.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setPasswordLoading(true);
    const result = await updateUserPassword(currentPassword, newPassword);

    if (result.error) {
      setPasswordError(result.error);
      setPasswordLoading(false);
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
    setPasswordLoading(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">Foto de perfil</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 bg-[#872075]/10 overflow-hidden">
              {avatarFile ? (
                <img
                  src={URL.createObjectURL(avatarFile)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-[#872075]">{name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="avatar" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-[#872075] cursor-pointer font-semibold text-sm text-gray-700 transition">
                <i className="fa-solid fa-upload text-xs" aria-hidden="true" />
                Cambiar foto
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0])}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-1">JPG, PNG. Máx. 2MB</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">No se puede cambiar.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+57 300 000 0000"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
            Dirección
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Cra. 53BB #10B Sur - 51"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
          />
        </div>

      <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Rol</p>
          <p className="text-gray-800 capitalize">{profile.role}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase">Estado</p>
          <p className="text-gray-800 capitalize">
            {profile.status === "approved" ? "Aprobado" : profile.status === "pending" ? "Pendiente" : "Rechazado"}
          </p>
        </div>
      </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" aria-hidden="true" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-4 py-3">
            <i className="fa-solid fa-circle-check text-green-500 text-sm" aria-hidden="true" />
            <p className="text-sm text-green-700">Perfil actualizado correctamente.</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#872075] hover:bg-[#6e1960] disabled:opacity-60 transition-colors text-white font-semibold py-2.5 text-sm"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true" />
                Guardando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk text-sm" aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </button>
          <a
            href="/admin"
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-gray-700 hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            <i className="fa-solid fa-times text-sm" aria-hidden="true" />
            Cancelar
          </a>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-8">
        <h2 className="text-lg font-extrabold text-gray-800 mb-4">Cambiar contraseña</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fa-solid ${showCurrentPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
              Contraseña nueva
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fa-solid ${showNewPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} text-sm`} aria-hidden="true" />
              </button>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm" aria-hidden="true" />
              <p className="text-sm text-red-600">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-100 px-4 py-3">
              <i className="fa-solid fa-circle-check text-green-500 text-sm" aria-hidden="true" />
              <p className="text-sm text-green-700">Contraseña actualizada correctamente.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-60 transition-colors text-white font-semibold py-2.5 text-sm"
          >
            {passwordLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true" />
                Actualizando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-key text-sm" aria-hidden="true" />
                Actualizar contraseña
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
