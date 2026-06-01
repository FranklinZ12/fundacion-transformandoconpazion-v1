import Link from "next/link";

export const metadata = { title: "Acceso Pendiente" };

export default function PendientePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center space-y-5">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
            <i className="fa-solid fa-clock text-amber-500 text-2xl" aria-hidden="true" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-800 mb-2">
            Registro en revisión
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tu solicitud de acceso está pendiente de aprobación por el Líder de la fundación.
            Una vez aprobada, podrás acceder al panel.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#872075] hover:underline"
        >
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          Volver al sitio
        </Link>
      </div>
    </div>
  );
}
