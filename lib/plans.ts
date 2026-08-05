export type PaidPlanId = "pro" | "equipe";
export type BillingCycle = "monthly" | "annual";

export interface PlanConfig {
  id: PaidPlanId;
  name: string;
  monthly: number; // R$/mês
  annual: number; // R$ total no ano (com desconto)
  maxSeats: number; // total de usuários (inclui o dono)
  description: string;
}

/** Planos pagos e seus preços/assentos — fonte única de verdade. */
export const PAID_PLANS: Record<PaidPlanId, PlanConfig> = {
  pro: {
    id: "pro",
    name: "PRO",
    monthly: 97,
    annual: 970, // ~2 meses grátis
    maxSeats: 1,
    description: "Gestão completa · 1 usuário",
  },
  equipe: {
    id: "equipe",
    name: "Equipe",
    monthly: 147,
    annual: 1470, // ~2 meses grátis
    maxSeats: 4,
    description: "Gestão completa · dono + 3 usuários",
  },
};

/** Preço conforme o ciclo de cobrança. */
export function priceFor(id: PaidPlanId, cycle: BillingCycle): number {
  return cycle === "annual" ? PAID_PLANS[id].annual : PAID_PLANS[id].monthly;
}

/** Economia (R$) do anual vs. 12x o mensal. */
export function annualSavings(id: PaidPlanId): number {
  return PAID_PLANS[id].monthly * 12 - PAID_PLANS[id].annual;
}

/** Recorrência do MercadoPago conforme o ciclo (anual = a cada 12 meses). */
export function recurrenceFor(cycle: BillingCycle): { frequency: number; frequencyType: "months" } {
  return cycle === "annual"
    ? { frequency: 12, frequencyType: "months" }
    : { frequency: 1, frequencyType: "months" };
}

/** Descobre o plano + ciclo a partir do valor cobrado (usado no webhook). */
export function planByAmount(
  amount: number | undefined | null
): { plan: PlanConfig; cycle: BillingCycle } | null {
  if (amount == null) return null;
  const a = Number(amount);
  for (const p of Object.values(PAID_PLANS)) {
    if (a === p.monthly) return { plan: p, cycle: "monthly" };
    if (a === p.annual) return { plan: p, cycle: "annual" };
  }
  return null;
}

export function isPaidPlan(id: string | undefined | null): id is PaidPlanId {
  return id === "pro" || id === "equipe";
}

export function isCycle(c: string | undefined | null): c is BillingCycle {
  return c === "monthly" || c === "annual";
}
