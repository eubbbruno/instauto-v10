import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
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

function inWindow(referredAt: string | null, months: number): boolean {
  if (!referredAt) return true;
  const end = new Date(referredAt);
  end.setMonth(end.getMonth() + months);
  return end >= new Date();
}

/**
 * Portal do afiliado (sem login) — acesso por token secreto na URL.
 * Retorna só os números do próprio afiliado.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "token obrigatório" }, { status: 400 });

    const db = admin();
    const { data: aff } = await db
      .from("affiliates")
      .select("id, code, name, commission_percent, commission_months, active, pix_key")
      .eq("access_token", token)
      .maybeSingle();

    if (!aff) return NextResponse.json({ error: "Link inválido" }, { status: 404 });

    const { data: list } = await db
      .from("workshops")
      .select("plan_type, subscription_status, referred_at")
      .eq("referred_by", aff.id);

    const paying = (list || []).filter(
      (w) => (w.plan_type === "pro" || w.plan_type === "equipe") && w.subscription_status === "active"
    );
    const payingInWindow = paying.filter((w) => inWindow(w.referred_at, aff.commission_months));
    const monthlyCommission = payingInWindow.reduce(
      (s, w) => s + monthlyPrice(w.plan_type) * (Number(aff.commission_percent) / 100),
      0
    );

    return NextResponse.json({
      name: aff.name,
      code: aff.code,
      active: aff.active,
      percent: Number(aff.commission_percent),
      months: aff.commission_months,
      pixKey: aff.pix_key,
      link: `https://www.instauto.com.br/cadastro/oficina?ref=${encodeURIComponent(aff.code)}`,
      signups: (list || []).length,
      paying: paying.length,
      payingInWindow: payingInWindow.length,
      monthlyCommission,
    });
  } catch (error: any) {
    console.error("❌ [affiliate/me]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
