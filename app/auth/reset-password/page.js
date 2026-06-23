"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const linkError = useMemo(() => {
    if (typeof window === "undefined") return null;
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const errorCode = hashParams.get("error_code");
    if (errorCode === "otp_expired") return "El enlace expiró. Solicita uno nuevo.";
    const errorDescription = hashParams.get("error_description");
    if (errorDescription) return "El enlace es inválido. Solicita uno nuevo.";
    return null;
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError("No fue posible actualizar la contraseña. Solicita un nuevo enlace.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <a
          href="/admin/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#872075] transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          Volver al login
        </a>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-gray-800">Nueva contraseña</h1>
            <p className="text-sm text-gray-500 mt-1">
              Crea una contraseña nueva para tu cuenta.
            </p>
          </div>

          {linkError ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {linkError}
              </div>
              <a
                href="/auth/forgot-password"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#872075] hover:bg-[#6e1960] transition-colors text-white font-bold py-3 text-sm shadow"
              >
                Solicitar nuevo enlace
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Nueva contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 caracteres"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Contraseña actualizada. Ya puedes iniciar sesión.
                </div>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6e1960] disabled:opacity-60 transition-colors text-white font-bold py-3 text-sm shadow"
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
