"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const redirectTo = `${window.location.origin}/auth/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );

    if (resetError) {
      setError("No fue posible enviar el correo de recuperación.");
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
            <h1 className="text-2xl font-extrabold text-gray-800">Recuperar contraseña</h1>
            <p className="text-sm text-gray-500 mt-1">
              Te enviaremos un enlace para crear una nueva contraseña.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
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
                Si el correo existe, enviamos el enlace de recuperación.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6e1960] disabled:opacity-60 transition-colors text-white font-bold py-3 text-sm shadow"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
