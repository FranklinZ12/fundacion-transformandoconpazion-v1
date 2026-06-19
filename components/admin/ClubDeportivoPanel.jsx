"use client";

import { useMemo, useState, useTransition } from "react";
import { hasPermission } from "@/lib/permissions";
import {
  createAthlete,
  createTraining,
  createMatch,
  upsertAthleteFinance,
} from "@/app/admin/club-deportivo/actions";

function categoryName(rowCategory) {
  if (Array.isArray(rowCategory)) return rowCategory[0]?.name || "-";
  return rowCategory?.name || "-";
}

function weekdayLabel(day) {
  const map = {
    1: "Lunes",
    2: "Martes",
    3: "Miercoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sabado",
    7: "Domingo",
  };
  return map[day] || "-";
}

export default function ClubDeportivoPanel({
  profile,
  categories,
  scopedCategoryIds,
  athletes,
  trainings,
  matches,
  financeRows,
  consultorUsers = [],
}) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const canManage = hasPermission(profile, "manage:sports");
  const isConsultor = profile.role === "consultor";

  const scopeCategories = useMemo(
    () => (categories ?? []).filter((c) => scopedCategoryIds.includes(c.id)),
    [categories, scopedCategoryIds]
  );

  const athletesInDebt = financeRows.filter((r) => r.status === "deuda").length;
  const mainAthlete = athletes?.[0] ?? null;
  const latestFinance = financeRows?.[0] ?? null;

  function submitWith(action, form, okText) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: okText });
      form.reset();
    });
  }

  if (isConsultor) {
    return (
      <ConsultorView
        profile={profile}
        athlete={mainAthlete}
        trainings={trainings}
        matches={matches}
        financeRows={financeRows}
        latestFinance={latestFinance}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Club Deportivo</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestion por categoria. Rol actual: <span className="font-semibold">{profile.role}</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Categorias visibles" value={scopeCategories.length} />
        <Card title="Deportistas" value={athletes.length} />
        <Card title="Proximos partidos" value={matches.length} />
        <Card title="En deuda" value={athletesInDebt} danger />
      </div>

      {msg && (
        <p className={`text-sm rounded-xl px-4 py-3 border ${msg.type === "ok" ? "text-green-700 border-green-100 bg-green-50" : "text-red-700 border-red-100 bg-red-50"}`}>
          {msg.text}
        </p>
      )}

      {canManage && (
        <>
          <div className="grid xl:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-800">Nuevo deportista</h2>
              <form
                className="grid sm:grid-cols-2 gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitWith(createAthlete, e.currentTarget, "Deportista creado.");
                }}
              >
                <input name="full_name" placeholder="Nombre completo" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" required />
                <select name="consultor_user_id" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2">
                  <option value="">Vincular consultor (opcional)</option>
                  {consultorUsers.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <select name="category_id" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2">
                  <option value="">Categoria</option>
                  {scopeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input name="physical_status" placeholder="Estado fisico" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <input name="height_cm" type="number" step="0.1" min="0" placeholder="Talla (cm)" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <input name="weight_kg" type="number" step="0.1" min="0" placeholder="Peso (kg)" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <button disabled={isPending} className="sm:col-span-2 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60">Guardar deportista</button>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-800">Nuevo entrenamiento</h2>
              <form
                className="grid sm:grid-cols-2 gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitWith(createTraining, e.currentTarget, "Entrenamiento registrado.");
                }}
              >
                <select name="category_id" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required>
                  <option value="">Categoria</option>
                  {scopeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="weekday" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required>
                  <option value="">Dia</option>
                  <option value="1">Lunes</option>
                  <option value="2">Martes</option>
                  <option value="3">Miercoles</option>
                  <option value="4">Jueves</option>
                  <option value="5">Viernes</option>
                  <option value="6">Sabado</option>
                  <option value="7">Domingo</option>
                </select>
                <input name="start_time" type="time" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required />
                <input name="end_time" type="time" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required />
                <input name="location" placeholder="Lugar" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" />
                <button disabled={isPending} className="sm:col-span-2 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60">Guardar entrenamiento</button>
              </form>
            </section>
          </div>

          <div className="grid xl:grid-cols-2 gap-6">
            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-800">Proximo partido</h2>
              <form
                className="grid sm:grid-cols-2 gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitWith(createMatch, e.currentTarget, "Partido registrado.");
                }}
              >
                <select name="category_id" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required>
                  <option value="">Categoria</option>
                  {scopeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input name="match_date" type="datetime-local" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required />
                <input name="opponent" placeholder="Rival" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required />
                <input name="location" placeholder="Lugar" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" />
                <button disabled={isPending} className="sm:col-span-2 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60">Guardar partido</button>
              </form>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
              <h2 className="text-lg font-extrabold text-gray-800">Estado financiero</h2>
              <form
                className="grid sm:grid-cols-2 gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitWith(upsertAthleteFinance, e.currentTarget, "Estado financiero actualizado.");
                }}
              >
                <select name="athlete_id" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" required>
                  <option value="">Deportista</option>
                  {athletes.map((a) => <option key={a.id} value={a.id}>{a.full_name}</option>)}
                </select>
                <input name="period" placeholder="Periodo (ej: 2026-06)" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required />
                <select name="status" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm" required defaultValue="paz_y_salvo">
                  <option value="paz_y_salvo">Paz y salvo</option>
                  <option value="deuda">Deuda</option>
                </select>
                <input name="balance" type="number" step="0.01" placeholder="Saldo" className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm sm:col-span-2" />
                <button disabled={isPending} className="sm:col-span-2 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60">Guardar estado</button>
              </form>
            </section>
          </div>
        </>
      )}

      <div className="grid xl:grid-cols-2 gap-6">
        <TableCard title="Deportistas" headers={["Nombre", "Categoria", "Talla", "Peso", "Estado"]}>
          {athletes.length === 0 ? (
            <EmptyRow cols={5} text="Sin deportistas." />
          ) : (
            athletes.map((a) => (
              <tr key={a.id} className="border-t border-gray-50">
                <td className="py-2.5 text-gray-700 font-semibold">{a.full_name}</td>
                <td className="py-2.5 text-gray-500">{categoryName(a.sports_categories)}</td>
                <td className="py-2.5 text-right text-gray-500">{a.height_cm ?? "-"}</td>
                <td className="py-2.5 text-right text-gray-500">{a.weight_kg ?? "-"}</td>
                <td className="py-2.5 text-gray-500">{a.physical_status || "-"}</td>
              </tr>
            ))
          )}
        </TableCard>

        <TableCard title="Entrenamientos" headers={["Categoria", "Dia", "Hora", "Lugar"]}>
          {trainings.length === 0 ? (
            <EmptyRow cols={4} text="Sin entrenamientos." />
          ) : (
            trainings.map((t) => (
              <tr key={t.id} className="border-t border-gray-50">
                <td className="py-2.5 text-gray-700">{categoryName(t.sports_categories)}</td>
                <td className="py-2.5 text-gray-500">{weekdayLabel(t.weekday)}</td>
                <td className="py-2.5 text-gray-500">{t.start_time} - {t.end_time}</td>
                <td className="py-2.5 text-gray-500">{t.location || "-"}</td>
              </tr>
            ))
          )}
        </TableCard>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <TableCard title="Proximos partidos" headers={["Categoria", "Fecha", "Rival", "Lugar"]}>
          {matches.length === 0 ? (
            <EmptyRow cols={4} text="Sin partidos proximos." />
          ) : (
            matches.map((m) => (
              <tr key={m.id} className="border-t border-gray-50">
                <td className="py-2.5 text-gray-700">{categoryName(m.sports_categories)}</td>
                <td className="py-2.5 text-gray-500">{new Date(m.match_date).toLocaleString("es-CO")}</td>
                <td className="py-2.5 text-gray-500">{m.opponent}</td>
                <td className="py-2.5 text-gray-500">{m.location || "-"}</td>
              </tr>
            ))
          )}
        </TableCard>

        <TableCard title="Paz y salvo / Deuda" headers={["Deportista", "Periodo", "Estado", "Saldo"]}>
          {financeRows.length === 0 ? (
            <EmptyRow cols={4} text="Sin estados financieros." />
          ) : (
            financeRows.map((f) => {
              const athlete = Array.isArray(f.sports_athletes) ? f.sports_athletes[0] : f.sports_athletes;
              return (
                <tr key={f.id} className="border-t border-gray-50">
                  <td className="py-2.5 text-gray-700">{athlete?.full_name || "-"}</td>
                  <td className="py-2.5 text-gray-500">{f.period}</td>
                  <td className={`py-2.5 font-semibold ${f.status === "deuda" ? "text-red-600" : "text-green-600"}`}>
                    {f.status === "deuda" ? "Deuda" : "Paz y salvo"}
                  </td>
                  <td className="py-2.5 text-right text-gray-500">{Number(f.balance || 0).toFixed(2)}</td>
                </tr>
              );
            })
          )}
        </TableCard>
      </div>
    </div>
  );
}

