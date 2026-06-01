"use client";

import { useState, useRef, useEffect } from "react";

// Curated icons relevant to foundations / NGOs
const ICONS = [
  { cls: "fa-solid fa-handshake-angle",    label: "Ayuda" },
  { cls: "fa-solid fa-heart",              label: "Cuidado" },
  { cls: "fa-solid fa-users",              label: "Comunidad" },
  { cls: "fa-solid fa-graduation-cap",     label: "Educación" },
  { cls: "fa-solid fa-book-open",          label: "Aprendizaje" },
  { cls: "fa-solid fa-seedling",           label: "Crecimiento" },
  { cls: "fa-solid fa-hands-holding-child",label: "Protección" },
  { cls: "fa-solid fa-people-group",       label: "Grupo" },
  { cls: "fa-solid fa-house-chimney",      label: "Hogar" },
  { cls: "fa-solid fa-earth-americas",     label: "Global" },
  { cls: "fa-solid fa-star",              label: "Excelencia" },
  { cls: "fa-solid fa-shield-heart",       label: "Seguridad" },
  { cls: "fa-solid fa-trophy",             label: "Logros" },
  { cls: "fa-solid fa-lightbulb",          label: "Innovación" },
  { cls: "fa-solid fa-puzzle-piece",       label: "Colaboración" },
  { cls: "fa-solid fa-leaf",              label: "Ambiente" },
  { cls: "fa-solid fa-music",             label: "Cultura" },
  { cls: "fa-solid fa-futbol",            label: "Deporte" },
  { cls: "fa-solid fa-palette",           label: "Arte" },
  { cls: "fa-solid fa-magnifying-glass",  label: "Diagnóstico" },
  { cls: "fa-solid fa-bullseye",          label: "Objetivos" },
  { cls: "fa-solid fa-hand-holding-heart",label: "Donaciones" },
  { cls: "fa-solid fa-child-reaching",    label: "Juventud" },
  { cls: "fa-solid fa-bicycle",           label: "Actividad" },
  { cls: "fa-solid fa-microphone-lines",  label: "Comunicación" },
  { cls: "fa-solid fa-chalkboard-user",   label: "Capacitación" },
  { cls: "fa-solid fa-peace",             label: "Paz" },
  { cls: "fa-solid fa-hands-praying",     label: "Fe" },
  { cls: "fa-solid fa-building-columns",  label: "Institución" },
  { cls: "fa-solid fa-flag",             label: "Misión" },
  { cls: "fa-solid fa-laptop",            label: "Tecnología" },
  { cls: "fa-solid fa-thumbs-up",         label: "Aprobación" },
  { cls: "fa-solid fa-calendar-days",     label: "Calendario" },
  { cls: "fa-solid fa-location-dot",      label: "Ubicación" },
  { cls: "fa-solid fa-dove",              label: "Derechos" },
  { cls: "fa-solid fa-scale-balanced",    label: "Igualdad" },
  { cls: "fa-solid fa-handshake-simple",  label: "Cooperación" },
  { cls: "fa-solid fa-people-line",       label: "Ciudadanía" },
];

export default function IconPicker({ name, defaultValue, label = "Ícono" }) {
  const [selected, setSelected] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  const selectedIcon = ICONS.find((i) => i.cls === selected);
  const filtered = search
    ? ICONS.filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : ICONS;

  // Close on click outside
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">
        {label}
      </label>

      <input type="hidden" name={name} value={selected} />

      {/* Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm
            hover:border-[#872075]/40 hover:bg-[#872075]/5 transition-colors min-w-[180px] text-left"
        >
          {selected ? (
            <>
              <i className={`${selected} text-[#872075] text-base w-5 text-center flex-shrink-0`} aria-hidden="true" />
              <span className="text-gray-700 font-medium truncate">{selectedIcon?.label ?? selected.replace(/fa-solid fa-|fa-regular fa-/g, "")}</span>
            </>
          ) : (
            <>
              <span className="text-gray-400 italic">Sin ícono</span>
            </>
          )}
          <i className={`fa-solid fa-chevron-down text-gray-400 ml-auto text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>

        {selected && (
          <button
            type="button"
            onClick={() => setSelected("")}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Quitar ícono"
          >
            <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-3 space-y-2 z-10 relative">
          <input
            type="text"
            placeholder="Buscar ícono…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs
              focus:border-[#872075] focus:outline-none focus:ring-2 focus:ring-[#872075]/20"
          />
          <div className="grid grid-cols-5 gap-1 max-h-52 overflow-y-auto pr-1">
            {filtered.map((icon) => {
              const isActive = selected === icon.cls;
              return (
                <button
                  key={icon.cls}
                  type="button"
                  onClick={() => { setSelected(icon.cls); setOpen(false); setSearch(""); }}
                  className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all
                    ${isActive
                      ? "bg-[#872075] text-white"
                      : "text-gray-600 hover:bg-[#872075]/10 hover:text-[#872075]"
                    }`}
                >
                  <i className={`${icon.cls} text-xl`} aria-hidden="true" />
                  <span className="text-[9px] leading-tight">{icon.label}</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-5 text-center text-xs text-gray-400 py-4">Sin resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
