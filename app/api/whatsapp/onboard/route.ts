import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getWorkshopAccess } from "@/lib/api-auth";
import {
  exchangeCodeForToken, subscribeApp, registerPhoneNumber, getPhoneNumber,
} from "@/lib/whatsapp-cloud";

export const runtime = "nodejs";

/**
 * Conclui o Embedded Signup (Coexistence) de uma oficina.
 * Recebe do front: { workshopId, code, phoneNumberId, wabaId }.
 * 1) troca o code por token do negócio da oficina
 * 2) inscreve NOSSO app nos webhooks da WABA da oficina
 * 3) registra o número (no-op em coexistence) e lê o display/nome
 * 4) salva wa_* na oficina → a partir daí ela envia/recebe pelo painel
 *
 * Os envios/recebimentos seguintes usam o WHATSAPP_TOKEN (system user, Tech
 * Provider) com o phone_number_id da oficina — não guardamos token por oficina.
 */
function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { workshopId, code, phoneNumberId, wabaId } = await request.json();
    if (!workshopId || !code || !phoneNumberId || !wabaId) {
      return NextResponse.json(
        { error: "workshopId, code, phoneNumberId e wabaId são obrigatórios" },
        { status: 400 }
      );
    }

    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // 1) Troca o code pelo token do NEGÓCIO da oficina (é ele que tem acesso à WABA dela).
    let bizToken: string | undefined;
    try {
      bizToken = await exchangeCodeForToken(code);
    } catch (e) {
      console.warn("[onboard] troca de code falhou:", (e as Error).message);
    }

    // 2) Inscreve nosso app na WABA da oficina (essencial p/ receber). Usa o token da oficina.
    let subscribed = false;
    try {
      await subscribeApp(wabaId, bizToken);
      subscribed = true;
    } catch (e) {
      console.error("[onboard] subscribeApp falhou:", (e as Error).message);
    }

    // 3) Registra o número (números novos) — best-effort; coexistence normalmente dispensa.
    try {
      await registerPhoneNumber(phoneNumberId, "000000", bizToken);
    } catch (e) {
      console.warn("[onboard] register phone (ok ignorar em coexistence):", (e as Error).message);
    }

    // 3b) Lê display/nome verificado — best-effort.
    let displayNumber: string | null = null;
    let verifiedName: string | null = null;
    try {
      const info = await getPhoneNumber(phoneNumberId, bizToken);
      displayNumber = info?.display_phone_number || null;
      verifiedName = info?.verified_name || null;
    } catch {}

    // 4) Salva na oficina (guardando o token dela para envios/recebimentos).
    const { error } = await admin()
      .from("workshops")
      .update({
        wa_waba_id: wabaId,
        wa_phone_number_id: phoneNumberId,
        wa_display_number: displayNumber,
        wa_verified_name: verifiedName,
        wa_status: subscribed ? "connected" : "pending",
        wa_token: bizToken || null,
      })
      .eq("id", workshopId);
    if (error) throw new Error("Erro ao salvar: " + error.message);

    return NextResponse.json({
      ok: true,
      connected: subscribed,
      subscribed,
      display_number: displayNumber,
      verified_name: verifiedName,
    });
  } catch (error: any) {
    console.error("[whatsapp/onboard]", error);
    return NextResponse.json({ error: error.message || "Erro no onboard" }, { status: 500 });
  }
}
