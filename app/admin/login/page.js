import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const emailConfirmed = params?.confirmed === "1";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">

        {/* Volver al sitio */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#872075] transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          Volver al sitio
        </a>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#872075] mb-4">
            <i className="fa-solid fa-lock text-white text-xl" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Panel Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Fundación Transformando Con Pazión</p>
        </div>

        {emailConfirmed && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3">
            <i className="fa-solid fa-circle-check text-green-500 text-sm shrink-0" aria-hidden="true" />
            <p className="text-sm text-green-700">Correo confirmado. Ya puedes iniciar sesión.</p>
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <LoginForm />
        </div>

        <p className="text-center text-xs text-gray-400">
          ¿No tienes acceso?{" "}
          <a href="/admin/register" className="text-[#872075] font-semibold hover:underline">
            Solicitar acceso
          </a>
        </p>
      </div>
    </div>
  );
}
