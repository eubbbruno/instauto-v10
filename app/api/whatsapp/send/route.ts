import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWorkshopAccess } from "@/lib/api-auth";
import { WHATSAPP_MODE } from "@/lib/config";
import { sendText } from "@/lib/evolution";

export async function POST(request: NextRequest) {
  if (WHATSAPP_MODE !== "evolution") {
    return NextResponse.json(
      { error: "Integração WhatsApp em migração para a API oficial. Em breve.", disabled: true },
      { status: 503 }
    );
  }
  try {
    const { workshopId, number, text } = await request.json();
    if (!workshopId || !number || !text) {
      return NextResponse.json({ error: "workshopId, number e text obrigatórios" }, { status: 400 });
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // Normaliza o número (só dígitos)
    const cleanNumber = String(number).replace(/\D/g, "");

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Rate limit: no máx. 20 mensagens enviadas por minuto por oficina
    // (proteção contra loops/bugs que gerariam envio infinito e ban do número).
    const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
    const { count } = await admin
      .from("whatsapp_messages")
      .select("*", { count: "exact", head: true })
      .eq("workshop_id", workshopId)
      .eq("from_me", true)
      .gte("created_at", oneMinAgo);

    if ((count || 0) >= 20) {
      return NextResponse.json(
        { error: "Limite de envios por minuto atingido. Aguarde um pouco." },
        { status: 429 }
      );
    }

    const result = await sendText(workshopId, cleanNumber, text);
    await admin.from("whatsapp_messages").insert({
      workshop_id: workshopId,
      remote_jid: `${cleanNumber}@s.whatsapp.net`,
      from_me: true,
      text,
      message_id: result?.key?.id || null,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [whatsapp/send]", error);
    return NextResponse.json({ error: error.message || "Erro ao enviar" }, { status: 500 });
  }
}
