/**
 * Cliente da Evolution API (WhatsApp) — self-hosted no Railway.
 *
 * Env vars necessárias (Vercel):
 *   EVOLUTION_API_URL  → URL pública da instância no Railway (ex.: https://evolution-xxxx.up.railway.app)
 *   EVOLUTION_API_KEY  → o AUTHENTICATION_API_KEY definido na Evolution
 *
 * Cada oficina tem uma "instância" própria (um número de WhatsApp).
 * Convenção do nome da instância: `oficina_<workshopId>`.
 */

const BASE = process.env.EVOLUTION_API_URL;
const KEY = process.env.EVOLUTION_API_KEY;

export function instanceName(workshopId: string) {
  return `oficina_${workshopId}`;
}

function assertConfig() {
  if (!BASE || !KEY) {
    throw new Error("Evolution API não configurada (EVOLUTION_API_URL / EVOLUTION_API_KEY).");
  }
}

async function evo(path: string, init: RequestInit = {}) {
  assertConfig();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: KEY as string,
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let data: any;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) {
    throw new Error(`Evolution ${res.status}: ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

/** Cria a instância da oficina e já pede o QR code (base64). */
export async function createInstance(workshopId: string, webhookUrl?: string) {
  const body: Record<string, any> = {
    instanceName: instanceName(workshopId),
    integration: "WHATSAPP-BAILEYS",
    qrcode: true,
  };
  if (webhookUrl) {
    body.webhook = {
      url: webhookUrl,
      byEvents: false,
      base64: true,
      events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE"],
    };
  }
  return evo("/instance/create", { method: "POST", body: JSON.stringify(body) });
}

/** Retorna o QR code atual (para reconectar/mostrar de novo). */
export async function connectInstance(workshopId: string) {
  return evo(`/instance/connect/${instanceName(workshopId)}`, { method: "GET" });
}

/** Estado da conexão: open (conectado) | connecting | close. */
export async function connectionState(workshopId: string) {
  return evo(`/instance/connectionState/${instanceName(workshopId)}`, { method: "GET" });
}

/** Envia uma mensagem de texto. `number` = DDI+DDD+número (ex.: 5543999999999). */
export async function sendText(workshopId: string, number: string, text: string) {
  return evo(`/message/sendText/${instanceName(workshopId)}`, {
    method: "POST",
    body: JSON.stringify({ number, text }),
  });
}

/** Desconecta/loga out o WhatsApp da instância. */
export async function logoutInstance(workshopId: string) {
  return evo(`/instance/logout/${instanceName(workshopId)}`, { method: "DELETE" });
}
