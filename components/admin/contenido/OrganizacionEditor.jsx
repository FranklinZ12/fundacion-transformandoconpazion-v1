"use client";

import { useRef, useState, useTransition } from "react";
import { saveOrganizacion } from "@/app/admin/contenido/organizacion/actions";
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
        rows={textarea ? 4 : undefined}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800
          focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20 resize-none disabled:opacity-50"
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
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
            {badge}
          </span>
        )}
        <i
          className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 space-y-4">
          <div key={resetKey}>
            {children}
          </div>
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

export default function OrganizacionEditor({ content }) {
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
        await saveOrganizacion(fd);
        showToast("Cambios guardados correctamente");
      } catch {
        showToast("Error al guardar. Intenta de nuevo.", "error");
      }
    });
  }

  const { quienes_somos = "", resena = [], stats = [], pilares = [], timeline = [], principios = [], valores = [] } = content;

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

      <>
        {/* ── Quiénes somos ── */}
        <Accordion icon="fa-users" title="¿Quiénes somos?" defaultOpen>
          <Field label="Texto" name="quienes_somos" defaultValue={quienes_somos} textarea required />
        </Accordion>

        {/* ── Stats ── */}
        <Accordion icon="fa-chart-simple" title="Datos destacados" badge="4 ítems">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Dato {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Valor" name={`stat_${i}_value`} defaultValue={stats[i]?.value} required />
                <Field label="Etiqueta" name={`stat_${i}_label`} defaultValue={stats[i]?.label} required />
              </div>
              <IconPicker name={`stat_${i}_icon`} defaultValue={stats[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>

        {/* ── Pilares ── */}
        <Accordion icon="fa-layer-group" title="Pilares de la fundación" badge="4 ítems">
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-bold text-gray-400">Pilar {i + 1}</p>
                <Field label="Etiqueta" name={`pilar_${i}_label`} defaultValue={pilares[i]?.label} required />
                <IconPicker name={`pilar_${i}_icon`} defaultValue={pilares[i]?.icon} label="Ícono" />
              </div>
            ))}
          </div>
        </Accordion>

        {/* ── Reseña histórica ── */}
        <Accordion icon="fa-clock-rotate-left" title="Reseña histórica" badge="4 párrafos">
          <p className="text-[11px] text-gray-400">Cada campo es un párrafo independiente.</p>
          {[0, 1, 2, 3].map((i) => (
            <Field key={i} label={`Párrafo ${i + 1}`} name={`resena_${i}`} defaultValue={resena[i]} textarea />
          ))}
        </Accordion>

        {/* ── Timeline ── */}
        <Accordion icon="fa-timeline" title="Línea de tiempo" badge="4 hitos">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Hito {i + 1}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Año" name={`timeline_${i}_year`} defaultValue={timeline[i]?.year} required />
                <Field label="Título" name={`timeline_${i}_title`} defaultValue={timeline[i]?.title} required />
              </div>
              <Field label="Descripción" name={`timeline_${i}_desc`} defaultValue={timeline[i]?.desc} textarea />
              <IconPicker name={`timeline_${i}_icon`} defaultValue={timeline[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>

        {/* ── Principios ── */}
        <Accordion icon="fa-star" title="Principios corporativos" badge="4 ítems">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Principio {i + 1}</p>
              <Field label="Título" name={`principio_${i}_title`} defaultValue={principios[i]?.title} required />
              <Field label="Descripción" name={`principio_${i}_text`} defaultValue={principios[i]?.text} textarea required />
              <IconPicker name={`principio_${i}_icon`} defaultValue={principios[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>

        {/* ── Valores ── */}
        <Accordion icon="fa-heart" title="Valores" badge="4 ítems">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <p className="text-xs font-bold text-gray-400">Valor {i + 1}</p>
              <Field label="Título" name={`valor_${i}_title`} defaultValue={valores[i]?.title} required />
              <Field label="Descripción" name={`valor_${i}_text`} defaultValue={valores[i]?.text} textarea required />
              <IconPicker name={`valor_${i}_icon`} defaultValue={valores[i]?.icon} label="Ícono" />
            </div>
          ))}
        </Accordion>
      </>

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
