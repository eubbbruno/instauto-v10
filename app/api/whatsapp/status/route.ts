import { NextRequest, NextResponse } from "next/server";
import { getWorkshopAccess } from "@/lib/api-auth";
import { connectionState } from "@/lib/evolution";

export async function GET(request: NextRequest) {
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
