import { createClient } from "@supabase/supabase-js";
import { isProActive } from "@/lib/plan";

export type AiFeature = "diagnostico" | "chat";

/**
 * Cota mensal de IA por plano/feature.
 * Valores "enxutos" (decisão 2026-07): cobrem uso normal e travam abuso.
 * Bruno calibra depois vendo o uso real.
 */
const QUOTAS: Record<string, Record<AiFeature, number>> = {
  pro: { diagnostico: 30, chat: 100 },
  equipe: { diagnostico: 100, chat: 400 },
};

interface WorkshopPlan {
  plan_type?: string | null;
  subscription_status?: string | null;
  trial_ends_at?: string | null;
}

/** Plano efetivo para fins de cota: equipe > pro (pago OU trial) > free. */
function effectivePlan(w: WorkshopPlan): "equipe" | "pro" | "free" {
  if (w.plan_type === "equipe" && w.subscription_status === "active") return "equipe";
  if (isProActive(w as any)) return "pro"; // PRO pago ou trial reverso ativo
  return "free";
}

export function quotaFor(w: WorkshopPlan, feature: AiFeature): number {
  const plan = effectivePlan(w);
  return QUOTAS[plan]?.[feature] ?? 0;
}

function yearMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export interface QuotaResult {
  allowed: boolean;
  used: number;
  limit: number;
  reason?: "no_plan" | "quota_exceeded";
}

/**
 * Verifica a cota e, se permitido, INCREMENTA o uso do mês.
 * Deve ser chamada no server ANTES de disparar qualquer chamada de IA.
 */
export async function checkAndIncrementAiUsage(
  workshopId: string,
  feature: AiFeature
): Promise<QuotaResult> {
  const db = admin();

  const { data: workshop } = await db
    .from("workshops")
    .select("plan_type, subscription_status, trial_ends_at")
    .eq("id", workshopId)
    .single();

  const limit = workshop ? quotaFor(workshop, feature) : 0;
  if (limit <= 0) {
    return { allowed: false, used: 0, limit: 0, reason: "no_plan" };
  }

  const ym = yearMonth();
  const { data: usage } = await db
    .from("ai_usage")
    .select("count")
    .eq("workshop_id", workshopId)
    .eq("feature", feature)
    .eq("year_month", ym)
    .maybeSingle();

  const used = usage?.count ?? 0;
  if (used >= limit) {
    return { allowed: false, used, limit, reason: "quota_exceeded" };
  }

  await db
    .from("ai_usage")
    .upsert(
      { workshop_id: workshopId, feature, year_month: ym, count: used + 1, updated_at: new Date().toISOString() },
      { onConflict: "workshop_id,feature,year_month" }
    );

  return { allowed: true, used: used + 1, limit };
}

/** Só leitura (para exibir "X de Y usados" sem incrementar). */
export async function getAiUsage(workshopId: string, w: WorkshopPlan, feature: AiFeature) {
  const db = admin();
  const ym = yearMonth();
  const { data } = await db
    .from("ai_usage")
    .select("count")
    .eq("workshop_id", workshopId)
    .eq("feature", feature)
    .eq("year_month", ym)
    .maybeSingle();
  return { used: data?.count ?? 0, limit: quotaFor(w, feature) };
}
