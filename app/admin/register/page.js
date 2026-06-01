import RegisterForm from "@/components/admin/RegisterForm";

export const metadata = { title: "Solicitar acceso" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#872075] mb-4">
            <i className="fa-solid fa-user-plus text-white text-xl" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Solicitar acceso</h1>
          <p className="text-sm text-gray-500 mt-1">
            El Líder revisará tu solicitud y te asignará permisos.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <RegisterForm />
        </div>

        <p className="text-center text-xs text-gray-400">
          ¿Ya tienes acceso?{" "}
          <a href="/admin/login" className="text-[#872075] font-semibold hover:underline">
            Iniciar sesión
          </a>
        </p>
      </div>
    </div>
  );
}
