import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { createSubscription } from "@/lib/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workshopId, email } = body;

    if (!workshopId || !email) {
      return NextResponse.json(
        { error: "Workshop ID e email são obrigatórios" },
        { status: 400 }
      );
    }

    // Buscar dados da oficina
    const supabase = createClient();
    const { data: workshop, error: workshopError } = await supabase
      .from("workshops")
      .select("*, profiles!inner(name, email)")
      .eq("id", workshopId)
      .single();

    if (workshopError || !workshop) {
      return NextResponse.json(
        { error: "Oficina não encontrada" },
        { status: 404 }
      );
    }

    // Criar assinatura no MercadoPago
    const subscription = await createSubscription({
      workshopId: workshop.id,
      workshopName: workshop.name,
      email: email,
      reason: `Plano PRO - ${workshop.name}`,
      autoRecurring: {
        frequency: 1,
        frequencyType: "months",
        transactionAmount: 97.0,
        currencyId: "BRL",
      },
      backUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/oficina/planos?status=success`,
    });

    // Salvar ID da assinatura no banco
    const { error: updateError } = await supabase
      .from("workshops")
      .update({
        mercadopago_subscription_id: subscription.id,
        subscription_status: "pending",
      })
      .eq("id", workshopId);

    if (updateError) {
      console.error("Erro ao atualizar oficina:", updateError);
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      initPoint: subscription.initPoint,
    });
  } catch (error: any) {
    console.error("Erro ao criar assinatura:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar assinatura" },
      { status: 500 }
    );
  }
}

