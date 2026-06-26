import type { Workshop } from "@/types/database";

/** Dias de trial reverso (PRO completo, sem cartão) ao criar a oficina. */
export const TRIAL_DAYS = 14;

type PlanFields = Partial<Pick<Workshop, "plan_type" | "subscription_status" | "trial_ends_at">>;

/** Trial ainda válido (trial_ends_at no futuro). */
export function isTrialActive(w?: PlanFields | null): boolean {
  if (!w?.trial_ends_at) return false;
  return new Date(w.trial_ends_at).getTime() > Date.now();
}

/**
 * Fonte ÚNICA de verdade do acesso PRO.
 * Tem acesso quem: pagou (plan_type=pro + subscription ativa) OU está no trial reverso.
 */
export function isProActive(w?: PlanFields | null): boolean {
  if (!w) return false;
  const paid = w.plan_type === "pro" && w.subscription_status === "active";
  return paid || isTrialActive(w);
}

/** Dias restantes de trial (0 se expirado/ausente). */
export function trialDaysLeft(w?: PlanFields | null): number {
  if (!w?.trial_ends_at) return 0;
  const ms = new Date(w.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}
