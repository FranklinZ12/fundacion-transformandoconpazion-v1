"use client";

import { useState, useTransition } from "react";
import { createApplication, cancelApplication } from "@/app/foro/actions";

const STATUS_LABELS = {
  pending: "Pendiente",
  reviewed: "Revisada",
  contacted: "Contactado",
  cancelled: "Cancelada",
};

export default function ApplyForm({ postId, existingApplication }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const [app, setApp] = useState(existingApplication);

  function handleSubmit(form) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await createApplication(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: "Postulación enviada." });
      setApp({ status: "pending" });
      form.reset();
    });
  }

  async function handleCancel() {
    if (!confirm("¿Cancelar tu postulación?")) return;
    setMsg(null);
    startTransition(async () => {
      const result = await cancelApplication(app.id);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: "Postulación cancelada." });
      setApp({ status: "cancelled" });
    });
  }

  if (app?.status && app.status !== "cancelled") {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
        {msg && (
          <p
            className={`text-sm rounded-xl px-4 py-3 border ${
              msg.type === "ok"
                ? "text-green-700 border-green-100 bg-green-50"
                : "text-red-700 border-red-100 bg-red-50"
            }`}
          >
            {msg.text}
          </p>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <i className="fa-solid fa-file-signature text-sm" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-extrabold text-gray-800">
              Ya te postulaste a esta oferta
            </h3>
            <p className="text-xs text-gray-500">
              Estado:{" "}
              <span
                className={`font-semibold ${
                  app.status === "pending"
                    ? "text-amber-600"
                    : app.status === "reviewed"
                    ? "text-blue-600"
                    : app.status === "contacted"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {STATUS_LABELS[app.status] || app.status}
              </span>
            </p>
          </div>
        </div>
        {(app.status === "pending" || app.status === "reviewed") && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-60"
          >
            Cancelar postulación
          </button>
        )}
      </div>
    );
  }

  if (app?.status === "cancelled") {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
        {msg && (
          <p
            className={`text-sm rounded-xl px-4 py-3 border ${
              msg.type === "ok"
                ? "text-green-700 border-green-100 bg-green-50"
                : "text-red-700 border-red-100 bg-red-50"
            }`}
          >
            {msg.text}
          </p>
        )}
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
          <p className="text-sm text-amber-700">
            Has cancelado tu postulación. Podés volver a postular si querés.
          </p>
        </div>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e.currentTarget);
          }}
        >
          <input type="hidden" name="post_id" value={postId} />
          <textarea
            name="message"
            placeholder="Mensaje para el coordinador (opcional)..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
          />
          <button
            disabled={isPending}
            className="rounded-xl bg-[#872075] text-white font-bold py-2.5 px-5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
          >
            {isPending ? "Enviando..." : "Postular nuevamente"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      {msg && (
        <p
          className={`text-sm rounded-xl px-4 py-3 border mb-3 ${
            msg.type === "ok"
              ? "text-green-700 border-green-100 bg-green-50"
              : "text-red-700 border-red-100 bg-red-50"
          }`}
        >
          {msg.text}
        </p>
      )}
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e.currentTarget);
        }}
      >
        <input type="hidden" name="post_id" value={postId} />
        <textarea
          name="message"
          placeholder="Escribe un mensaje para el coordinador (opcional)..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
        />
        <button
          disabled={isPending}
          className="rounded-xl bg-[#872075] text-white font-bold py-2.5 px-5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Postular a esta oferta"}
        </button>
      </form>
    </div>
  );
}
