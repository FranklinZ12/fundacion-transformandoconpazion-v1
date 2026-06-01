"use client";
import { useState } from "react";
import { procesosData as staticProcesosData } from "@/lib/procesos";
import ProcessCard from "./ProcessCard";

const CATEGORIES = ["Todos", "Deporte", "Emprendimiento", "Social", "Ambiente", "Cultura"];

const categoryIcons = {
  Todos:         "fa-solid fa-grip",
  Deporte:       "fa-solid fa-futbol",
  Emprendimiento:"fa-solid fa-lightbulb",
  Social:        "fa-solid fa-people-group",
  Ambiente:      "fa-solid fa-leaf",
  Cultura:       "fa-solid fa-microphone",
};

export default function ProcessGrid({ processes }) {
  const [active, setActive] = useState("Todos");

  // Accept CMS processes (array of { card_image, nombre, categoria, card_descripcion, slug })
  // or fall back to static procesosData
  const allProcesses = processes
    ? processes.map((p) => ({
        image:       p.card_image,
        nombre:      p.nombre,
        categoria:   p.categoria,
        descripcion: p.card_descripcion,
        link:        p.slug,
      }))
    : staticProcesosData;

  const filtered = active === "Todos"
    ? allProcesses
    : allProcesses.filter((p) => p.categoria === active);

  return (
    <div className="w-full">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10" role="tablist" aria-label="Filtrar por categoría">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
              active === cat
                ? "bg-[#872075] text-white shadow-md shadow-[#872075]/30"
                : "bg-white text-gray-600 hover:text-[#872075] hover:bg-[#872075]/8 border border-gray-200"
            }`}
          >
            <i className={`${categoryIcons[cat]} text-xs`} aria-hidden="true" />
            {cat}
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              active === cat ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {cat === "Todos" ? allProcesses.length : allProcesses.filter(p => p.categoria === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((proceso, i) => (
          <ProcessCard
            key={proceso.image}
            image={proceso.image}
            nombre={proceso.nombre}
            descripcion={proceso.descripcion}
            link={proceso.link}
            categoria={proceso.categoria}
            priority={i === 0}
          />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <i className="fa-solid fa-folder-open text-4xl mb-4 block" aria-hidden="true" />
          <p className="text-sm">No hay procesos en esta categoría aún.</p>
        </div>
      )}
    </div>
  );
}
