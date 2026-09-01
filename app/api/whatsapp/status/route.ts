import { NextRequest, NextResponse } from "next/server";
import { getWorkshopAccess } from "@/lib/api-auth";
import { WHATSAPP_MODE } from "@/lib/config";
import { connectionState, setWebhook } from "@/lib/evolution";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.instauto.com.br";

export async function GET(request: NextRequest) {
  if (WHATSAPP_MODE !== "evolution") {
    return NextResponse.json({ connected: false, disabled: true, state: "migrating" });
  }
  try {
    const workshopId = request.nextUrl.searchParams.get("workshopId");
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    try {
      const state = await connectionState(workshopId);
      // Evolution retorna { instance: { state: "open" | "connecting" | "close" } }
      const connectionStatus = state?.instance?.state || state?.state || "close";

      // Se conectado, garante que o webhook está registrado (o Evolution perde
      // essa config ao reiniciar). Idempotente e não bloqueia a resposta.
      if (connectionStatus === "open") {
        setWebhook(workshopId, `${APP_URL}/api/webhooks/evolution`).catch(() => {});
      }

      return NextResponse.json({ connected: connectionStatus === "open", state: connectionStatus });
    } catch (e) {
      // instância ainda não existe
      return NextResponse.json({ connected: false, state: "none" });
    }
  } catch (error: any) {
    console.error("❌ [whatsapp/status]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
