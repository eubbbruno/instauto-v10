"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanGuard } from "@/components/auth/PlanGuard";
import { FileText, Download, Calendar, DollarSign, TrendingUp, Package, Users, FileSpreadsheet } from "lucide-react";

export default function RelatoriosPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (reportType: string) => {
    setGenerating(reportType);
    // Simulação de geração de relatório
    setTimeout(() => {
      setGenerating(null);
      alert(`Relatório "${reportType}" gerado com sucesso! (Em desenvolvimento)`);
    }, 1500);
  };

  const reports = [
    {
      id: "financial",
      title: "Relatório Financeiro",
      description: "Receitas, despesas e lucro por período",
      icon: <DollarSign className="h-6 w-6" />,
      color: "from-green-500 to-green-600",
      shadow: "shadow-green-500/30",
    },
    {
      id: "services",
      title: "Relatório de Serviços",
      description: "Ordens de serviço concluídas e em andamento",
      icon: <FileText className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30",
    },
    {
      id: "inventory",
      title: "Relatório de Estoque",
      description: "Movimentação de peças e produtos",
      icon: <Package className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/30",
    },
    {
      id: "clients",
      title: "Relatório de Clientes",
      description: "Clientes ativos e histórico de serviços",
      icon: <Users className="h-6 w-6" />,
      color: "from-yellow-500 to-yellow-600",
      shadow: "shadow-yellow-500/30",
    },
    {
      id: "performance",
      title: "Relatório de Performance",
      description: "Métricas e indicadores de desempenho",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-red-500 to-red-600",
      shadow: "shadow-red-500/30",
    },
    {
      id: "custom",
      title: "Relatório Personalizado",
      description: "Crie relatórios customizados",
      icon: <FileSpreadsheet className="h-6 w-6" />,
      color: "from-indigo-500 to-indigo-600",
      shadow: "shadow-indigo-500/30",
    },
  ];

  return (
    <PlanGuard>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Relatórios
              </h1>
              <p className="text-gray-600">
                Gere relatórios detalhados em PDF ou Excel
              </p>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-heading">Filtros Rápidos</CardTitle>
            <CardDescription>Selecione o período para os relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {["Hoje", "Esta Semana", "Este Mês", "Últimos 3 Meses", "Este Ano", "Personalizado"].map((period) => (
                <Button
                  key={period}
                  variant="outline"
                  className="border-2"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="border-2 hover:shadow-xl transition-all group">
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg ${report.shadow}`}>
                  {report.icon}
                </div>
                <CardTitle className="text-xl font-heading">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => handleGenerate(report.title)}
                  disabled={generating === report.title}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold"
                >
                  {generating === report.title ? (
                    <>Gerando...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Gerar PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleGenerate(report.title + " (Excel)")}
                  disabled={generating === report.title + " (Excel)"}
                  className="w-full border-2"
                >
                  {generating === report.title + " (Excel)" ? (
                    <>Gerando...</>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Gerar Excel
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Relatórios Profissionais</h3>
                <p className="text-sm text-gray-700">
                  Todos os relatórios incluem gráficos, tabelas detalhadas e são exportados em formato 
                  profissional. Perfeito para análises, reuniões e apresentações.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlanGuard>
  );
}

