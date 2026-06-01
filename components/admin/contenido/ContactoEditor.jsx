"use client";

import { useRef, useState, useTransition } from "react";
import { saveContacto } from "@/app/admin/contenido/contacto/actions";

function Field({ label, name, defaultValue, textarea, hint, type = "text" }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
      <Tag
        name={name}
        type={!textarea ? type : undefined}
        defaultValue={defaultValue ?? ""}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800
          focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20
          resize-none disabled:opacity-50"
      />
    </div>
  );
}

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1 border-b border-gray-100">
      <i className={`fa-solid ${icon} text-[#872075] text-xs`} aria-hidden="true" />
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
    </div>
  );
}

export default function ContactoEditor({ content }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const fd = new FormData(formRef.current);
        await saveContacto(fd);
        showToast("Cambios guardados correctamente");
      } catch {
        showToast("Error al guardar. Intenta de nuevo.", "error");
      }
    });
  }

  const { address = "", schedule = "", whatsapp = "", whatsapp_url = "", email = "", socials = {} } = content;

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

        {/* ── Info de contacto ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <SectionHeader icon="fa-location-dot" title="Información de contacto" />
          <Field
            label="Dirección"
            name="address"
            defaultValue={address}
            textarea
            hint="Puedes usar saltos de línea para separar ciudad y dirección"
          />
          <Field
            label="Horario de oficina"
            name="schedule"
            defaultValue={schedule}
            textarea
            hint="Ej: Lunes - Viernes\n06:00 pm – 10:00 pm"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="WhatsApp (texto visible)" name="whatsapp" defaultValue={whatsapp} />
            <Field label="URL de WhatsApp" name="whatsapp_url" defaultValue={whatsapp_url} hint="Ej: https://wa.me/573148229310" />
          </div>
          <Field label="Correo electrónico" name="email" type="email" defaultValue={email} />
        </section>

        {/* ── Redes sociales ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <SectionHeader icon="fa-share-nodes" title="Redes sociales" />
          <p className="text-xs text-gray-400">Deja en blanco las redes que no uses — no aparecerán en el sitio.</p>
          <Field label="YouTube" name="social_youtube"   defaultValue={socials.youtube}   hint="URL completa del canal" />
          <Field label="Instagram" name="social_instagram" defaultValue={socials.instagram} hint="URL completa del perfil" />
          <Field label="Facebook" name="social_facebook"  defaultValue={socials.facebook}  hint="URL completa de la página" />
          <Field label="Twitter / X" name="social_twitter"   defaultValue={socials.twitter}   hint="URL completa del perfil" />
        </section>

        {/* ── Guardar ── */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-[#872075] hover:bg-[#6d1960] disabled:opacity-60
              text-white text-sm font-semibold px-6 py-2.5 transition-colors"
          >
            {isPending
              ? <i className="fa-solid fa-circle-notch fa-spin text-xs" aria-hidden="true" />
              : <i className="fa-solid fa-floppy-disk text-xs" aria-hidden="true" />
            }
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl
          text-sm font-semibold text-white
          ${toast.type === "error" ? "bg-red-500" : "bg-green-600"}`}
        >
          <i className={`fa-solid ${toast.type === "error" ? "fa-circle-xmark" : "fa-circle-check"}`} aria-hidden="true" />
          {toast.msg}
        </div>
      )}
    </>
  );
}