function ConsultorView({ profile, athlete, trainings, matches, financeRows, latestFinance }) {
  const debtCount = financeRows.filter((r) => r.status === "deuda").length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-sky-600 font-bold">Vista del consultor</p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-800">Tu panel deportivo</h1>
        <p className="mt-2 text-sm text-slate-600">
          Aqui ves solo tu informacion personal, entrenamientos de tu categoria, partidos y estado financiero.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Tu categoria" value={categoryName(athlete?.sports_categories)} />
        <Card title="Entrenamientos" value={trainings.length} />
        <Card title="Partidos proximos" value={matches.length} />
        <Card title="Periodos en deuda" value={debtCount} danger={debtCount > 0} />
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-gray-800 mb-4">Tu ficha de deportista</h2>
        {athlete ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InfoPill label="Nombre" value={athlete.full_name || "-"} />
            <InfoPill label="Categoria" value={categoryName(athlete.sports_categories)} />
            <InfoPill label="Talla" value={athlete.height_cm ? `${athlete.height_cm} cm` : "-"} />
            <InfoPill label="Peso" value={athlete.weight_kg ? `${athlete.weight_kg} kg` : "-"} />
            <InfoPill label="Estado fisico" value={athlete.physical_status || "-"} />
            <InfoPill
              label="Estado financiero actual"
              value={latestFinance?.status === "deuda" ? "En deuda" : latestFinance?.status === "paz_y_salvo" ? "Paz y salvo" : "-"}
            />
            <InfoPill
              label="Saldo"
              value={latestFinance ? Number(latestFinance.balance || 0).toFixed(2) : "-"}
            />
            <InfoPill label="Usuario" value={profile.name || "-"} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tienes ficha de deportista vinculada.</p>
        )}
      </section>

      <div className="grid xl:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-800 mb-3">Entrenamientos de tu categoria</h2>
          {trainings.length === 0 ? (
            <p className="text-sm text-gray-500">Sin entrenamientos registrados.</p>
          ) : (
            <div className="space-y-2">
              {trainings.map((t) => (
                <div key={t.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-700">{weekdayLabel(t.weekday)} · {t.start_time} - {t.end_time}</p>
                  <p className="text-xs text-slate-500">{t.location || "Lugar por definir"}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-800 mb-3">Partidos de tu categoria</h2>
          {matches.length === 0 ? (
            <p className="text-sm text-gray-500">Sin partidos proximos.</p>
          ) : (
            <div className="space-y-2">
              {matches.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <p className="text-sm font-semibold text-slate-700">{m.opponent}</p>
                  <p className="text-xs text-slate-500">{new Date(m.match_date).toLocaleString("es-CO")}</p>
                  <p className="text-xs text-slate-500">{m.location || "Lugar por definir"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <TableCard title="Historial financiero" headers={["Periodo", "Estado", "Saldo"]}>
        {financeRows.length === 0 ? (
          <EmptyRow cols={3} text="Sin estados financieros." />
        ) : (
          financeRows.map((f) => (
            <tr key={f.id} className="border-t border-gray-50">
              <td className="py-2.5 text-gray-500">{f.period}</td>
              <td className={`py-2.5 font-semibold ${f.status === "deuda" ? "text-red-600" : "text-green-600"}`}>
                {f.status === "deuda" ? "Deuda" : "Paz y salvo"}
              </td>
              <td className="py-2.5 text-right text-gray-500">{Number(f.balance || 0).toFixed(2)}</td>
            </tr>
          ))
        )}
      </TableCard>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-400 font-bold">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function Card({ title, value, danger = false }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-400 font-bold">{title}</p>
      <p className={`mt-2 text-2xl font-extrabold ${danger ? "text-red-600" : "text-[#872075]"}`}>{value}</p>
    </div>
  );
}

function TableCard({ title, headers, children }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm overflow-auto">
      <h2 className="text-lg font-extrabold text-gray-800 mb-3">{title}</h2>
      <table className="w-full text-sm">
        <thead className="text-left text-gray-400">
          <tr>
            {headers.map((h) => (
              <th key={h} className="py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </section>
  );
}

function EmptyRow({ cols, text }) {
  return (
    <tr>
      <td colSpan={cols} className="py-6 text-center text-gray-400">{text}</td>
    </tr>
  );
}
