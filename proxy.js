import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

export async function proxy(request) {
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  // Refrescar la sesión si expiró (importante para SSR)
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname === "/admin/login" || pathname === "/admin/register";

  // Redirigir a login si accede a /admin sin sesión
  if (pathname.startsWith("/admin") && !isAuthRoute && !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Si ya tiene sesión y va a login/register, redirigir al panel
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
