"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const formRef = useRef(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Leer directamente del DOM para capturar valores del autocompletar del navegador
    const formData = new FormData(formRef.current);
    const email = formData.get("email")?.trim();
    const password = formData.get("password");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    // Verificar que el perfil esté aprobado
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .single();

    if (!profile || profile.status === "pending") {
      await supabase.auth.signOut();
      router.push("/admin/pendiente");
      return;
    }

    if (profile.status === "rejected") {
      await supabase.auth.signOut();
      setError("Tu solicitud de acceso fue rechazada.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1">
        <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue=""
          placeholder="tu@correo.com"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          defaultValue=""
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition"
        />
        <div className="pt-1 text-right">
          <a
            href="/auth/forgot-password"
            className="text-xs font-semibold text-[#872075] hover:underline"
          >
            Olvidé mi contraseña
          </a>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-sm shrink-0" aria-hidden="true" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6e1960] disabled:opacity-60 transition-colors text-white font-bold py-3 text-sm shadow"
      >
        {loading ? (
          <i className="fa-solid fa-circle-notch fa-spin text-sm" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-arrow-right-to-bracket text-sm" aria-hidden="true" />
        )}
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
