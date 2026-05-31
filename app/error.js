'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-[#c3171c]">Error</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Algo salió mal
        </h1>
        <p className="mt-4 text-base leading-7 text-gray-600">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={reset}
            className="btn bg-[#872075] hover:bg-[#6a195b] text-white border-none"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-[#872075]">
            Volver al inicio <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
