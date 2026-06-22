"use client";

import { useState, useTransition } from "react";
import { createComment } from "@/app/foro/actions";

export default function CommentForm({ postId }) {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState(null);

  function handleSubmit(form) {
    setMsg(null);
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await createComment(formData);
      if (result?.error) {
        setMsg({ type: "error", text: result.error });
        return;
      }
      form.reset();
      setMsg({ type: "ok", text: "Comentario publicado." });
    });
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
          name="content"
          placeholder="Escribe tu comentario..."
          rows={3}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#872075]/50"
          required
        />
        <button
          disabled={isPending}
          className="rounded-xl bg-[#872075] text-white font-bold py-2.5 px-5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
        >
          {isPending ? "Publicando..." : "Comentar"}
        </button>
      </form>
    </div>
  );
}
