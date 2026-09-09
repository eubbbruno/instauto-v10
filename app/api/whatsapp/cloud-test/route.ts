import { NextRequest, NextResponse } from "next/server";
import { sendText, sendTemplate, subscribeApp, listSubscribedApps, defaultPhoneNumberId, isCloudConfigured } from "@/lib/whatsapp-cloud";

export const runtime = "nodejs";

/**
 * Endpoint TEMPORÁRIO de diagnóstico do WhatsApp Cloud API.
 * Dispara uma mensagem de teste usando o WHATSAPP_TOKEN do env.
 * Protegido pelo WHATSAPP_VERIFY_TOKEN (?key=). REMOVER após validar o envio.
 *
 * Uso: /api/whatsapp/cloud-test?to=55439XXXXXXXX&key=<WHATSAPP_VERIFY_TOKEN>
 */
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const key = p.get("key");
  const to = (p.get("to") || "").replace(/\D/g, "");

  if (!process.env.WHATSAPP_VERIFY_TOKEN || key !== process.env.WHATSAPP_VERIFY_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
  }
  if (!isCloudConfigured()) {
    return NextResponse.json({ ok: false, error: "WHATSAPP_TOKEN não configurado no env" }, { status: 500 });
  }

  // Ações de webhook (inscreve/lista o app na WABA) — resolvem "mensagens não chegam".
  const action = p.get("action");
  const wabaId = process.env.WHATSAPP_WABA_ID;
  if (action === "subscribe" || action === "list-subs") {
    if (!wabaId) return NextResponse.json({ ok: false, error: "WHATSAPP_WABA_ID não configurado" }, { status: 500 });
    try {
      const result = action === "subscribe" ? await subscribeApp(wabaId) : await listSubscribedApps(wabaId);
      return NextResponse.json({ ok: true, action, waba_id: wabaId, result });
    } catch (e) {
      return NextResponse.json({ ok: false, action, error: (e as Error).message }, { status: 200 });
    }
  }

  const pnid = defaultPhoneNumberId();
  if (!pnid) {
    return NextResponse.json({ ok: false, error: "WHATSAPP_PHONE_NUMBER_ID não configurado" }, { status: 500 });
  }
  if (!to) {
    return NextResponse.json({ ok: false, error: "passe ?to=55DDDNUMERO" }, { status: 400 });
  }

  // type=template (padrão) usa o hello_world, que ENTREGA fora da janela de 24h.
  // type=text só entrega dentro de uma janela de 24h aberta pelo cliente.
  const type = p.get("type") || "template";

  try {
    const result =
      type === "text"
        ? await sendText(pnid, to, "✅ Teste do Instauto: integração oficial do WhatsApp funcionando!")
        : await sendTemplate(pnid, to, "hello_world", "en_US");
    return NextResponse.json({ ok: true, type, sent_to: to, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 });
  }
}
