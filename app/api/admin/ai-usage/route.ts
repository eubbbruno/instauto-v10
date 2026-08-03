import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";

// Custo aproximado por chamada (gpt-4o-mini), em USD. Estimativa para dar
// visibilidade — o valor real depende do tamanho de cada mensagem.
const COST_USD = { diagnostico: 0.0012, chat: 0.0004 };
const USD_TO_BRL = 5.5;

function yearMonth(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser();
    if (!admin.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const ym = request.nextUrl.searchParams.get("month") || yearMonth();

    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: usage } = await db
      .from("ai_usage")
      .select("workshop_id, feature, count")
      .eq("year_month", ym);

    // Agrupa por oficina
    const byWorkshop = new Map<string, { diagnostico: number; chat: number }>();
    for (const u of usage || []) {
      const cur = byWorkshop.get(u.workshop_id) || { diagnostico: 0, chat: 0 };
      if (u.feature === "diagnostico") cur.diagnostico += u.count || 0;
      if (u.feature === "chat") cur.chat += u.count || 0;
      byWorkshop.set(u.workshop_id, cur);
    }

    // Nomes/planos das oficinas envolvidas
    const ids = [...byWorkshop.keys()];
    let names: Record<string, { name: string; plan: string }> = {};
    if (ids.length) {
      const { data: workshops } = await db
        .from("workshops")
        .select("id, name, plan_type")
        .in("id", ids);
      for (const w of workshops || []) {
        names[w.id] = { name: w.name || "Oficina", plan: w.plan_type || "free" };
      }
    }

    const rows = ids.map((id) => {
      const c = byWorkshop.get(id)!;
      const costUsd = c.diagnostico * COST_USD.diagnostico + c.chat * COST_USD.chat;
      return {
        workshopId: id,
        name: names[id]?.name || "Oficina",
        plan: names[id]?.plan || "free",
        diagnostico: c.diagnostico,
        chat: c.chat,
        costUsd,
        costBrl: costUsd * USD_TO_BRL,
      };
    });

    rows.sort((a, b) => b.costUsd - a.costUsd);

    const totals = rows.reduce(
      (acc, r) => {
        acc.diagnostico += r.diagnostico;
        acc.chat += r.chat;
        acc.costUsd += r.costUsd;
        acc.costBrl += r.costBrl;
        return acc;
      },
      { diagnostico: 0, chat: 0, costUsd: 0, costBrl: 0 }
    );

    return NextResponse.json({ month: ym, rows, totals });
  } catch (error: any) {
    console.error("❌ [admin/ai-usage]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
