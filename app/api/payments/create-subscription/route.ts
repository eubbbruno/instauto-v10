import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSubscription } from "@/lib/mercadopago";
import { PAID_PLANS, isPaidPlan, isCycle, priceFor, recurrenceFor } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    // Log do body completo
    const body = await request.json();

    console.log("=== API CREATE-SUBSCRIPTION ===");
    console.log("Body recebido:", JSON.stringify(body, null, 2));
    console.log("Campos do body:", Object.keys(body));

    // Aceitar tanto 'email' quanto 'userEmail'
    const { workshopId, email, userEmail, userName, plan, cycle } = body;
    const finalEmail = email || userEmail;
    const planId = isPaidPlan(plan) ? plan : "pro";
    const billingCycle = isCycle(cycle) ? cycle : "monthly";
    const planConfig = PAID_PLANS[planId];
    const amount = priceFor(planId, billingCycle);
    const recurrence = recurrenceFor(billingCycle);
    
    console.log("Valores extraídos:");
    console.log("  workshopId:", workshopId);
    console.log("  email:", email);
    console.log("  userEmail:", userEmail);
    console.log("  userName:", userName);
    console.log("  finalEmail:", finalEmail);

    if (!workshopId || !finalEmail) {
      console.log("❌ ERRO: Campos obrigatórios faltando");
      console.log("  workshopId existe?", !!workshopId);
      console.log("  finalEmail existe?", !!finalEmail);
      return NextResponse.json(
        { error: "Workshop ID e email são obrigatórios" },
        { status: 400 }
      );
    }
    
    console.log("✅ Validação OK, prosseguindo...");

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
    
    console.log("🔍 Buscando workshop no Supabase (usando Service Role):", workshopId);
    
    const { data: workshop, error: workshopError } = await supabaseAdmin
      .from("workshops")
      .select("*")
      .eq("id", workshopId)
      .single();

    console.log("📦 Resposta do Supabase:");
    console.log("  workshop:", workshop);
    console.log("  workshopError:", workshopError);

    if (workshopError || !workshop) {
      console.log("❌ Workshop não encontrado");
      return NextResponse.json(
        { error: "Oficina não encontrada" },
        { status: 404 }
      );
    }

    console.log("✅ Workshop encontrado:", workshop.name);

    // Criar assinatura no MercadoPago
    const subscriptionData = {
      workshopId: workshop.id,
      workshopName: workshop.name,
      email: finalEmail,
      reason: `Plano ${planConfig.name} ${billingCycle === "annual" ? "(anual)" : "(mensal)"} - ${workshop.name}`,
      autoRecurring: {
        frequency: recurrence.frequency,
        frequencyType: recurrence.frequencyType,
        transactionAmount: amount,
        currencyId: "BRL" as const,
      },
      backUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/oficina/planos?status=success`,
    };
    
    console.log("💳 Criando assinatura no MercadoPago:", subscriptionData);
    const subscription = await createSubscription(subscriptionData);
    
    console.log("✅ Assinatura criada:", {
      id: subscription.id,
      initPoint: subscription.initPoint,
    });

    // Salvar ID da assinatura no banco
    console.log("💾 Salvando ID da assinatura no banco...");
    const { error: updateError } = await supabaseAdmin
      .from("workshops")
      .update({
        mercadopago_subscription_id: subscription.id,
        subscription_status: "pending",
      })
      .eq("id", workshopId);

    if (updateError) {
      console.error("❌ Erro ao atualizar oficina:", updateError);
    } else {
      console.log("✅ Oficina atualizada com sucesso");
    }

    console.log("🎉 Retornando resposta de sucesso");
    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      initPoint: subscription.initPoint,
    });
  } catch (error: any) {
    console.error("❌ ERRO GERAL na API:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { error: error.message || "Erro ao criar assinatura" },
      { status: 500 }
    );
  }
}


