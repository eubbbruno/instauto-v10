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
      .select("whatsapp_ai_autoreply, ai_persona, ai_instructions, ai_business_hours")
      .eq("id", workshopId)
      .single();

    return NextResponse.json({
      aiAutoreply: !!data?.whatsapp_ai_autoreply,
      aiPersona: data?.ai_persona || "",
      aiInstructions: data?.ai_instructions || "",
      aiBusinessHours: data?.ai_business_hours || "",
    });
  } catch (error: any) {
    console.error("❌ [whatsapp/settings GET]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workshopId } = body;
    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }
    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    // Atualiza só os campos enviados (patch parcial)
    const patch: Record<string, any> = {};
    if ("aiAutoreply" in body) patch.whatsapp_ai_autoreply = !!body.aiAutoreply;
    if ("aiPersona" in body) patch.ai_persona = body.aiPersona || null;
    if ("aiInstructions" in body) patch.ai_instructions = body.aiInstructions || null;
    if ("aiBusinessHours" in body) patch.ai_business_hours = body.aiBusinessHours || null;

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
    }

    await admin().from("workshops").update(patch).eq("id", workshopId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [whatsapp/settings POST]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
