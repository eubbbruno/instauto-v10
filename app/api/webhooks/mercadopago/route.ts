import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSubscriptionStatus, mapSubscriptionStatus } from "@/lib/mercadopago";
import { planByAmount } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("=== WEBHOOK MERCADOPAGO RECEBIDO ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Payload completo:", JSON.stringify(body, null, 2));
    console.log("Type:", body.type);
    console.log("Action:", body.action);
    console.log("Data ID:", body.data?.id);

    // Verificar se é notificação de assinatura (preapproval)
    if (body.type !== "subscription_preapproval" && body.type !== "preapproval") {
      console.log(`⚠️ Tipo de notificação ignorado: ${body.type}`);
      return NextResponse.json({ received: true, ignored: true, reason: "not_subscription" }, { status: 200 });
    }

    const subscriptionId = body.data?.id;
    if (!subscriptionId) {
      console.log("❌ ID da assinatura não fornecido");
      return NextResponse.json({ received: true, error: "ID da assinatura não fornecido" }, { status: 200 });
    }

    console.log("📋 Subscription ID:", subscriptionId);

    // Buscar status atualizado da assinatura no MercadoPago
    console.log("🔍 Buscando status da assinatura no MercadoPago...");
    const subscriptionData = await getSubscriptionStatus(subscriptionId);
    console.log("📦 Dados da assinatura:", subscriptionData);
    
    const newStatus = mapSubscriptionStatus(subscriptionData.status || "");
    console.log("📊 Status mapeado:", newStatus);

    // Criar cliente Supabase com Service Role (bypassa RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    console.log("🔍 Buscando oficina no Supabase (usando Service Role)...");
    
    // Buscar oficina pela subscription_id
    const { data: workshop, error: findError } = await supabaseAdmin
      .from("workshops")
      .select("*")
      .eq("mercadopago_subscription_id", subscriptionId)
      .single();

    console.log("📦 Resultado da busca:");
    console.log("  workshop:", workshop);
    console.log("  findError:", findError);

    if (findError || !workshop) {
      console.error("❌ Oficina não encontrada para subscription_id:", subscriptionId);
      console.error("  Erro:", findError);
      return NextResponse.json({ 
        received: true, 
        error: "Oficina não encontrada",
        subscriptionId 
      }, { status: 200 }); // Retorna 200 para não reenviar
    }

    console.log("✅ Oficina encontrada:", workshop.name, `(ID: ${workshop.id})`);

    // Determinar plan_type + assentos baseado no status e no valor da assinatura
    let planType = workshop.plan_type;
    let maxSeats = workshop.max_seats ?? 1;
    const oldPlanType = planType;

    // Descobre qual plano foi contratado pelo valor cobrado (97=PRO, 147=Equipe)
    const paidPlan = planByAmount(subscriptionData.autoRecurring?.transaction_amount);

    console.log("🔄 Determinando novo plan_type...");
    console.log("  Status:", newStatus, "| Valor:", subscriptionData.autoRecurring?.transaction_amount, "| Plano detectado:", paidPlan?.id);

    if (newStatus === "active") {
      planType = paidPlan?.id || "pro";
      maxSeats = paidPlan?.maxSeats || 1;
      console.log(`  ✅ Pagamento aprovado → ${planType} (${maxSeats} assentos)`);
    } else if (newStatus === "cancelled" || newStatus === "paused") {
      const trialEndsAt = new Date(workshop.trial_ends_at || 0);
      if (trialEndsAt < new Date()) {
        planType = "free";
        maxSeats = 1;
        console.log("  ❌ Assinatura cancelada + trial expirado → FREE");
      } else {
        console.log("  ⏳ Assinatura cancelada mas trial ainda ativo → mantém plano");
      }
    }

    console.log("  Plan final:", planType, "| Assentos:", maxSeats);

    // Atualizar oficina
    console.log("💾 Atualizando oficina no banco...");
    const { error: updateError } = await supabaseAdmin
      .from("workshops")
      .update({
        subscription_status: newStatus,
        plan_type: planType,
        max_seats: maxSeats,
        updated_at: new Date().toISOString(),
      })
      .eq("id", workshop.id);

    if (updateError) {
      console.error("❌ Erro ao atualizar oficina:", updateError);
      return NextResponse.json({ 
        received: true,
        error: "Erro ao atualizar oficina",
        details: updateError.message 
      }, { status: 200 }); // Retorna 200 para não reenviar
    }

    console.log("✅ Oficina atualizada com sucesso!");
    console.log(`📊 Resumo: ${workshop.name} (${workshop.id})`);
    console.log(`   Status: ${newStatus}`);
    console.log(`   Plan: ${oldPlanType} → ${planType}`);
    console.log("=== FIM WEBHOOK ===");

    return NextResponse.json({ 
      received: true, 
      updated: true,
      workshopId: workshop.id,
      workshopName: workshop.name,
      oldStatus: workshop.subscription_status,
      newStatus,
      oldPlanType,
      newPlanType: planType,
    }, { status: 200 });
  } catch (error: any) {
    console.error("❌ ERRO GERAL no webhook:", error);
    console.error("Stack trace:", error.stack);
    // Retorna 200 para o MercadoPago não reenviar indefinidamente
    return NextResponse.json(
      { 
        received: true,
        error: error.message || "Erro ao processar webhook",
        stack: error.stack 
      },
      { status: 200 }
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

