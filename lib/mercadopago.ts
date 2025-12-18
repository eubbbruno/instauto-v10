import { MercadoPagoConfig, PreApproval, Payment } from "mercadopago";

// Configuração do cliente MercadoPago
export const mercadopagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
  },
});

// Instância para assinaturas
export const preApprovalAPI = new PreApproval(mercadopagoClient);

// Instância para pagamentos
export const paymentAPI = new Payment(mercadopagoClient);

// Tipos
export interface CreateSubscriptionData {
  workshopId: string;
  workshopName: string;
  email: string;
  reason: string;
  autoRecurring: {
    frequency: number;
    frequencyType: "months";
    transactionAmount: number;
    currencyId: "BRL";
  };
  backUrl: string;
}

export interface SubscriptionResponse {
  id: string;
  initPoint: string;
  status: string;
}

// Função para criar assinatura
export async function createSubscription(
  data: CreateSubscriptionData
): Promise<SubscriptionResponse> {
  try {
    const subscription = await preApprovalAPI.create({
      body: {
        reason: data.reason,
        auto_recurring: {
          frequency: data.autoRecurring.frequency,
          frequency_type: data.autoRecurring.frequencyType,
          transaction_amount: data.autoRecurring.transactionAmount,
          currency_id: data.autoRecurring.currencyId,
        },
        back_url: data.backUrl,
        payer_email: data.email,
        external_reference: data.workshopId,
      },
    });

    return {
      id: subscription.id!,
      initPoint: subscription.init_point!,
      status: subscription.status!,
    };
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
}

// Função para verificar status da assinatura
export async function getSubscriptionStatus(subscriptionId: string) {
  try {
    const subscription = await preApprovalAPI.get({ id: subscriptionId });
    return {
      id: subscription.id,
      status: subscription.status,
      payerEmail: subscription.payer_email,
      reason: subscription.reason,
      autoRecurring: subscription.auto_recurring,
    };
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    throw error;
  }
}

// Mapear status do MercadoPago para nosso sistema
export function mapSubscriptionStatus(mpStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "pending",
    authorized: "active",
    paused: "paused",
    cancelled: "cancelled",
  };

  return statusMap[mpStatus] || "none";
}

