import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

/**
 * Vincula a oficina do usuário autenticado ao afiliado do código informado.
 * Idempotente: só grava se a oficina ainda não tiver `referred_by`.
 * Chamado no 1º acesso ao dashboard quando existe um código de indicação guardado.
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== "string") {
      return NextResponse.json({ ok: false, reason: "no_code" }, { status: 200 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, reason: "no_auth" }, { status: 200 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Oficina do usuário (como dono)
    const { data: workshop } = await admin
      .from("workshops")
      .select("id, referred_by")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!workshop) return NextResponse.json({ ok: false, reason: "no_workshop" }, { status: 200 });
    if (workshop.referred_by) return NextResponse.json({ ok: true, already: true }, { status: 200 });

    // Afiliado ativo com esse código
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("id, active")
      .eq("code", code.trim())
      .maybeSingle();

    if (!affiliate || !affiliate.active) {
      return NextResponse.json({ ok: false, reason: "invalid_code" }, { status: 200 });
    }

    await admin
      .from("workshops")
      .update({ referred_by: affiliate.id, referred_at: new Date().toISOString() })
      .eq("id", workshop.id);

    return NextResponse.json({ ok: true, attributed: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [affiliate/attribute]", error);
    return NextResponse.json({ ok: false, reason: "error" }, { status: 200 });
  }
}
