import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";
import { PAID_PLANS } from "@/lib/plans";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function monthlyPrice(plan: string): number {
  if (plan === "pro") return PAID_PLANS.pro.monthly;
  if (plan === "equipe") return PAID_PLANS.equipe.monthly;
  return 0;
}

/** A indicação ainda está dentro da janela de comissão (referred_at + meses)? */
function inWindow(referredAt: string | null, months: number): boolean {
  if (!referredAt) return true; // sem data (indicação antiga) → conta
  const end = new Date(referredAt);
  end.setMonth(end.getMonth() + months);
  return end >= new Date();
}

export async function GET() {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const db = admin();
    const { data: affiliates } = await db
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: refs } = await db
      .from("workshops")
      .select("id, name, plan_type, subscription_status, referred_by, referred_at")
      .not("referred_by", "is", null);

    const byAff = new Map<string, any[]>();
    for (const w of refs || []) {
      const arr = byAff.get(w.referred_by) || [];
      arr.push(w);
      byAff.set(w.referred_by, arr);
    }

    const rows = (affiliates || []).map((a) => {
      const list = byAff.get(a.id) || [];
      const paying = list.filter(
        (w) => (w.plan_type === "pro" || w.plan_type === "equipe") && w.subscription_status === "active"
      );
      const payingInWindow = paying.filter((w) => inWindow(w.referred_at, a.commission_months));
      const monthlyCommission = payingInWindow.reduce(
        (sum, w) => sum + monthlyPrice(w.plan_type) * (Number(a.commission_percent) / 100),
        0
      );
      return {
        ...a,
        signups: list.length,
        paying: paying.length,
        payingInWindow: payingInWindow.length,
        monthlyCommission,
      };
    });

    const link = (code: string) =>
      `https://www.instauto.com.br/cadastro/oficina?ref=${encodeURIComponent(code)}`;

    return NextResponse.json({ rows: rows.map((r) => ({ ...r, link: link(r.code) })) });
  } catch (error: any) {
    console.error("❌ [admin/affiliates GET]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const body = await request.json();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();
    if (!code || !name) {
      return NextResponse.json({ error: "Código e nome são obrigatórios" }, { status: 400 });
    }

    const { error } = await admin().from("affiliates").insert({
      code,
      name,
      email: body.email?.trim() || null,
      pix_key: body.pixKey?.trim() || null,
      commission_percent: Number(body.commissionPercent) || 20,
      commission_months: Number(body.commissionMonths) || 12,
      notes: body.notes?.trim() || null,
    });

    if (error) {
      const msg = error.code === "23505" ? "Já existe um afiliado com esse código." : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [admin/affiliates POST]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const patch: Record<string, any> = {};
    if ("active" in body) patch.active = !!body.active;
    if ("commissionPercent" in body) patch.commission_percent = Number(body.commissionPercent);
    if ("commissionMonths" in body) patch.commission_months = Number(body.commissionMonths);
    if ("pixKey" in body) patch.pix_key = body.pixKey?.trim() || null;
    if ("email" in body) patch.email = body.email?.trim() || null;
    if ("notes" in body) patch.notes = body.notes?.trim() || null;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
    }

    await admin().from("affiliates").update(patch).eq("id", body.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [admin/affiliates PATCH]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
