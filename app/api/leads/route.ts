import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Captação de oficinas (landing de ADS). Baixa fricção: nome, WhatsApp e cidade.
 * Grava o lead e avisa por e-mail (best-effort). O atendimento em si acontece
 * quando o lead abre o WhatsApp pelo botão da página (a IA responde automático).
 */
export async function POST(request: NextRequest) {
  try {
    const { name, phone, city } = await request.json();
    if (!name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Nome e WhatsApp são obrigatórios." }, { status: 400 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await admin.from("oficina_leads").insert({
      name: name.trim(),
      phone: phone.trim(),
      city: city?.trim() || null,
      source: "captacao-ads",
    });
    if (error) throw error;

    // Aviso por e-mail (opcional).
    const key = process.env.RESEND_API_KEY;
    if (key) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.CONTACT_FROM_EMAIL || "Instauto <contato@instauto.com.br>",
            to: [process.env.CONTACT_TO_EMAIL || "contato@instauto.com.br"],
            subject: `[Lead oficina] ${name.trim()}${city ? " — " + city.trim() : ""}`,
            text: `Novo lead de oficina (captação ADS):\nNome: ${name}\nWhatsApp: ${phone}\nCidade: ${city || "-"}`,
          }),
        });
      } catch (e) {
        console.warn("⚠️ [leads] falha ao enviar e-mail (lead salvo no banco):", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [leads]", error);
    return NextResponse.json({ error: error.message || "Erro ao enviar" }, { status: 500 });
  }
}
