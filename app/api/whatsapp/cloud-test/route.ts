import { NextRequest, NextResponse } from "next/server";
import { sendText, defaultPhoneNumberId, isCloudConfigured } from "@/lib/whatsapp-cloud";

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
  const pnid = defaultPhoneNumberId();
  if (!pnid) {
    return NextResponse.json({ ok: false, error: "WHATSAPP_PHONE_NUMBER_ID não configurado" }, { status: 500 });
  }
  if (!to) {
    return NextResponse.json({ ok: false, error: "passe ?to=55DDDNUMERO" }, { status: 400 });
  }

  try {
    const result = await sendText(
      pnid,
      to,
      "✅ Teste do Instauto: integração oficial do WhatsApp funcionando! (mensagem automática de diagnóstico)"
    );
    return NextResponse.json({ ok: true, sent_to: to, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 });
  }
}
