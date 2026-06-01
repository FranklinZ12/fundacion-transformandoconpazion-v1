import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para uso en componentes del navegador ('use client').
 * Usa la anon key — solo lectura de datos públicos + auth del usuario actual.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
