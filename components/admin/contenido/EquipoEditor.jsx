"use client";

import { useRef, useState, useTransition } from "react";
import { saveEquipo } from "@/app/admin/contenido/equipo/actions";
import ImageUploader from "@/components/admin/contenido/ImageUploader";

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

function MemberAccordion({ index, member }) {
  const [open, setOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  function handleCancel() {
    setResetKey((k) => k + 1);
    setOpen(false);
  }

  const displayName = member?.nombre || `Miembro ${index + 1}`;
  const displayPuesto = member?.puesto || "";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Avatar preview */}
        {member?.image ? (
          <img
            src={member.image}
            alt={displayName}
            className="w-9 h-9 rounded-full object-cover object-top flex-shrink-0 border border-gray-200"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#872075]/10 flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-user text-[#872075] text-sm" aria-hidden="true" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm truncate">{displayName}</p>
          {displayPuesto && <p className="text-xs text-gray-400 truncate">{displayPuesto}</p>}
        </div>
        <i
          className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="px-6 pb-4 pt-2 border-t border-gray-100 space-y-4">
          <div key={resetKey} className="space-y-4">
            <ImageUploader
              name={`member_${index}_image`}
              defaultValue={member?.image}
              label="Foto"
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre completo" name={`member_${index}_nombre`} defaultValue={member?.nombre} required />
              <Field label="Cargo" name={`member_${index}_puesto`} defaultValue={member?.puesto} required />
            </div>

            <Field
              label="Bio corta"
              name={`member_${index}_bio`}
              defaultValue={member?.bio}
              textarea
              hint="Se muestra en la tarjeta. Máx. 2 líneas."
            />
            <Field
              label="Bio extendida"
              name={`member_${index}_bioExtended`}
              defaultValue={member?.bioExtended}
              textarea
              hint="Se muestra en el modal al hacer clic en la tarjeta."
            />

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Redes sociales</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <i className="fa-brands fa-instagram text-gray-400 text-sm w-4 text-center" aria-hidden="true" />
                  <input
                    name={`member_${index}_instagram`}
                    defaultValue={member?.instagram ?? ""}
                    placeholder="URL Instagram"
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder:text-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <i className="fa-brands fa-facebook-f text-gray-400 text-sm w-4 text-center" aria-hidden="true" />
                  <input
                    name={`member_${index}_facebook`}
                    defaultValue={member?.facebook ?? ""}
                    placeholder="URL Facebook"
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder:text-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <i className="fa-brands fa-x-twitter text-gray-400 text-sm w-4 text-center" aria-hidden="true" />
                  <input
                    name={`member_${index}_twitter`}
                    defaultValue={member?.twitter ?? ""}
                    placeholder="URL Twitter / X"
                    className="flex-1 bg-transparent text-xs text-gray-700 focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>
            </div>
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

export default function EquipoEditor({ content }) {
  const formRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState(null);

  const { members = [] } = content;

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const fd = new FormData(formRef.current);
        await saveEquipo(fd);
        showToast("Equipo guardado correctamente");
      } catch {
        showToast("Error al guardar. Intenta de nuevo.", "error");
      }
    });
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="member_count" value={members.length} />

        {members.map((member, i) => (
          <MemberAccordion key={i} index={i} member={member} />
        ))}

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
