"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", reason: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    // Crear cuenta en Supabase Auth (el trigger crea el perfil automáticamente)
    const { error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: { name: form.name.trim(), reason: form.reason.trim() },
      },
    });

    if (authError) {
      const message = authError.message?.toLowerCase?.() ?? "";
      if (message.includes("already registered") || message.includes("already been registered")) {
        setError("Este correo ya está registrado.");
      } else if (message.includes("database error") || message.includes("saving new user")) {
        setError("Error de base de datos al crear usuario. Revisa el trigger de profiles en Supabase.");
      } else {
        setError(authError.message || "Error al crear la cuenta. Intenta de nuevo.");
      }
      setLoading(false);
      return;
    }

    // Cerrar sesión inmediatamente — la cuenta queda pendiente
    await supabase.auth.signOut();
    router.push("/admin/pendiente");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field
        id="name" name="name" label="Nombre completo"
        type="text" placeholder="Tu nombre" value={form.name}
        onChange={handleChange} required autoComplete="name"
      />
      <Field
        id="email" name="email" label="Correo electrónico"
        type="email" placeholder="tu@correo.com" value={form.email}
        onChange={handleChange} required autoComplete="email"
      />
      <Field
        id="password" name="password" label="Contraseña"
        type="password" placeholder="Mínimo 8 caracteres" value={form.password}
        onChange={handleChange} required autoComplete="new-password"
      />
      <Field
        id="confirm" name="confirm" label="Confirmar contraseña"
        type="password" placeholder="Repite la contraseña" value={form.confirm}
        onChange={handleChange} required autoComplete="new-password"
      />

      <div className="space-y-1">
        <label htmlFor="reason" className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
          ¿Por qué necesitas acceso? <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="reason" name="reason"
          value={form.reason}
          onChange={handleChange}
          rows={3}
          placeholder="Ej: Soy coordinador del proceso Jovemp y necesito actualizar información..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition resize-none"
        />
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
          <i className="fa-solid fa-paper-plane text-sm" aria-hidden="true" />
        )}
        {loading ? "Enviando solicitud..." : "Enviar solicitud"}
      </button>
    </form>
  );
}

function Field({ id, name, label, type, placeholder, value, onChange, required, autoComplete }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        placeholder={placeholder} value={value}
        onChange={onChange} required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#872075] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#872075]/20 transition"
      />
    </div>
  );
}
