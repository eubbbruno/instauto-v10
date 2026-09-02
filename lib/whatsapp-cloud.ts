/**
 * Cliente do WhatsApp Cloud API (oficial da Meta) — substitui o Evolution.
 *
 * Env (server-only):
 *   WHATSAPP_TOKEN            → System User token (permanente) do app "Gestor de Oficinas"
 *   WHATSAPP_APP_SECRET       → App Secret (valida a assinatura do webhook)
 *   WHATSAPP_VERIFY_TOKEN     → string que nós escolhemos (verificação do webhook)
 *   WHATSAPP_PHONE_NUMBER_ID  → id do número (Fase 1: número de teste; Fase 2: por oficina no banco)
 *   WHATSAPP_WABA_ID          → id da WhatsApp Business Account (opcional)
 *
 * Multi-tenant (Fase 2/Coexistence): o phone_number_id vem por oficina (workshops.wa_phone_number_id),
 * então sendText recebe o phoneNumberId explicitamente.
 */
const GRAPH = "https://graph.facebook.com/v21.0";
const TOKEN = process.env.WHATSAPP_TOKEN;

export function isCloudConfigured(): boolean {
  return !!TOKEN;
}

/** phone_number_id padrão (Fase 1 — número único). Fase 2 passa o da oficina. */
export function defaultPhoneNumberId(): string | undefined {
  return process.env.WHATSAPP_PHONE_NUMBER_ID;
}

async function graph(path: string, init: RequestInit = {}) {
  if (!TOKEN) throw new Error("WHATSAPP_TOKEN não configurado.");
  const res = await fetch(`${GRAPH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`WhatsApp Cloud ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

/** Envia mensagem de texto livre (só vale dentro da janela de 24h). `to` = E.164 só dígitos. */
export async function sendText(phoneNumberId: string, to: string, text: string) {
  return graph(`/${phoneNumberId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });
}

/** Envia um template aprovado (HSM) — necessário fora da janela de 24h. */
export async function sendTemplate(
  phoneNumberId: string,
  to: string,
  templateName: string,
  languageCode = "pt_BR",
  components?: unknown[]
) {
  return graph(`/${phoneNumberId}/messages`, {
    method: "POST",
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(components ? { components } : {}),
      },
    }),
  });
}

/** Marca uma mensagem recebida como lida (opcional, melhora UX). */
export async function markRead(phoneNumberId: string, messageId: string) {
  return graph(`/${phoneNumberId}/messages`, {
    method: "POST",
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: messageId }),
  });
}
