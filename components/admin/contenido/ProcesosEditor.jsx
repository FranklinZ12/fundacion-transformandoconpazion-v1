"use client";

import { useTransition, useState } from "react";
import ImageUploader from "@/components/admin/contenido/ImageUploader";
import IconPicker from "@/components/admin/contenido/IconPicker";
import { saveUnProceso } from "@/app/admin/contenido/procesos/actions";

const TABS = [
  { id: "tarjeta",    label: "Tarjeta",    icon: "fa-id-card" },
  { id: "encabezado", label: "Encabezado", icon: "fa-heading" },
  { id: "hero",       label: "Hero",       icon: "fa-image" },
  { id: "pills",      label: "Etiquetas",  icon: "fa-tags" },
  { id: "servicios",  label: "Servicios",  icon: "fa-list-check" },
];

const CATEGORIES = ["Social", "Deporte", "Emprendimiento", "Ambiente", "Cultura"];

const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#872075]/30 bg-white";
const LABEL_CLS = "block text-xs font-semibold text-gray-600 mb-1";
const SUBLABEL_CLS = "block text-[11px] font-semibold text-gray-500 mb-1";

/* ── Tab: Tarjeta ────────────────────────────────────────────────────────────── */
function TarjetaTab({ data }) {
  return (
    <div className="space-y-5">
      <div>
        <label className={LABEL_CLS}>Imagen de portada</label>
        <ImageUploader name="card_image" defaultValue={data.card_image ?? ""} folder="procesos" bucket="site-images" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL_CLS}>Nombre del proceso</label>
          <input type="text" name="nombre" defaultValue={data.nombre ?? ""} className={INPUT_CLS} />
        </div>
        <div>
          <label className={LABEL_CLS}>Categoria</label>
          <select name="categoria" defaultValue={data.categoria ?? "Social"} className={INPUT_CLS}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={LABEL_CLS}>Descripcion corta (visible en la tarjeta)</label>
        <textarea
          name="card_descripcion"
          defaultValue={data.card_descripcion ?? ""}
          rows={3}
          className={INPUT_CLS + " resize-none"}
        />
      </div>
    </div>
  );
}

/* ── Tab: Encabezado ─────────────────────────────────────────────────────────── */
function EncabezadoTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>Banner curvo que aparece en la parte superior de la pagina del proceso.</span>
      </div>
      <div>
        <label className={LABEL_CLS}>Titulo</label>
        <input type="text" name="header_title" defaultValue={data.header_title ?? ""} className={INPUT_CLS} />
      </div>
      <div>
        <label className={LABEL_CLS}>Subtitulo</label>
        <input type="text" name="header_subtitle" defaultValue={data.header_subtitle ?? ""} className={INPUT_CLS} />
      </div>
    </div>
  );
}

/* ── Tab: Hero ───────────────────────────────────────────────────────────────── */
function HeroTab({ data }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>
          Layout: <strong>{data.hero_layout === "logo" ? "Logo + descripcion" : "Foto de portada + descripcion"}</strong>.
          Este valor es fijo por proceso.
        </span>
      </div>
      <div>
        <label className={LABEL_CLS}>{data.hero_layout === "logo" ? "Logo del proceso" : "Foto principal"}</label>
        <ImageUploader name="hero_image" defaultValue={data.hero_image ?? ""} folder="procesos" bucket="site-images" />
      </div>
      <div>
        <label className={LABEL_CLS}>Descripcion</label>
        <textarea
          name="hero_descripcion"
          defaultValue={data.hero_descripcion ?? ""}
          rows={5}
          className={INPUT_CLS + " resize-none"}
        />
      </div>
    </div>
  );
}

