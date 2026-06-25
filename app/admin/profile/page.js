import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/admin/ProfileForm";

export const metadata = { title: "Editar perfil" };

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, status, avatar_url, phone_number, address")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <a href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#872075] transition-colors mb-4">
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
          Volver
        </a>
        <h1 className="text-3xl font-extrabold text-gray-800">Editar perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <ProfileForm profile={profile} user={user} />
      </div>
    </div>
  );
}
