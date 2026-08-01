import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWorkshopAccess } from "@/lib/api-auth";
import { getAiUsage } from "@/lib/ai-quota";

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

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data: workshop } = await admin
      .from("workshops")
      .select("plan_type, subscription_status, trial_ends_at")
      .eq("id", workshopId)
      .single();

    const diagnostico = await getAiUsage(workshopId, workshop || {}, "diagnostico");
    const chat = await getAiUsage(workshopId, workshop || {}, "chat");

    return NextResponse.json({ diagnostico, chat });
  } catch (error: any) {
    console.error("❌ [ai/usage]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
