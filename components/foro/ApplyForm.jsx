"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  function handleSubmit(form) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await createApplication(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error, profileIncomplete: result.profileIncomplete });
        return;
      }
      setMsg({ type: "ok", text: "Postulación enviada." });
      setApp(result.application || { status: "pending" });
      form.reset();
    });
  }

  async function handleCancel() {
    setShowCancelConfirm(false);
    setMsg(null);
    startTransition(async () => {
      const result = await cancelApplication(app.id);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: "Postulación cancelada." });
      setApp({ ...app, status: "cancelled" });
    });
  }

  if (app?.status) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-3">
        {msg && (
          msg.profileIncomplete ? (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <div className="flex items-start gap-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm text-amber-700 font-medium mb-1">{msg.text}</p>
                  <Link
                    href="/admin/profile"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#872075] hover:underline"
                  >
                    <i className="fa-solid fa-user-pen text-xs" aria-hidden="true" />
                    Editar perfil
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p
              className={`text-sm rounded-xl px-4 py-3 border ${
                msg.type === "ok"
                  ? "text-green-700 border-green-100 bg-green-50"
                  : "text-red-700 border-red-100 bg-red-50"
              }`}
            >
              {msg.text}
            </p>
          )
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
          <div className="pt-1">
            {showCancelConfirm ? (
              <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-sm text-red-700 font-medium">¿Cancelar tu postulación?</p>
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={handleCancel}
                    disabled={isPending}
                    className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-60"
                  >
                    {isPending ? "Cancelando..." : "Sí, cancelar"}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    No
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Cancelar postulación
              </button>
            )}
          </div>
        )}
        {app.status === "cancelled" && (
          <div className="pt-1">
            <button
              onClick={async () => {
                setMsg(null);
                const formData = new FormData();
                formData.append("post_id", postId);
                startTransition(async () => {
                  const result = await createApplication(formData);
                  if (result?.error) {
                    setMsg({ type: "error", text: result.error, profileIncomplete: result.profileIncomplete });
                    return;
                  }
                  setMsg({ type: "ok", text: "Postulación reenviada." });
                  setApp(result.application || { ...app, status: "pending" });
                });
              }}
              disabled={isPending}
              className="text-sm font-semibold text-[#872075] hover:underline disabled:opacity-60"
            >
              {isPending ? "Enviando..." : "Volver a postular"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
      {msg && (
        msg.profileIncomplete ? (
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm text-amber-700 font-medium mb-1">{msg.text}</p>
                <Link
                  href="/admin/profile"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#872075] hover:underline"
                >
                  <i className="fa-solid fa-user-pen text-xs" aria-hidden="true" />
                  Editar perfil
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p
            className={`text-sm rounded-xl px-4 py-3 border mb-3 ${
              msg.type === "ok"
                ? "text-green-700 border-green-100 bg-green-50"
                : "text-red-700 border-red-100 bg-red-50"
            }`}
          >
            {msg.text}
          </p>
        )
      )}
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e.currentTarget);
        }}
      >
        <input type="hidden" name="post_id" value={postId} />
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
