"use client";

import { useRef, useState, useTransition } from "react";
import { saveVoluntario } from "@/app/admin/contenido/voluntario/actions";
import ImageUploader from "@/components/admin/contenido/ImageUploader";
import IconPicker from "@/components/admin/contenido/IconPicker";

function Field({ label, name, defaultValue, textarea, hint, required }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</label>
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
      <Tag
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800
          focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20 resize-none"
      />
    </div>
  );
}

function Accordion({ icon, title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const [resetKey, setResetKey] = useState(0);

  function handleCancel() {
    setResetKey((k) => k + 1);
    setOpen(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#872075]/10 flex-shrink-0">
          <i className={`fa-solid ${icon} text-[#872075] text-sm`} aria-hidden="true" />
        </div>
        <span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
        {badge && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">{badge}</span>
        )}
        <i
          className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 space-y-4">
          <div key={resetKey}>{children}</div>
          <div className="flex justify-end pt-2 border-t border-gray-50">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" />
              Cancelar edición
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VoluntarioEditor({ content }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  const {
    voluntariado_titulo = "", voluntariado_subtitulo = "", roles = [],
    donaciones_titulo = "", donaciones_subtitulo = "", tiers = [],
    impacto_titulo = "", impacto_subtitulo = "", impact_stats = [],
    cta_titulo = "", cta_subtitulo = "",
  } = content;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const fd = new FormData(formRef.current);
        await saveVoluntario(fd);
        showToast("Cambios guardados correctamente");
      } catch {
        showToast("Error al guardar. Intenta de nuevo.", "error");
      }
    });
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">

        {/* ── Voluntariado ── */}
        <Accordion icon="fa-person-running" title="Voluntariado — Títulos" defaultOpen>
          <Field label="Título principal" name="voluntariado_titulo" defaultValue={voluntariado_titulo} required />
          <Field label="Subtítulo" name="voluntariado_subtitulo" defaultValue={voluntariado_subtitulo} textarea />
        </Accordion>

        <Accordion icon="fa-id-card" title="Roles de voluntariado" badge="3 roles">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Rol {i + 1}</p>
              <ImageUploader
                name={`role_${i}_image`}
                defaultValue={roles[i]?.image}
                label="Imagen"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Título" name={`role_${i}_title`} defaultValue={roles[i]?.title} required />
                <Field label="Badge" name={`role_${i}_badge`} defaultValue={roles[i]?.badge} hint="Ej: Deporte" />
              </div>
              <Field label="Descripción" name={`role_${i}_desc`} defaultValue={roles[i]?.desc} textarea />
              <IconPicker name={`role_${i}_icon`} defaultValue={roles[i]?.icon} label="Ícono del badge" />
            </div>
          ))}
        </Accordion>

        {/* ── Donaciones ── */}
        <Accordion icon="fa-hand-holding-dollar" title="Donaciones — Títulos">
          <Field label="Título principal" name="donaciones_titulo" defaultValue={donaciones_titulo} required />
          <Field label="Subtítulo" name="donaciones_subtitulo" defaultValue={donaciones_subtitulo} textarea />
        </Accordion>

        <Accordion icon="fa-gift" title="Tiers de donación" badge="3 tiers">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Tier {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Título" name={`tier_${i}_title`} defaultValue={tiers[i]?.title} required />
                <Field label="Valor / precio" name={`tier_${i}_value`} defaultValue={tiers[i]?.value} hint='Ej: "Desde $10.000"' />
              </div>
              <Field label="Descripción" name={`tier_${i}_desc`} defaultValue={tiers[i]?.desc} textarea />
              <IconPicker name={`tier_${i}_icon`} defaultValue={tiers[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>

        {/* ── Impacto ── */}
        <Accordion icon="fa-chart-simple" title="Widget de impacto" badge="4 stats">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Título" name="impacto_titulo" defaultValue={impacto_titulo} required />
            <Field label="Subtítulo" name="impacto_subtitulo" defaultValue={impacto_subtitulo} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Stat {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor" name={`stat_${i}_value`} defaultValue={impact_stats[i]?.value} required />
                <Field label="Etiqueta" name={`stat_${i}_label`} defaultValue={impact_stats[i]?.label} required />
              </div>
              <IconPicker name={`stat_${i}_icon`} defaultValue={impact_stats[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>

        {/* ── CTA final ── */}
        <Accordion icon="fa-bullhorn" title="CTA final">
          <Field label="Título" name="cta_titulo" defaultValue={cta_titulo} required />
          <Field label="Subtítulo" name="cta_subtitulo" defaultValue={cta_subtitulo} textarea />
        </Accordion>

        <div className="flex justify-end pt-2">
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
