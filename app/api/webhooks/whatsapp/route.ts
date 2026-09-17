import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import OpenAI from "openai";
import { checkAndIncrementAiUsage } from "@/lib/ai-quota";
import { sendText } from "@/lib/whatsapp-cloud";

export const runtime = "nodejs";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
// Teto rígido por contato/dia (anti-loop) mesmo com cota mensal disponível.
const MAX_AI_REPLIES_PER_CONTACT_DAY = 10;

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

/** Monta o prompt de sistema com o conhecimento/comportamento da oficina. */
function buildSystemPrompt(w: any): string {
  const name = w?.name || "nossa oficina";
  const local = [w?.address, w?.city, w?.state].filter(Boolean).join(", ");
  const specialties = Array.isArray(w?.specialties) ? w.specialties.join(", ") : w?.specialties || "";
  const persona = (w?.ai_persona && String(w.ai_persona).trim()) || "cordial, prestativo e objetivo";
  const facts: string[] = [];
  if (local) facts.push(`Endereço: ${local}.`);
  if (w?.phone) facts.push(`Telefone: ${w.phone}.`);
  if (specialties) facts.push(`Especialidades: ${specialties}.`);
  if (w?.ai_business_hours) facts.push(`Horário de atendimento: ${w.ai_business_hours}.`);
  if (w?.description) facts.push(`Sobre a oficina: ${w.description}.`);
  const knowledge = w?.ai_instructions ? `\n\nInformações e instruções da oficina:\n${w.ai_instructions}` : "";
  return `Você é o atendente virtual da oficina mecânica "${name}" no WhatsApp. Seu tom deve ser ${persona}. Responda sempre em português brasileiro, de forma breve (no máximo 3 frases curtas).

Dados da oficina:
${facts.length ? facts.join("\n") : "- (poucos dados cadastrados)"}${knowledge}

Regras importantes:
- Ajude com dúvidas sobre serviços, horários, localização e agendamento.
- NUNCA invente preços, prazos ou informações não fornecidas. Se não souber, diga que um atendente humano responde em breve.
- Para fechar orçamento, confirmar valores ou agendar de fato, diga que um atendente vai dar sequência.
- Não repita saudações a cada mensagem se a conversa já começou.`;
}

/**
 * Auto-resposta de IA (opt-in por oficina) no Cloud API. Guardrails: só se
 * whatsapp_ai_autoreply=true, respeita a cota mensal, teto por contato/dia e
 * só responde dentro da janela de 24h (o cliente acabou de escrever, então ok).
 */
async function maybeAutoReply(
  db: any,
  workshopId: string,
  phoneNumberId: string,
  from: string,
  incomingText: string
) {
  if (!openai) return;

  const { data: workshop } = await db
    .from("workshops")
    .select("name, whatsapp_ai_autoreply, ai_persona, ai_instructions, ai_business_hours, address, city, state, phone, specialties, description")
    .eq("id", workshopId)
    .single();
  if (!workshop?.whatsapp_ai_autoreply) return;

  const remoteJid = `${from}@s.whatsapp.net`;
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: repliesToday } = await db
    .from("whatsapp_messages")
    .select("*", { count: "exact", head: true })
    .eq("workshop_id", workshopId)
    .eq("remote_jid", remoteJid)
    .eq("from_me", true)
    .gte("created_at", dayAgo);
  if ((repliesToday || 0) >= MAX_AI_REPLIES_PER_CONTACT_DAY) return;

  const quota = await checkAndIncrementAiUsage(workshopId, "chat");
  if (!quota.allowed) return;

  const { data: history } = await db
    .from("whatsapp_messages")
    .select("from_me, text")
    .eq("workshop_id", workshopId)
    .eq("remote_jid", remoteJid)
    .order("created_at", { ascending: false })
    .limit(8);
  const ordered = (history || []).reverse();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(workshop) },
    ...ordered.map((m: any) => ({ role: (m.from_me ? "assistant" : "user") as "assistant" | "user", content: m.text || "" })),
  ];
  if (!ordered.length || ordered[ordered.length - 1].text !== incomingText) {
    messages.push({ role: "user", content: incomingText });
  }

  try {
    const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages, max_tokens: 220, temperature: 0.6 });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return;
    const result = await sendText(phoneNumberId, from, reply);
    await db.from("whatsapp_messages").insert({
      workshop_id: workshopId,
      remote_jid: remoteJid,
      from_me: true,
      text: reply,
      message_id: result?.messages?.[0]?.id || null,
    });
  } catch (e: any) {
    console.error("[wpp-cloud autoreply] falha:", e?.message);
  }
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

          // Auto-resposta de IA (opt-in + guardrails). Não bloqueia o webhook.
          if (phoneNumberId) await maybeAutoReply(db, workshopId, phoneNumberId, from, text);
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
