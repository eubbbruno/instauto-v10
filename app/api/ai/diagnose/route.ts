import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getWorkshopAccess } from "@/lib/api-auth";
import { checkAndIncrementAiUsage } from "@/lib/ai-quota";

// Inicializar OpenAI apenas se a API key estiver configurada
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const { symptoms, vehicleInfo, workshopId } = await request.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: "Sintomas são obrigatórios" },
        { status: 400 }
      );
    }

    if (!workshopId) {
      return NextResponse.json({ error: "workshopId obrigatório" }, { status: 400 });
    }

    // Segurança: só dono/membro da oficina
    const access = await getWorkshopAccess(workshopId);
    if (!access.ok) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    // Guardrail de custo: cota mensal por plano
    const quota = await checkAndIncrementAiUsage(workshopId, "diagnostico");
    if (!quota.allowed) {
      const msg = quota.reason === "no_plan"
        ? "Diagnóstico com IA é um recurso dos planos pagos."
        : `Você atingiu o limite mensal de diagnósticos com IA (${quota.limit}). O limite renova no início do próximo mês.`;
      return NextResponse.json({ error: msg, quota }, { status: 429 });
    }

    // Verificar se a API key está configurada
    if (!openai) {
      return NextResponse.json(
        { 
          error: "Diagnóstico com IA não disponível",
          message: "A chave da API OpenAI não está configurada. Adicione OPENAI_API_KEY no arquivo .env.local para habilitar esta funcionalidade."
        },
        { status: 503 }
      );
    }

    const vehicleDetails = vehicleInfo 
      ? `\n\nInformações do veículo:\n- Marca: ${vehicleInfo.brand || "Não informado"}\n- Modelo: ${vehicleInfo.model || "Não informado"}\n- Ano: ${vehicleInfo.year || "Não informado"}\n- Quilometragem: ${vehicleInfo.km ? `${vehicleInfo.km} km` : "Não informado"}`
      : "";

    const prompt = `Você é um mecânico especialista com 30 anos de experiência em diagnóstico automotivo. 
Analise os sintomas descritos abaixo e forneça um diagnóstico profissional e detalhado.
${vehicleDetails}

Sintomas relatados:
${symptoms}

Por favor, forneça sua análise no seguinte formato:

**DIAGNÓSTICOS PROVÁVEIS:**
Liste os 3 diagnósticos mais prováveis, do mais provável ao menos provável, com uma breve explicação de cada um.

**GRAVIDADE:**
Indique se o problema é de gravidade BAIXA, MÉDIA ou ALTA.

**RECOMENDAÇÕES DE REPARO:**
Liste as ações recomendadas para resolver o problema, em ordem de prioridade.

**ESTIMATIVA DE CUSTO:**
Forneça uma faixa de custo aproximado em reais (R$) para o reparo.

**SEGURANÇA:**
Indique claramente se é SEGURO ou NÃO SEGURO continuar dirigindo o veículo nessas condições.

**OBSERVAÇÕES ADICIONAIS:**
Qualquer informação adicional relevante ou dicas de manutenção preventiva.

Responda em português brasileiro de forma clara, profissional e objetiva.`;

    console.log("🤖 Enviando request para OpenAI...");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um mecânico especialista em diagnóstico automotivo. Seja preciso, claro e profissional em suas análises."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const diagnosis = completion.choices[0].message.content;

    console.log("✅ Diagnóstico gerado com sucesso");

    // Extrair informações estruturadas do diagnóstico
    const severityMatch = diagnosis?.match(/gravidade[:\s]*(baixa|média|alta)/i);
    const severity = severityMatch ? severityMatch[1].toLowerCase() : null;

    const safeMatch = diagnosis?.match(/(?:é\s+)?(seguro|não\s+seguro)/i);
    const safeToDrive = safeMatch ? !safeMatch[1].toLowerCase().includes("não") : null;

    const costMatch = diagnosis?.match(/R\$\s*[\d.,]+(?:\s*[-a-záàâãéèêíïóôõöúçñ\s]+R\$\s*[\d.,]+)?/i);
    const estimatedCost = costMatch ? costMatch[0] : null;

    return NextResponse.json({
      success: true,
      diagnosis,
      metadata: {
        severity: severity === "baixa" ? "low" : severity === "média" ? "medium" : severity === "alta" ? "high" : null,
        safeToDrive,
        estimatedCost,
        model: "gpt-4o-mini",
      }
    });
  } catch (error: any) {
    console.error("❌ Erro ao gerar diagnóstico:", error);
    
    // Erro específico da OpenAI
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "Cota da API OpenAI excedida. Entre em contato com o suporte." },
        { status: 429 }
      );
    }

    if (error.code === "invalid_api_key") {
      return NextResponse.json(
        { error: "Chave da API OpenAI inválida." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Erro ao gerar diagnóstico" },
      { status: 500 }
    );
  }
}

