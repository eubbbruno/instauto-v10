import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { checkAndIncrementAiUsage } from "@/lib/ai-quota";
import { sendText } from "@/lib/evolution";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Teto rígido de segurança: nº máximo de respostas de IA por contato por dia.
// Protege contra loop (ex.: um bot do outro lado) mesmo com a cota mensal ainda disponível.
const MAX_AI_REPLIES_PER_CONTACT_DAY = 10;

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Auto-resposta de IA (opt-in por oficina). Guardrails:
 * - só se whatsapp_ai_autoreply = true
 * - respeita a cota mensal de "chat" (checkAndIncrementAiUsage)
 * - teto por contato/dia (anti-loop)
 * - nunca responde a mensagens próprias (fromMe já é filtrado antes)
 * - modelo barato (gpt-4o-mini) + max_tokens baixo
 */
async function maybeAutoReply(
  db: ReturnType<typeof admin>,
  workshopId: string,
  remoteJid: string,
  incomingText: string
) {
  if (!openai) return;

  const { data: workshop } = await db
    .from("workshops")
    .select("name, whatsapp_ai_autoreply")
    .eq("id", workshopId)
    .single();

  if (!workshop?.whatsapp_ai_autoreply) return;

  // Teto por contato/dia (anti-loop) — conta respostas nossas nas últimas 24h.
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: repliesToday } = await db
    .from("whatsapp_messages")
    .select("*", { count: "exact", head: true })
    .eq("workshop_id", workshopId)
    .eq("remote_jid", remoteJid)
    .eq("from_me", true)
    .gte("created_at", dayAgo);

  if ((repliesToday || 0) >= MAX_AI_REPLIES_PER_CONTACT_DAY) {
    console.warn(`⚠️ [autoreply] teto/dia atingido p/ ${remoteJid}`);
    return;
  }

  // Cota mensal de chat (bloqueia e não gera prejuízo ao estourar).
  const quota = await checkAndIncrementAiUsage(workshopId, "chat");
  if (!quota.allowed) return;

  // Contexto: últimas mensagens da conversa (mais recentes por último).
  const { data: history } = await db
    .from("whatsapp_messages")
    .select("from_me, text")
    .eq("workshop_id", workshopId)
    .eq("remote_jid", remoteJid)
    .order("created_at", { ascending: false })
    .limit(8);

  const ordered = (history || []).reverse();
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `Você é o atendente virtual da oficina mecânica "${workshop.name || "nossa oficina"}" no WhatsApp. Responda de forma breve, cordial e objetiva, em português brasileiro. Ajude o cliente com dúvidas sobre serviços, horários e agendamento. Se não souber ou for algo que precise de uma pessoa (orçamento fechado, valores exatos, confirmação), diga que um atendente vai responder em breve. Nunca invente preços. Máximo de 3 frases curtas.`,
    },
    ...ordered.map((m) => ({
      role: (m.from_me ? "assistant" : "user") as "assistant" | "user",
      content: m.text || "",
    })),
  ];
  // Garante que a última mensagem recebida esteja presente.
  if (!ordered.length || ordered[ordered.length - 1].text !== incomingText) {
    messages.push({ role: "user", content: incomingText });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 220,
      temperature: 0.6,
    });
    const reply = completion.choices[0]?.message?.content?.trim();
    if (!reply) return;

    const number = remoteJid.split("@")[0];
    const result = await sendText(workshopId, number, reply);
    await db.from("whatsapp_messages").insert({
      workshop_id: workshopId,
      remote_jid: remoteJid,
      from_me: true,
      text: reply,
      message_id: result?.key?.id || null,
    });
  } catch (e: any) {
    console.error("❌ [autoreply] falha ao gerar/enviar:", e?.message);
  }
}

/**
 * Webhook da Evolution API. Recebe eventos das instâncias das oficinas.
 * O nome da instância é `oficina_<workshopId>`, então extraímos o workshopId dele.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body?.event as string | undefined;
    const instance = body?.instance as string | undefined;

    if (!instance || !instance.startsWith("oficina_")) {
      return NextResponse.json({ received: true, ignored: true }, { status: 200 });
    }
    const workshopId = instance.replace("oficina_", "");

    const db = admin();

    // Mensagem recebida
    if (event === "messages.upsert" || event === "MESSAGES_UPSERT") {
      const data = body.data;
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (!item?.key) continue;
        const fromMe = !!item.key.fromMe;
        if (fromMe) continue; // enviadas por nós já são registradas na rota de send

        const remoteJid = item.key.remoteJid || "";
        // ignora grupos e status
        if (remoteJid.includes("@g.us") || remoteJid.includes("status@")) continue;

        const text =
          item.message?.conversation ||
          item.message?.extendedTextMessage?.text ||
          item.message?.imageMessage?.caption ||
          null;

        if (!text) continue;

        await db.from("whatsapp_messages").insert({
          workshop_id: workshopId,
          remote_jid: remoteJid,
          contact_name: item.pushName || null,
          from_me: false,
          text,
          message_id: item.key.id || null,
        });

        // Auto-resposta de IA (opt-in + guardrails) — não bloqueia o webhook.
        await maybeAutoReply(db, workshopId, remoteJid, text);
      }
    }

    // Conexão atualizada → guarda o número quando conectar
    if (event === "connection.update" || event === "CONNECTION_UPDATE") {
      const state = body.data?.state;
      if (state === "open") {
        const number = (body.data?.wuid || body.sender || "").split("@")[0] || null;
        if (number) {
          await db.from("workshops").update({ whatsapp_number: number }).eq("id", workshopId);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ [webhook/evolution]", error);
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Webhook Evolution ativo" });
}
