"use client";

import { useMemo, useState, useTransition } from "react";
import {
  createServiceActivity,
  upsertSemesterRequirement,
} from "@/app/admin/servicio-social/actions";

function StatCard({ title, value, hint, color = "text-[#872075]" }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400">{title}</p>
      <p className={`mt-2 text-2xl font-extrabold ${color}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

export default function ServiceSocialPanel({
  profile,
  currentSemesterCode,
  currentSemesterRequired,
  currentProgress,
  myActivities,
  mySummary,
  totalHistoricalHours,
  semesterConfigs,
  leaderStats,
}) {
  const [isPending, startTransition] = useTransition();
  const [activityMsg, setActivityMsg] = useState(null);
  const [configMsg, setConfigMsg] = useState(null);

  const isLeader = profile.role === "leader";
  const canRegisterActivities = profile.role === "alfabetizador";

  const currentYear = new Date().getFullYear();
  const defaultDate = new Date().toISOString().split("T")[0];

  const semestersForTable = useMemo(() => {
    return [...(mySummary ?? [])].sort((a, b) => (a.semester_code < b.semester_code ? 1 : -1));
  }, [mySummary]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Servicio social</h1>
        <p className="text-sm text-gray-500 mt-1">
          Semestre actual: <span className="font-semibold">{currentSemesterCode}</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Horas acumuladas" value={Number(currentProgress.done_hours || 0).toFixed(2)} />
        <StatCard title="Meta semestre" value={Number(currentProgress.required_hours || currentSemesterRequired || 0).toFixed(2)} />
        <StatCard title="Horas faltantes" value={Number(currentProgress.missing_hours || 0).toFixed(2)} color="text-amber-600" />
        <StatCard title="Estado" value={currentProgress.status || "En progreso"} color={currentProgress.status === "Cumplido" ? "text-green-600" : "text-[#872075]"} />
      </div>

      {canRegisterActivities && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-extrabold text-gray-800">Registrar actividad</h2>
            <span className="text-xs text-gray-400">Solo fecha, actividad y horas</span>
          </div>

          <form
            className="grid md:grid-cols-4 gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setActivityMsg(null);
              const form = e.currentTarget;
              const formData = new FormData(form);
              startTransition(async () => {
                const result = await createServiceActivity(formData);
                if (result?.error) {
                  setActivityMsg({ type: "error", text: result.error });
                  return;
                }
                setActivityMsg({ type: "ok", text: "Actividad registrada." });
                form.reset();
              });
            }}
          >
            <input
              type="date"
              name="activity_date"
              defaultValue={defaultDate}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
              required
            />
            <input
              type="text"
              name="activity_name"
              placeholder="Nombre de la actividad"
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm md:col-span-2"
              required
            />
            <input
              type="number"
              name="hours"
              step="0.5"
              min="0.5"
              placeholder="Horas"
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm"
              required
            />
            <button
              type="submit"
              disabled={isPending}
              className="md:col-span-4 inline-flex items-center justify-center gap-2 rounded-xl bg-[#872075] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6f1a60] disabled:opacity-60"
            >
              <i className={`fa-solid ${isPending ? "fa-circle-notch fa-spin" : "fa-plus"}`} aria-hidden="true" />
              Guardar actividad
            </button>
          </form>

          {activityMsg && (
            <p className={`mt-3 text-sm ${activityMsg.type === "ok" ? "text-green-600" : "text-red-600"}`}>
              {activityMsg.text}
            </p>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-800 mb-4">Historial de actividades</h2>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Actividad</th>
                  <th className="py-2 text-right">Horas</th>
                </tr>
              </thead>
              <tbody>
                {myActivities.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-400">Sin actividades aún.</td>
                  </tr>
                ) : (
                  myActivities.map((item) => (
                    <tr key={item.id} className="border-t border-gray-50">
                      <td className="py-2.5 text-gray-500">{item.activity_date}</td>
                      <td className="py-2.5 text-gray-700">{item.activity_name}</td>
                      <td className="py-2.5 text-right font-semibold text-[#872075]">{Number(item.hours).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-800 mb-4">Resumen por semestre</h2>
          <p className="text-sm text-gray-500 mb-3">Total histórico: <span className="font-bold text-[#872075]">{totalHistoricalHours.toFixed(2)} horas</span></p>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="py-2">Semestre</th>
                  <th className="py-2 text-right">Hechas</th>
                  <th className="py-2 text-right">Meta</th>
                  <th className="py-2 text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {semestersForTable.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">Sin resumen aún.</td>
                  </tr>
                ) : (
                  semestersForTable.map((row) => (
                    <tr key={row.semester_id} className="border-t border-gray-50">
                      <td className="py-2.5 text-gray-700 font-semibold">{row.semester_code}</td>
                      <td className="py-2.5 text-right text-[#872075]">{Number(row.done_hours).toFixed(2)}</td>
                      <td className="py-2.5 text-right text-gray-500">{Number(row.required_hours).toFixed(2)}</td>
                      <td className={`py-2.5 text-right font-semibold ${row.status === "Cumplido" ? "text-green-600" : "text-amber-600"}`}>{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isLeader && leaderStats && (
        <>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-800 mb-4">Configuración semestral</h2>
            <form
              className="grid md:grid-cols-4 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setConfigMsg(null);
                const formData = new FormData(e.currentTarget);
                startTransition(async () => {
                  const result = await upsertSemesterRequirement(formData);
                  if (result?.error) {
                    setConfigMsg({ type: "error", text: result.error });
                    return;
                  }
                  setConfigMsg({ type: "ok", text: "Configuración guardada." });
                });
              }}
            >
              <input type="number" name="year" defaultValue={currentYear} className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm" min="2020" required />
              <select name="term" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm" defaultValue="1">
                <option value="1">Semestre 1</option>
                <option value="2">Semestre 2</option>
              </select>
              <input type="number" name="required_hours" step="0.5" min="1" placeholder="Horas requeridas" className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm" required />
              <button type="submit" disabled={isPending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#872075] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6f1a60] disabled:opacity-60">
                <i className={`fa-solid ${isPending ? "fa-circle-notch fa-spin" : "fa-save"}`} aria-hidden="true" />
                Guardar meta
              </button>
            </form>
            {configMsg && (
              <p className={`mt-3 text-sm ${configMsg.type === "ok" ? "text-green-600" : "text-red-600"}`}>{configMsg.text}</p>
            )}

            <div className="mt-5 max-h-72 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr>
                    <th className="py-2">Semestre</th>
                    <th className="py-2 text-right">Horas requeridas</th>
                  </tr>
                </thead>
                <tbody>
                  {semesterConfigs.map((s) => (
                    <tr key={s.id} className="border-t border-gray-50">
                      <td className="py-2.5 text-gray-700 font-semibold">{s.code}</td>
                      <td className="py-2.5 text-right text-[#872075] font-bold">{Number(s.required_hours).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Alfabetizadores" value={leaderStats.totalAlfabetizadores} />
            <StatCard title="Cumplen meta" value={leaderStats.usersCumplen} color="text-green-600" />
            <StatCard title="Pendientes" value={leaderStats.usersPendientes} color="text-amber-600" />
            <StatCard title="Semestre actual" value={currentSemesterCode} color="text-gray-700" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-800 mb-4">Horas registradas por semestre</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr>
                    <th className="py-2">Semestre</th>
                    <th className="py-2 text-right">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderStats.bySemester.length === 0 ? (
                    <tr><td colSpan={2} className="py-6 text-center text-gray-400">Sin datos.</td></tr>
                  ) : (
                    leaderStats.bySemester.map((row) => (
                      <tr key={row.semester} className="border-t border-gray-50">
                        <td className="py-2.5 text-gray-700 font-semibold">{row.semester}</td>
                        <td className="py-2.5 text-right text-[#872075] font-bold">{row.hours.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-gray-800 mb-4">Ranking histórico de horas</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-400">
                  <tr>
                    <th className="py-2">Usuario</th>
                    <th className="py-2 text-right">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderStats.ranking.length === 0 ? (
                    <tr><td colSpan={2} className="py-6 text-center text-gray-400">Sin datos.</td></tr>
                  ) : (
                    leaderStats.ranking.map((row, index) => (
                      <tr key={`${row.name}-${index}`} className="border-t border-gray-50">
                        <td className="py-2.5 text-gray-700">{index + 1}. {row.name}</td>
                        <td className="py-2.5 text-right text-[#872075] font-bold">{row.hours.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
