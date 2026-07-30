import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

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

        await admin.from("whatsapp_messages").insert({
          workshop_id: workshopId,
          remote_jid: remoteJid,
          contact_name: item.pushName || null,
          from_me: false,
          text,
          message_id: item.key.id || null,
        });
      }
    }

    // Conexão atualizada → guarda o número quando conectar
    if (event === "connection.update" || event === "CONNECTION_UPDATE") {
      const state = body.data?.state;
      if (state === "open") {
        const number = (body.data?.wuid || body.sender || "").split("@")[0] || null;
        if (number) {
          await admin.from("workshops").update({ whatsapp_number: number }).eq("id", workshopId);
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
