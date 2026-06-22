"use client";

import { useState, useTransition } from "react";
import { createPost } from "@/app/foro/actions";

export default function NewPostForm({ forumId, slug }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(form) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await createPost(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      setMsg({ type: "ok", text: "Post publicado." });
      form.reset();
      setIsOpen(false);
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-[#872075]/30 bg-white text-[#872075] font-bold py-4 text-sm hover:bg-[#872075]/5 transition-colors"
      >
        <i className="fa-solid fa-plus mr-2" aria-hidden="true" />
        Nuevo post
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
      <h3 className="text-base font-extrabold text-gray-900">Nuevo post</h3>
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
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e.currentTarget);
        }}
      >
        <input type="hidden" name="forum_id" value={forumId} />
        <input
          name="title"
          placeholder="Título"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
          required
        />
        <textarea
          name="content"
          placeholder="Contenido"
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
        />
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            name="type"
            defaultValue="general"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
          >
            <option value="general">General</option>
            <option value="anuncio">Anuncio</option>
            <option value="debate">Debate</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white">
            <input type="checkbox" name="is_pinned" value="true" />
            Fijar al inicio
          </label>
        </div>
        <div className="flex gap-3">
          <button
            disabled={isPending}
            className="flex-1 rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
          >
            Publicar
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
