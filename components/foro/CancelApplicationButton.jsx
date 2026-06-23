"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelApplication } from "@/app/foro/actions";

export default function CancelApplicationButton({ applicationId }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!confirm("¿Cancelar esta postulación?")) return;
    startTransition(async () => {
      const result = await cancelApplication(applicationId);
      if (result?.error) {
        alert(result.error);
        return;
      }
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return (
      <span className="text-xs font-semibold text-gray-400">Cancelada</span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-60"
    >
      {isPending ? "Cancelando..." : "Cancelar"}
    </button>
  );
}
