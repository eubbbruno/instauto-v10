import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWorkshopAccess } from "@/lib/api-auth";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const workshopId = request.nextUrl.searchParams.get("workshopId");
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }
    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const { data } = await admin()
      .from("workshops")
      .select("whatsapp_ai_autoreply")
      .eq("id", workshopId)
      .single();

    return NextResponse.json({ aiAutoreply: !!data?.whatsapp_ai_autoreply });
  } catch (error: any) {
    console.error("❌ [whatsapp/settings GET]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { workshopId, aiAutoreply } = await request.json();
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }
    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    await admin()
      .from("workshops")
      .update({ whatsapp_ai_autoreply: !!aiAutoreply })
      .eq("id", workshopId);

    return NextResponse.json({ success: true, aiAutoreply: !!aiAutoreply });
  } catch (error: any) {
    console.error("❌ [whatsapp/settings POST]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
