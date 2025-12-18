import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { getSubscriptionStatus, mapSubscriptionStatus } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook MercadoPago recebido:", body);

    // Verificar se é notificação de assinatura
    if (body.type !== "subscription_preapproval") {
      return NextResponse.json({ received: true });
    }

    const subscriptionId = body.data?.id;
    if (!subscriptionId) {
      return NextResponse.json({ error: "ID da assinatura não fornecido" }, { status: 400 });
    }

    // Buscar status atualizado da assinatura
    const subscriptionData = await getSubscriptionStatus(subscriptionId);
    const newStatus = mapSubscriptionStatus(subscriptionData.status || "");

    // Atualizar no banco de dados
    const supabase = createClient();
    
    // Buscar oficina pela subscription_id
    const { data: workshop, error: findError } = await supabase
      .from("workshops")
      .select("*")
      .eq("mercadopago_subscription_id", subscriptionId)
      .single();

    if (findError || !workshop) {
      console.error("Oficina não encontrada:", findError);
      return NextResponse.json({ error: "Oficina não encontrada" }, { status: 404 });
    }

    // Determinar plan_type baseado no status
    let planType = workshop.plan_type;
    if (newStatus === "active") {
      planType = "pro";
    } else if (newStatus === "cancelled" || newStatus === "paused") {
      // Verificar se o trial ainda está ativo
      const trialEndsAt = new Date(workshop.trial_ends_at || 0);
      if (trialEndsAt < new Date()) {
        planType = "free";
      }
    }

    // Atualizar oficina
    const { error: updateError } = await supabase
      .from("workshops")
      .update({
        subscription_status: newStatus,
        plan_type: planType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workshop.id);

    if (updateError) {
      console.error("Erro ao atualizar oficina:", updateError);
      return NextResponse.json({ error: "Erro ao atualizar oficina" }, { status: 500 });
    }

    console.log(`Oficina ${workshop.id} atualizada: status=${newStatus}, plan=${planType}`);

    return NextResponse.json({ 
      received: true, 
      updated: true,
      workshopId: workshop.id,
      newStatus,
      planType,
    });
  } catch (error: any) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar se o webhook está funcionando
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Webhook MercadoPago está ativo",
    timestamp: new Date().toISOString(),
  });
}

