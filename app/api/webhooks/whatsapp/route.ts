import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

/**
 * Webhook do WhatsApp Cloud API (oficial).
 *  GET  → verificação do webhook (hub.challenge) usando WHATSAPP_VERIFY_TOKEN.
 *  POST → mensagens/entregas. Valida a assinatura (X-Hub-Signature-256) com o
 *         WHATSAPP_APP_SECRET, mapeia phone_number_id → oficina e grava em
 *         whatsapp_messages (mesma tabela do fluxo antigo).
 *
 * Fase 1 (número de teste, sem oficina vinculada): apenas loga o recebido
 * (prova que o encanamento funciona). A auto-resposta com IA entra na Fase 5.
 */
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/** Verificação do webhook: a Meta chama GET com hub.challenge. */
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const mode = p.get("hub.mode");
  const token = p.get("hub.verify_token");
  const challenge = p.get("hub.challenge");

  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new NextResponse(challenge || "", { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

/** Valida a assinatura HMAC-SHA256 do corpo cru. */
function validSignature(raw: string, signature: string | null): boolean {
  if (!APP_SECRET) return true; // sem segredo configurado (dev) → não bloqueia
  if (!signature) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const raw = await request.text();

  if (!validSignature(raw, request.headers.get("x-hub-signature-256"))) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ received: true, ignored: "bad_json" }, { status: 200 });
  }

  try {
    const db = admin();

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const phoneNumberId: string | undefined = value.metadata?.phone_number_id;
        const messages = value.messages || [];
        if (!messages.length) continue;

        // Mapeia o número (phone_number_id) → oficina. Fase 1 (teste) pode não achar.
        let workshopId: string | null = null;
        if (phoneNumberId) {
          const { data: ws } = await db
            .from("workshops")
            .select("id")
            .eq("wa_phone_number_id", phoneNumberId)
            .maybeSingle();
          workshopId = ws?.id || null;
        }

        const contactName = value.contacts?.[0]?.profile?.name || null;

        for (const m of messages) {
          const from: string = m.from || "";
          const text =
            m.text?.body ||
            m.button?.text ||
            m.interactive?.list_reply?.title ||
            m.interactive?.button_reply?.title ||
            null;

          if (!text) continue;

          if (!workshopId) {
            // Fase 1 / número de teste sem oficina vinculada: só registra no log.
            console.log(`[wpp-cloud] recebido de ${from} (pnid ${phoneNumberId}): ${text}`);
            continue;
          }

          await db.from("whatsapp_messages").insert({
            workshop_id: workshopId,
            remote_jid: `${from}@s.whatsapp.net`,
            contact_name: contactName,
            from_me: false,
            text,
            message_id: m.id || null,
          });
          // TODO Fase 5: auto-resposta com IA (respeitando a janela de 24h).
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[webhook/whatsapp]", error);
    // 200 mesmo em erro para a Meta não ficar reenviando em loop.
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}
