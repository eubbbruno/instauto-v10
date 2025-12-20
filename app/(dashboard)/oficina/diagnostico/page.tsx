"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlanGuard } from "@/components/auth/PlanGuard";
import { Stethoscope, Sparkles, AlertCircle, Loader2, Lightbulb, Wrench, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function DiagnosticoPage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const handleDiagnose = async () => {
    if (!symptoms.trim()) return;

    setLoading(true);
    
    // Simulação de diagnóstico IA (futuramente integrar com OpenAI/Claude)
    setTimeout(() => {
      setDiagnosis({
        problem: "Possível problema no sistema de freios",
        description: "Com base nos sintomas descritos (ruído ao frear, pedal macio), o veículo pode estar com pastilhas de freio desgastadas ou ar no sistema hidráulico.",
        recommendations: [
          "Verificar espessura das pastilhas de freio",
          "Inspecionar discos de freio para desgaste irregular",
          "Verificar nível e condição do fluido de freio",
          "Sangrar o sistema de freios se necessário"
        ],
        estimatedCost: "R$ 350 - R$ 800",
        urgency: "Alta",
        parts: [
          "Pastilhas de freio (jogo)",
          "Fluido de freio DOT 4",
          "Possível troca de discos"
        ]
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <PlanGuard>
      <div className="space-y-8">
        <PageHeader
          title="Diagnóstico com IA"
          description="Descreva os sintomas e receba sugestões de diagnóstico"
        />

        {/* Info Banner */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Assistente Inteligente</h3>
                <p className="text-sm text-gray-700">
                  Nossa IA analisa os sintomas descritos e sugere possíveis problemas, peças necessárias e 
                  estimativa de custo. Use como referência para explicar ao cliente de forma clara e profissional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">Descrever Sintomas</CardTitle>
              <CardDescription>
                Detalhe os problemas relatados pelo cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-sm font-bold text-gray-700">
                  O que o cliente relatou?
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Ex: O carro está fazendo um barulho estranho ao frear, o pedal está macio e às vezes precisa pisar duas vezes..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={8}
                  className="resize-none border-2"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Quanto mais detalhes, melhor será o diagnóstico
                </p>
              </div>

              <Button
                onClick={handleDiagnose}
                disabled={!symptoms.trim() || loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg shadow-blue-600/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Diagnosticar com IA
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">Resultado do Diagnóstico</CardTitle>
              <CardDescription>
                Sugestões baseadas em IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!diagnosis ? (
                <div className="text-center py-12 text-gray-400">
                  <Stethoscope className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">Descreva os sintomas para receber um diagnóstico</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Problem */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h4 className="font-bold text-gray-900">Problema Identificado</h4>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">{diagnosis.problem}</p>
                    <p className="text-sm text-gray-600">{diagnosis.description}</p>
                  </div>

                  {/* Urgency */}
                  <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <span className="text-sm font-bold text-gray-700">Urgência: </span>
                      <span className="text-sm font-bold text-red-600">{diagnosis.urgency}</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-bold text-gray-900">Recomendações</h4>
                    </div>
                    <ul className="space-y-2">
                      {diagnosis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Parts */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900">Peças Necessárias</h4>
                    </div>
                    <ul className="space-y-2">
                      {diagnosis.parts.map((part: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {part}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cost */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-gray-900">Estimativa de Custo</span>
                      </div>
                      <span className="text-xl font-heading font-bold text-blue-600">
                        {diagnosis.estimatedCost}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-2 font-bold"
                    onClick={() => setDiagnosis(null)}
                  >
                    Novo Diagnóstico
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PlanGuard>
  );
}
