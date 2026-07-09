import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase para leitura pública em Server Components (SEO).
 * Usa a anon key, sem cookies/sessão — só lê dados públicos (workshops is_public).
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