/* ── Tab: Pills ──────────────────────────────────────────────────────────────── */
function PillsTab({ data }) {
  const pills = data.pills ?? [];
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>Etiquetas que aparecen debajo de la descripcion del hero. Deja el texto vacio para omitir una etiqueta.</span>
      </div>
      {Array.from({ length: 6 }).map((_, pi) => {
        const pill = pills[pi] ?? {};
        return (
          <div key={pi} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <span className="text-[11px] font-bold text-gray-400 w-4 shrink-0">{pi + 1}</span>
            <div className="shrink-0">
              <IconPicker name={"pill_" + pi + "_icon"} defaultValue={pill.icon ?? ""} />
            </div>
            <input
              type="text"
              name={"pill_" + pi + "_label"}
              defaultValue={pill.label ?? ""}
              placeholder="ej. Deporte comunitario"
              className={INPUT_CLS}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ── Tab: Servicios ──────────────────────────────────────────────────────────── */
function ServiciosTab({ data }) {
  const items = data.items ?? [];
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
        <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
        <span>Servicios o iniciativas del proceso. Deja el titulo vacio para omitir un item.</span>
      </div>
      {Array.from({ length: 4 }).map((_, ii) => {
        const item = items[ii] ?? {};
        return (
          <div key={ii} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Servicio {ii + 1}</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={SUBLABEL_CLS}>Icono</label>
                  <IconPicker name={"item_" + ii + "_icon"} defaultValue={item.icon ?? ""} />
                </div>
                <div>
                  <label className={SUBLABEL_CLS}>Titulo</label>
                  <input type="text" name={"item_" + ii + "_titulo"} defaultValue={item.titulo ?? ""} className={INPUT_CLS} />
                </div>
              </div>
              <div>
                <label className={SUBLABEL_CLS}>Descripcion</label>
                <textarea name={"item_" + ii + "_descripcion"} defaultValue={item.descripcion ?? ""} rows={2} className={INPUT_CLS + " resize-none"} />
              </div>
              <div>
                <label className={SUBLABEL_CLS}>Imagen (opcional)</label>
                <ImageUploader name={"item_" + ii + "_image"} defaultValue={item.image ?? ""} folder="procesos" bucket="site-images" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main editor ─────────────────────────────────────────────────────────────── */
export default function ProcesosEditor({ content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab]     = useState("tarjeta");
  const [pending, startTransition]    = useTransition();
  const [toastMsg, setToastMsg]       = useState(null);

  const processes = content?.processes ?? [];
  const current   = processes[activeIndex] ?? {};

  function showToast(msg, type) {
    setToastMsg({ msg, type: type || "success" });
    setTimeout(() => setToastMsg(null), 3500);
  }

  function selectProcess(i) {
    setActiveIndex(i);
    setActiveTab("tarjeta");
  }

  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const pills = Array.from({ length: 6 }, function(_, pi) {
      return { icon: fd.get("pill_" + pi + "_icon") || "", label: fd.get("pill_" + pi + "_label") || "" };
    }).filter(function(p) { return p.label.trim(); });

    const items = Array.from({ length: 4 }, function(_, ii) {
      return {
        image:       fd.get("item_" + ii + "_image") || null,
        icon:        fd.get("item_" + ii + "_icon") || "",
        titulo:      fd.get("item_" + ii + "_titulo") || "",
        descripcion: fd.get("item_" + ii + "_descripcion") || "",
      };
    }).filter(function(it) { return it.titulo.trim(); });

    const processData = {
      slug:             current.slug             || "",
      nombre:           fd.get("nombre")         || current.nombre         || "",
      categoria:        fd.get("categoria")       || current.categoria      || "Social",
      card_image:       fd.get("card_image")      || current.card_image     || "",
      card_descripcion: fd.get("card_descripcion")|| "",
      header_title:     fd.get("header_title")    || "",
      header_subtitle:  fd.get("header_subtitle") || "",
      hero_layout:      current.hero_layout       || "logo",
      hero_image:       fd.get("hero_image")      || current.hero_image     || "",
      hero_descripcion: fd.get("hero_descripcion")|| "",
      pills: pills,
      items: items,
    };

    startTransition(async function() {
      const result = await saveUnProceso(current.slug, processData);
      if (result && result.error) showToast(result.error, "error");
      else showToast('"' + current.nombre + '" guardado correctamente');
    });
  }

  if (processes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-gray-400">
        No se encontraron procesos.
      </div>
    );
  }

  return (
    <>
      <div className="flex border border-gray-200 rounded-2xl overflow-hidden" style={{ minHeight: 640 }}>

        <aside className="w-52 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{processes.length} procesos</p>
          </div>
          {processes.map(function(p, i) {
            const isActive = i === activeIndex;
            return (
              <button
                key={p.slug || i}
                type="button"
                onClick={function() { selectProcess(i); }}
                className={"text-left px-4 py-3 border-b border-gray-100 transition-colors flex flex-col gap-0.5 border-l-[3px] " + (isActive ? "bg-white border-l-[#872075]" : "hover:bg-white border-l-transparent")}
              >
                <span className={"text-sm leading-tight truncate " + (isActive ? "font-semibold text-[#872075]" : "font-medium text-gray-700")}>
                  {p.nombre || ("Proceso " + (i + 1))}
                </span>
                <span className="text-[11px] text-gray-400">{p.categoria}</span>
              </button>
            );
          })}
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-gray-900">{current.nombre}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{current.categoria}<span className="mx-1.5">·</span><span className="font-mono">{current.slug}</span></p>
          </div>

          <div className="flex border-b border-gray-200 bg-white px-2 gap-0.5 overflow-x-auto">
            {TABS.map(function(tab) {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={function() { setActiveTab(tab.id); }}
                  className={"flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap " + (isActive ? "border-[#872075] text-[#872075]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300")}
                >
                  <i className={"fa-solid " + tab.icon + " text-[10px]"} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form key={activeIndex} onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className={activeTab === "tarjeta"    ? "" : "hidden"}><TarjetaTab    data={current} /></div>
              <div className={activeTab === "encabezado" ? "" : "hidden"}><EncabezadoTab data={current} /></div>
              <div className={activeTab === "hero"       ? "" : "hidden"}><HeroTab       data={current} /></div>
              <div className={activeTab === "pills"      ? "" : "hidden"}><PillsTab      data={current} /></div>
              <div className={activeTab === "servicios"  ? "" : "hidden"}><ServiciosTab  data={current} /></div>
            </div>
            <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                <i className="fa-solid fa-circle-info mr-1" aria-hidden="true" />
                Solo se guarda <strong>{current.nombre}</strong>
              </p>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#872075] text-white text-sm font-semibold hover:bg-[#6b1a5c] transition-colors disabled:opacity-60"
              >
                {pending
                  ? <><i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden="true" /> Guardando...</>
                  : <><i className="fa-solid fa-floppy-disk text-xs" aria-hidden="true" /> Guardar proceso</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      {toastMsg && (
        <div className={"fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg " + (toastMsg.type === "error" ? "bg-red-500" : "bg-green-600")}>
          <i className={"fa-solid " + (toastMsg.type === "error" ? "fa-circle-xmark" : "fa-circle-check")} aria-hidden="true" />
          {toastMsg.msg}
        </div>
      )}
    </>
  );
}

