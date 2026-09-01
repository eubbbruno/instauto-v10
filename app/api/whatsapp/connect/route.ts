import { NextRequest, NextResponse } from "next/server";
import { getWorkshopAccess } from "@/lib/api-auth";
import { WHATSAPP_MODE } from "@/lib/config";
import {
  createInstance, connectInstance, setWebhook, logoutInstance, deleteInstance,
} from "@/lib/evolution";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.instauto.com.br";
const DISABLED_MSG = "Integração WhatsApp em migração para a API oficial. Em breve.";

/** Extrai o QR em base64 (imagem) das várias formas que o Evolution retorna. */
function extractQr(res: any): string | null {
  return res?.qrcode?.base64 || res?.base64 || null;
}

export async function POST(request: NextRequest) {
  if (WHATSAPP_MODE !== "evolution") {
    return NextResponse.json({ error: DISABLED_MSG, disabled: true }, { status: 503 });
  }
  try {
    const { workshopId, reset } = await request.json();
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const webhookUrl = `${APP_URL}/api/webhooks/evolution`;

    // Se o cliente pediu reset explícito, já limpa a instância antes.
    if (reset) {
      try { await logoutInstance(workshopId); } catch {}
      try { await deleteInstance(workshopId); } catch {}
      await new Promise((r) => setTimeout(r, 1000));
    }

    // 1ª tentativa: cria (ou, se já existe, conecta) e pega o QR.
    let qr: string | null = null;
    try {
      const created = await createInstance(workshopId, webhookUrl);
      qr = extractQr(created);
    } catch {
      try {
        const conn = await connectInstance(workshopId);
        qr = extractQr(conn);
      } catch {}
    }

    // Se não veio QR, a instância está travada → reseta (delete + recria).
    if (!qr) {
      try { await logoutInstance(workshopId); } catch {}
      try { await deleteInstance(workshopId); } catch {}
      await new Promise((r) => setTimeout(r, 1200));
      try {
        const recreated = await createInstance(workshopId, webhookUrl);
        qr = extractQr(recreated);
      } catch (e: any) {
        return NextResponse.json({ error: e.message || "Falha ao recriar instância" }, { status: 500 });
      }
    }

    // Garante o webhook registrado.
    await setWebhook(workshopId, webhookUrl).catch(() => {});

    return NextResponse.json({ success: true, qrcode: qr });
  } catch (error: any) {
    console.error("❌ [whatsapp/connect]", error);
    return NextResponse.json({ error: error.message || "Erro ao conectar" }, { status: 500 });
  }
}
