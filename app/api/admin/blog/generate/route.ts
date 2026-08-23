import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAdminUser } from "@/lib/api-auth";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function POST(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  if (!openai) return NextResponse.json({ error: "OPENAI_API_KEY não configurada" }, { status: 503 });

  try {
    const { topic, audience } = await request.json();
    if (!topic?.trim()) return NextResponse.json({ error: "Informe o tema do artigo" }, { status: 400 });

    const publico = audience === "oficina"
      ? "donos de oficina mecânica (foco em gestão, faturamento, organização)"
      : "motoristas (foco em manutenção, economia, segurança do carro)";

    const cta = audience === "oficina"
      ? "No fim, um parágrafo curto de CTA convidando a conhecer o sistema de gestão do Instauto (14 dias grátis, sem cartão)."
      : "No fim, um parágrafo curto de CTA convidando a comparar oficinas e pedir orçamento grátis no Instauto.";

    const prompt = `Você é redator de SEO do Instauto, um marketplace de oficinas mecânicas + sistema de gestão para oficinas, no Brasil.
Escreva um artigo de blog em português brasileiro sobre o tema: "${topic}".
Público-alvo: ${publico}.
Requisitos:
- 500 a 800 palavras, tom prático, confiável e direto (sem enrolação).
- Formato Markdown: use ## para subtítulos, parágrafos curtos e listas com "-" quando fizer sentido.
- NÃO repita o título como "# " no topo do conteúdo.
- Otimizado para SEO (use termos que as pessoas pesquisam no Google, de forma natural).
- ${cta}
Responda APENAS um JSON com os campos: title (string), excerpt (1-2 frases), category (uma palavra: Manutenção, Dicas, Gestão ou Segurança), emoji (1 emoji relevante), readingTime (ex.: "5 min"), content (o markdown do artigo).`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let parsed: any;
    try { parsed = JSON.parse(raw); } catch { return NextResponse.json({ error: "Falha ao gerar (resposta inválida). Tente de novo." }, { status: 502 }); }

    return NextResponse.json({
      title: parsed.title || topic,
      excerpt: parsed.excerpt || "",
      category: parsed.category || (audience === "oficina" ? "Gestão" : "Dicas"),
      emoji: parsed.emoji || "🔧",
      readingTime: parsed.readingTime || "5 min",
      content: parsed.content || "",
    });
  } catch (e: any) {
    console.error("❌ [admin/blog/generate]", e);
    return NextResponse.json({ error: e.message || "Erro ao gerar" }, { status: 500 });
  }
}
