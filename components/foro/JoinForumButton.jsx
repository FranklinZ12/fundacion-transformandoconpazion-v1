"use client";

import { useState, useTransition } from "react";
import { requestMembership } from "@/app/foro/actions";

export default function JoinForumButton({ forumId }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("idle");

  function handleClick() {
    startTransition(async () => {
      const result = await requestMembership(forumId);
      if (result?.error) {
        setStatus("error:" + result.error);
        return;
      }
      setStatus("success");
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
        <p className="text-sm text-green-700">
          <i className="fa-solid fa-check-circle mr-1" aria-hidden="true" />
          Solicitud enviada. El coordinador debe aprobarla.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="w-full rounded-xl bg-[#872075] text-white font-bold py-2.5 text-sm hover:bg-[#6f1a60] disabled:opacity-60"
      >
        {isPending ? "Enviando..." : "Solicitar unirme al foro"}
      </button>
      {status.startsWith("error:") && (
        <p className="text-xs text-red-600">{status.replace("error:", "")}</p>
      )}
    </div>
  );
}
