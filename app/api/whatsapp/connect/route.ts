import { NextRequest, NextResponse } from "next/server";
import { getWorkshopAccess } from "@/lib/api-auth";
import { createInstance, connectInstance, setWebhook } from "@/lib/evolution";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.instauto.com.br";

export async function POST(request: NextRequest) {
  try {
    const { workshopId } = await request.json();
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const webhookUrl = `${APP_URL}/api/webhooks/evolution`;

    // Tenta criar a instância; se já existe, apenas pega o QR de novo.
    let qr: string | null = null;
    try {
      const created = await createInstance(workshopId, webhookUrl);
      qr = created?.qrcode?.base64 || created?.qrcode?.code || null;
    } catch (e: any) {
      // Instância já existe → apenas reconecta e pega o QR
      const conn = await connectInstance(workshopId);
      qr = conn?.base64 || conn?.qrcode?.base64 || conn?.code || null;
    }

    // Garante que o webhook está registrado (mesmo se a instância já existia).
    await setWebhook(workshopId, webhookUrl).catch(() => {});

    return NextResponse.json({ success: true, qrcode: qr });
  } catch (error: any) {
    console.error("❌ [whatsapp/connect]", error);
    return NextResponse.json({ error: error.message || "Erro ao conectar" }, { status: 500 });
  }
}
