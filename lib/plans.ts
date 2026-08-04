export type PaidPlanId = "pro" | "equipe";

export interface PlanConfig {
  id: PaidPlanId;
  name: string;
  price: number; // R$/mês
  maxSeats: number; // total de usuários (inclui o dono)
  description: string;
}

/** Planos pagos e seus preços/assentos — fonte única de verdade. */
export const PAID_PLANS: Record<PaidPlanId, PlanConfig> = {
  pro: {
    id: "pro",
    name: "PRO",
    price: 97,
    maxSeats: 1,
    description: "Gestão completa · 1 usuário",
  },
  equipe: {
    id: "equipe",
    name: "Equipe",
    price: 147,
    maxSeats: 4,
    description: "Gestão completa · dono + 3 usuários",
  },
};

/** Descobre o plano a partir do valor cobrado (usado no webhook). */
export function planByAmount(amount: number | undefined | null): PlanConfig | null {
  if (amount == null) return null;
  return Object.values(PAID_PLANS).find((p) => p.price === Number(amount)) ?? null;
}

export function isPaidPlan(id: string | undefined | null): id is PaidPlanId {
  return id === "pro" || id === "equipe";
}
