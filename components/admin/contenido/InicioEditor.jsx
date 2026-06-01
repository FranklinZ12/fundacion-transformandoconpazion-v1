"use client";

import { useRef, useState, useTransition } from "react";
import { saveInicio } from "@/app/admin/contenido/inicio/actions";
import ImageUploader from "@/components/admin/contenido/ImageUploader";
import IconPicker from "@/components/admin/contenido/IconPicker";

// ── Reutilizables ─────────────────────────────────────────────────────────────
function Field({ label, name, defaultValue, textarea, hint, required }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
      <Tag
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={textarea ? 4 : undefined}
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

// ── Componente principal ───────────────────────────────────────────────────────
export default function InicioEditor({ content }) {
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
        await saveInicio(fd);
        showToast("Cambios guardados correctamente");
      } catch {
        showToast("Error al guardar. Intenta de nuevo.", "error");
      }
    });
  }

  const { hero = {}, stats = [], mision = "", vision = "", objectives = [] } = content;

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

        {/* ── Hero ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <SectionHeader icon="fa-star" title="Hero principal" />
          <Field label="Badge" name="hero_badge" defaultValue={hero.badge} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Título línea 1" name="hero_title_line1" defaultValue={hero.title_line1} required />
            <Field label="Título línea 2" name="hero_title_line2" defaultValue={hero.title_line2} required hint="La última palabra se resalta en rosa" />
          </div>
          <Field label="Subtítulo" name="hero_subtitle" defaultValue={hero.subtitle} textarea />
          <ImageUploader name="hero_image" defaultValue={hero.image} label="Imagen principal" />
        </section>

        {/* ── Stats ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <SectionHeader icon="fa-chart-simple" title="Estadísticas" />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2">
                <Field label={`#${i + 1} Número`} name={`stat_${i}_number`} defaultValue={stats[i]?.number} required />
                <Field label="Etiqueta" name={`stat_${i}_label`} defaultValue={stats[i]?.label} required />
              </div>
            ))}
          </div>
        </section>

        {/* ── Misión y Visión ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <SectionHeader icon="fa-bullseye" title="Misión y Visión" />
          <Field label="Misión" name="mision" defaultValue={mision} textarea required />
          <Field label="Visión" name="vision" defaultValue={vision} textarea required />
        </section>

        {/* ── Objetivos ── */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <SectionHeader icon="fa-list-check" title="Objetivos" />
          {[0, 1].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Objetivo {i + 1}</p>
              <IconPicker name={`obj_${i}_icon`} defaultValue={objectives[i]?.icon} label="Ícono" />
              <Field label="Título" name={`obj_${i}_title`} defaultValue={objectives[i]?.title} required />
              <Field label="Descripción" name={`obj_${i}_text`} defaultValue={objectives[i]?.text} textarea required />
            </div>
          ))}
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
