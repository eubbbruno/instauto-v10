import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

/**
 * Verifica, no server, se o usuário autenticado (via cookies) é dono ou membro
 * da oficina informada. Usado para proteger as rotas de API do WhatsApp.
 */
export async function getWorkshopAccess(
  workshopId: string
): Promise<{ ok: boolean; userId?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data } = await admin
      .from("workshop_members")
      .select("id")
      .eq("workshop_id", workshopId)
      .eq("profile_id", user.id)
      .maybeSingle();

    return { ok: !!data, userId: user.id };
  } catch (e) {
    console.error("getWorkshopAccess erro:", e);
    return { ok: false };
  }
}

/** Verifica, no server, se o usuário autenticado é admin (profile.role = 'admin'). */
export async function getAdminUser(): Promise<{ ok: boolean; userId?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return { ok: data?.role === "admin", userId: user.id };
  } catch (e) {
    console.error("getAdminUser erro:", e);
    return { ok: false };
  }
}
