import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/api-auth";
import {
  sendTemplate, defaultPhoneNumberId, createMessageTemplate, listMessageTemplates,
} from "@/lib/whatsapp-cloud";

export const runtime = "nodejs";

/**
 * Helper interno (admin) para gravar os vídeos da Análise do App da Meta.
 *  - action "send": envia o template hello_world p/ um número (whatsapp_business_messaging)
 *  - action "create-template": cria um modelo na WABA (whatsapp_business_management)
 *  - action "list-templates": lista os modelos (whatsapp_business_management)
 */
const WABA_ID = process.env.WHATSAPP_WABA_ID;

export async function POST(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  try {
    const { action, to, name } = await request.json();

    if (action === "send") {
      const pnid = defaultPhoneNumberId();
      if (!pnid) return NextResponse.json({ error: "WHATSAPP_PHONE_NUMBER_ID não configurado" }, { status: 500 });
      const num = String(to || "").replace(/\D/g, "");
      if (!num) return NextResponse.json({ error: "Informe o número (55 + DDD + número)" }, { status: 400 });
      const result = await sendTemplate(pnid, num, "hello_world", "en_US");
      return NextResponse.json({ ok: true, result });
    }

    if (action === "create-template") {
      if (!WABA_ID) return NextResponse.json({ error: "WHATSAPP_WABA_ID não configurado" }, { status: 500 });
      const tplName = String(name || `instauto_atendimento_${Date.now()}`).toLowerCase().replace(/[^a-z0-9_]/g, "_");
      const result = await createMessageTemplate(WABA_ID, tplName);
      return NextResponse.json({ ok: true, name: tplName, result });
    }

    if (action === "list-templates") {
      if (!WABA_ID) return NextResponse.json({ error: "WHATSAPP_WABA_ID não configurado" }, { status: 500 });
      const result = await listMessageTemplates(WABA_ID);
      return NextResponse.json({ ok: true, result });
    }

    return NextResponse.json({ error: "action inválida" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro" }, { status: 200 });
  }
}
