import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { symptoms, vehicleInfo } = await request.json();

    if (!symptoms) {
      return NextResponse.json(
        { error: "Sintomas são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a API key está configurada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "API key da OpenAI não configurada" },
        { status: 500 }
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
      model: "gpt-4",
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
    const safeToD drive = safeMatch ? !safeMatch[1].toLowerCase().includes("não") : null;

    const costMatch = diagnosis?.match(/R\$\s*[\d.,]+(?:\s*[-a-záàâãéèêíïóôõöúçñ\s]+R\$\s*[\d.,]+)?/i);
    const estimatedCost = costMatch ? costMatch[0] : null;

    return NextResponse.json({
      success: true,
      diagnosis,
      metadata: {
        severity: severity === "baixa" ? "low" : severity === "média" ? "medium" : severity === "alta" ? "high" : null,
        safeToD rive,
        estimatedCost,
        model: "gpt-4",
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

