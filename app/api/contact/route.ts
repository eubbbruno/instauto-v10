import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Recebe mensagens do formulário de contato.
 * Sempre grava no banco (não perde lead) e, se RESEND_API_KEY estiver
 * configurado, envia um e-mail de notificação (best-effort, via REST da Resend).
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Nome, e-mail e mensagem são obrigatórios." }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: "Mensagem muito longa." }, { status: 400 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await admin.from("contact_messages").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
    });
    if (error) throw error;

    // Notificação por e-mail (opcional — só se a Resend estiver configurada)
    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL || "Instauto <contato@instauto.com.br>",
            to: [process.env.CONTACT_TO_EMAIL || "contato@instauto.com.br"],
            reply_to: email.trim(),
            subject: `[Contato] ${subject || "Nova mensagem"} — ${name.trim()}`,
            text: `Nome: ${name}\nE-mail: ${email}\nTelefone: ${phone || "-"}\nAssunto: ${subject || "-"}\n\n${message}`,
          }),
        });
      } catch (e) {
        console.warn("⚠️ [contact] falha ao enviar e-mail (mensagem salva no banco):", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [contact]", error);
    return NextResponse.json({ error: error.message || "Erro ao enviar" }, { status: 500 });
  }
}
