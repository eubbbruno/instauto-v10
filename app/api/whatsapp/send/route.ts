import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWorkshopAccess } from "@/lib/api-auth";
import { WHATSAPP_MODE } from "@/lib/config";
import { sendText as evoSendText } from "@/lib/evolution";
import { sendText as cloudSendText } from "@/lib/whatsapp-cloud";

export async function POST(request: NextRequest) {
  try {
    const { workshopId, number, text } = await request.json();
    if (!workshopId || !number || !text) {
      return NextResponse.json({ error: "workshopId, number e text obrigatórios" }, { status: 400 });
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const cleanNumber = String(number).replace(/\D/g, "");

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Rate limit: máx. 20 mensagens enviadas por minuto por oficina (anti-loop/ban).
    const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
    const { count } = await admin
      .from("whatsapp_messages")
      .select("*", { count: "exact", head: true })
      .eq("workshop_id", workshopId)
      .eq("from_me", true)
      .gte("created_at", oneMinAgo);
    if ((count || 0) >= 20) {
      return NextResponse.json({ error: "Limite de envios por minuto atingido. Aguarde um pouco." }, { status: 429 });
    }

    // Descobre como a oficina está conectada.
    const { data: ws } = await admin
      .from("workshops")
      .select("wa_phone_number_id")
      .eq("id", workshopId)
      .single();

    let messageId: string | null = null;

    if (ws?.wa_phone_number_id) {
      // Cloud API oficial.
      try {
        const result = await cloudSendText(ws.wa_phone_number_id, cleanNumber, text);
        messageId = result?.messages?.[0]?.id || null;
      } catch (e: any) {
        const msg = String(e?.message || "");
        // Fora da janela de 24h → só template aprovado entrega.
        if (/131047|re-?engagement|24\s*hour|outside|template/i.test(msg)) {
          return NextResponse.json(
            { error: "Fora da janela de 24h: você só pode responder livremente até 24h após a última mensagem do cliente. Depois disso, só com um modelo aprovado." },
            { status: 409 }
          );
        }
        throw e;
      }
    } else if (WHATSAPP_MODE === "evolution") {
      const result = await evoSendText(workshopId, cleanNumber, text);
      messageId = result?.key?.id || null;
    } else {
      return NextResponse.json({ error: "WhatsApp não conectado.", disabled: true }, { status: 503 });
    }

    await admin.from("whatsapp_messages").insert({
      workshop_id: workshopId,
      remote_jid: `${cleanNumber}@s.whatsapp.net`,
      from_me: true,
      text,
      message_id: messageId,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [whatsapp/send]", error);
    return NextResponse.json({ error: error.message || "Erro ao enviar" }, { status: 500 });
  }
}
