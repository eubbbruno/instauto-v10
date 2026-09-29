import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";

/**
 * Cria a conta de uma oficina JÁ PRONTA (para o Bruno onboardar leads na mão).
 * Remove toda a fricção: e-mail já confirmado, perfil + oficina + trial criados.
 * Retorna o login/senha para o admin repassar pela conversa.
 */
function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const city = String(body.city || "").trim();
    const uf = String(body.state || "").trim();
    const password = String(body.password || "").trim();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "A senha precisa ter ao menos 6 caracteres." }, { status: 400 });
    }

    const db = admin();

    // 1) Cria o usuário de auth com e-mail JÁ confirmado (sem fricção).
    const { data: created, error: authErr } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, user_type: "workshop" },
    });
    if (authErr || !created?.user) {
      return NextResponse.json({ error: authErr?.message || "Falha ao criar usuário" }, { status: 400 });
    }
    const userId = created.user.id;

    // 2) Perfil (tipo oficina).
    const { error: pErr } = await db.from("profiles").insert({
      id: userId, email, name, type: "workshop",
    });
    if (pErr) return NextResponse.json({ error: "Erro ao criar perfil: " + pErr.message }, { status: 500 });

    // 3) Oficina (com trial de PRO) + dono.
    const { data: ws, error: wErr } = await db.from("workshops").insert({
      profile_id: userId,
      name,
      phone: phone || null,
      city: city || null,
      state: uf || null,
      plan_type: "free",
      subscription_status: "trial",
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      accepts_quotes: true,
    }).select("id").single();
    if (wErr || !ws) return NextResponse.json({ error: "Erro ao criar oficina: " + wErr?.message }, { status: 500 });

    await db.from("workshop_members").insert({
      workshop_id: ws.id, profile_id: userId, role: "owner",
    });

    return NextResponse.json({ ok: true, email, password });
  } catch (error: any) {
    console.error("❌ [create-workshop-account]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
