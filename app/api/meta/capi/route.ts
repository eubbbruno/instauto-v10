import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * Meta Conversions API (server-side).
 * Recebe eventos do client e reenvia para a Meta com os dados que o navegador
 * não tem (IP, user-agent, cookies _fbp/_fbc) + PII hasheada (email/telefone).
 * O client dispara o MESMO evento no pixel com o mesmo `eventId` → a Meta
 * deduplica, então nunca conta em dobro.
 *
 * Config (env, server-only): META_CAPI_TOKEN (System User token do Events Manager).
 * Opcional: META_TEST_EVENT_CODE para testar no "Testar eventos".
 * Se o token não estiver setado, a rota vira no-op (não quebra o funil).
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE;
const API_VERSION = "v21.0";

function hashEmail(v?: string): string | undefined {
  if (!v) return undefined;
  const norm = v.trim().toLowerCase();
  if (!norm) return undefined;
  return crypto.createHash("sha256").update(norm).digest("hex");
}

function hashPhone(v?: string): string | undefined {
  if (!v) return undefined;
  // Meta espera só dígitos, com DDI. Assume Brasil (55) se vier sem.
  let digits = v.replace(/\D/g, "");
  if (!digits) return undefined;
  if (!digits.startsWith("55") && digits.length <= 11) digits = "55" + digits;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !TOKEN) {
    return NextResponse.json({ ok: false, skipped: "not_configured" });
  }
  try {
    const b = await req.json();
    if (!b?.eventName || !b?.eventId) {
      return NextResponse.json({ ok: false, error: "missing_event" });
    }

    const fbp = req.cookies.get("_fbp")?.value;
    const fbc = req.cookies.get("_fbc")?.value;
    const ua = req.headers.get("user-agent") || undefined;
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || undefined;

    const user_data: Record<string, unknown> = {};
    const em = hashEmail(b.email);
    const ph = hashPhone(b.phone);
    if (em) user_data.em = [em];
    if (ph) user_data.ph = [ph];
    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;
    if (ip) user_data.client_ip_address = ip;
    if (ua) user_data.client_user_agent = ua;

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: b.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: b.eventId,
          action_source: "website",
          event_source_url: b.eventSourceUrl,
          user_data,
          custom_data: b.custom || {},
        },
      ],
    };
    if (TEST_CODE) payload.test_event_code = TEST_CODE;

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const json = await res.json();
    if (!res.ok) {
      console.error("[CAPI] erro Meta:", json);
      return NextResponse.json({ ok: false, error: json });
    }
    return NextResponse.json({ ok: true, events_received: json.events_received });
  } catch (e) {
    console.error("[CAPI] exceção:", e);
    return NextResponse.json({ ok: false, error: (e as Error)?.message });
  }
}
