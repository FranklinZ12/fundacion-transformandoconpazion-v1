import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/pendiente";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Sesión creada — cerrar sesión inmediatamente porque la cuenta queda pendiente de aprobación
      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/admin/login?confirmed=1`);
    }
  }

  // Error en el código — redirigir a login con mensaje
  return NextResponse.redirect(`${origin}/admin/login?error=confirmacion`);
}
