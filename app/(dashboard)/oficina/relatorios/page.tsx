"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlanGuard } from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Loader2, FileText, Download, Calendar, Users, Car, Package, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Workshop } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

type ReportType = "revenue" | "clients" | "orders" | "inventory";

interface ReportConfig {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const reportTypes: ReportConfig[] = [
  {
    id: "revenue",
    title: "Faturamento",
    description: "Receitas, despesas e lucro do período",
    icon: <DollarSign className="h-6 w-6" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "clients",
    title: "Clientes",
    description: "Lista completa de clientes cadastrados",
    icon: <Users className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "orders",
    title: "Ordens de Serviço",
    description: "Detalhamento de todas as OS do período",
    icon: <FileText className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "inventory",
    title: "Estoque",
    description: "Inventário completo de peças e alertas",
    icon: <Package className="h-6 w-6" />,
    color: "from-yellow-500 to-orange-600",
  },
];

export default function RelatoriosPage() {
  return (
    <PlanGuard feature="Relatórios">
      <RelatoriosContent />
    </PlanGuard>
  );
}

function RelatoriosContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportType>("revenue");
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (profile) {
      loadWorkshop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const loadWorkshop = async () => {
    try {
      const { data } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (data) {
        setWorkshop(data);
      }
    } catch (error) {
      console.error("Erro ao carregar oficina:", error);
    }
  };

  const generatePDF = async () => {
    if (!workshop) return;

    setGenerating(true);

    try {
      switch (selectedReport) {
        case "revenue":
          await generateRevenueReport();
          break;
        case "clients":
          await generateClientsReport();
          break;
        case "orders":
          await generateOrdersReport();
          break;
        case "inventory":
          await generateInventoryReport();
          break;
      }

      toast({
        title: "Relatório gerado!",
        description: "O download do PDF foi iniciado.",
      });
    } catch (error: any) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao gerar relatório.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generateRevenueReport = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text("RELATÓRIO DE FATURAMENTO", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(workshop?.name || "", 105, 28, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Período: ${format(new Date(startDate), "dd/MM/yyyy")} a ${format(new Date(endDate), "dd/MM/yyyy")}`, 105, 35, { align: "center" });
    
    // Buscar dados
    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("workshop_id", workshop?.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: false });

    const income = transactions?.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0) || 0;
    const expenses = transactions?.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) || 0;
    const profit = income - expenses;

    // Resumo
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("RESUMO FINANCEIRO", 14, 50);
    
    const summaryData = [
      ["Receitas", `R$ ${income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      ["Despesas", `R$ ${expenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
      ["Lucro", `R$ ${profit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
    ];

    autoTable(doc, {
      startY: 55,
      head: [["Descrição", "Valor"]],
      body: summaryData,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 11 },
    });

    // Detalhamento de Receitas
    if (transactions && transactions.filter(t => t.type === "income").length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 55;
      doc.text("RECEITAS", 14, finalY + 15);

      const incomeData = transactions
        .filter(t => t.type === "income")
        .map(t => [
          format(new Date(t.date), "dd/MM/yyyy"),
          t.category,
          t.description,
          `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [["Data", "Categoria", "Descrição", "Valor"]],
        body: incomeData,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 9 },
      });
    }

    // Detalhamento de Despesas
    if (transactions && transactions.filter(t => t.type === "expense").length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 100;
      
      if (finalY > 250) {
        doc.addPage();
        doc.text("DESPESAS", 14, 20);
        var startY = 25;
      } else {
        doc.text("DESPESAS", 14, finalY + 15);
        var startY = finalY + 20;
      }

      const expenseData = transactions
        .filter(t => t.type === "expense")
        .map(t => [
          format(new Date(t.date), "dd/MM/yyyy"),
          t.category,
          t.description,
          `R$ ${t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        ]);

      autoTable(doc, {
        startY,
        head: [["Data", "Categoria", "Descrição", "Valor"]],
        body: expenseData,
        theme: "striped",
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 9 },
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")} - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`relatorio-faturamento-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const generateClientsReport = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("RELATÓRIO DE CLIENTES", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(workshop?.name || "", 105, 28, { align: "center" });
    
    // Buscar dados
    const { data: clients } = await supabase
      .from("clients")
      .select("*")
      .eq("workshop_id", workshop?.id)
      .order("name");

    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("*")
      .in("client_id", clients?.map(c => c.id) || []);

    const { data: orders } = await supabase
      .from("service_orders")
      .select("*")
      .eq("workshop_id", workshop?.id);

    // Estatísticas
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("ESTATÍSTICAS", 14, 45);
    
    const statsData = [
      ["Total de Clientes", `${clients?.length || 0}`],
      ["Total de Veículos", `${vehicles?.length || 0}`],
      ["Total de OS", `${orders?.length || 0}`],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Métrica", "Valor"]],
      body: statsData,
      theme: "grid",
      headStyles: { fillColor: [37, 99, 235] },
    });

    // Lista de Clientes
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text("LISTA DE CLIENTES", 14, finalY + 15);

    const clientsData = clients?.map(c => {
      const clientVehicles = vehicles?.filter(v => v.client_id === c.id).length || 0;
      const clientOrders = orders?.filter(o => o.client_id === c.id).length || 0;
      
      return [
        c.name,
        c.phone || "-",
        c.email || "-",
        `${clientVehicles}`,
        `${clientOrders}`,
      ];
    }) || [];

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Nome", "Telefone", "Email", "Veículos", "OS"]],
      body: clientsData,
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")} - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`relatorio-clientes-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const generateOrdersReport = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("RELATÓRIO DE ORDENS DE SERVIÇO", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(workshop?.name || "", 105, 28, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Período: ${format(new Date(startDate), "dd/MM/yyyy")} a ${format(new Date(endDate), "dd/MM/yyyy")}`, 105, 35, { align: "center" });
    
    // Buscar dados
    const { data: orders } = await supabase
      .from("service_orders")
      .select("*, clients(name), vehicles(brand, model, plate)")
      .eq("workshop_id", workshop?.id)
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .order("created_at", { ascending: false });

    // Estatísticas
    const totalOrders = orders?.length || 0;
    const completedOrders = orders?.filter(o => o.status === "completed").length || 0;
    const totalRevenue = orders?.filter(o => o.status === "completed").reduce((sum, o) => sum + o.total, 0) || 0;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("ESTATÍSTICAS", 14, 50);
    
    const statsData = [
      ["Total de OS", `${totalOrders}`],
      ["OS Concluídas", `${completedOrders}`],
      ["Faturamento Total", `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
    ];

    autoTable(doc, {
      startY: 55,
      head: [["Métrica", "Valor"]],
      body: statsData,
      theme: "grid",
      headStyles: { fillColor: [147, 51, 234] },
    });

    // Lista de OS
    const finalY = (doc as any).lastAutoTable.finalY || 55;
    doc.text("LISTA DE ORDENS DE SERVIÇO", 14, finalY + 15);

    const ordersData = orders?.map(o => {
      const statusMap: any = {
        pending: "Pendente",
        approved: "Aprovado",
        in_progress: "Em Andamento",
        completed: "Concluída",
        cancelled: "Cancelada",
      };

      return [
        o.order_number,
        format(new Date(o.created_at), "dd/MM/yyyy"),
        (o.clients as any)?.name || "-",
        `${(o.vehicles as any)?.brand} ${(o.vehicles as any)?.model}` || "-",
        statusMap[o.status] || o.status,
        `R$ ${o.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      ];
    }) || [];

    autoTable(doc, {
      startY: finalY + 20,
      head: [["Número", "Data", "Cliente", "Veículo", "Status", "Total"]],
      body: ordersData,
      theme: "striped",
      headStyles: { fillColor: [147, 51, 234] },
      styles: { fontSize: 8 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")} - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`relatorio-ordens-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const generateInventoryReport = async () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("RELATÓRIO DE ESTOQUE", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(workshop?.name || "", 105, 28, { align: "center" });
    
    // Buscar dados
    const { data: inventory } = await supabase
      .from("inventory")
      .select("*")
      .eq("workshop_id", workshop?.id)
      .order("name");

    const lowStock = inventory?.filter(i => i.quantity <= i.min_quantity) || [];
    const totalValue = inventory?.reduce((sum, i) => sum + (i.quantity * i.cost_price), 0) || 0;

    // Estatísticas
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("ESTATÍSTICAS", 14, 45);
    
    const statsData = [
      ["Total de Itens", `${inventory?.length || 0}`],
      ["Itens com Estoque Baixo", `${lowStock.length}`],
      ["Valor Total em Estoque", `R$ ${totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Métrica", "Valor"]],
      body: statsData,
      theme: "grid",
      headStyles: { fillColor: [245, 158, 11] },
    });

    // Alertas de Estoque Baixo
    if (lowStock.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 50;
      doc.setTextColor(239, 68, 68);
      doc.text("⚠️ ALERTAS - ESTOQUE BAIXO", 14, finalY + 15);

      const lowStockData = lowStock.map(i => [
        i.name,
        i.code || "-",
        `${i.quantity}`,
        `${i.min_quantity}`,
        i.location || "-",
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [["Nome", "Código", "Qtd Atual", "Qtd Mínima", "Localização"]],
        body: lowStockData,
        theme: "grid",
        headStyles: { fillColor: [239, 68, 68] },
        styles: { fontSize: 9 },
      });
    }

    // Lista Completa
    const finalY = (doc as any).lastAutoTable.finalY || 80;
    
    if (finalY > 250) {
      doc.addPage();
      doc.setTextColor(0, 0, 0);
      doc.text("INVENTÁRIO COMPLETO", 14, 20);
      var startY = 25;
    } else {
      doc.setTextColor(0, 0, 0);
      doc.text("INVENTÁRIO COMPLETO", 14, finalY + 15);
      var startY = finalY + 20;
    }

    const inventoryData = inventory?.map(i => [
      i.name,
      i.code || "-",
      i.category || "-",
      `${i.quantity}`,
      `R$ ${i.cost_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      `R$ ${i.sell_price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
    ]) || [];

    autoTable(doc, {
      startY,
      head: [["Nome", "Código", "Categoria", "Qtd", "Custo", "Venda"]],
      body: inventoryData,
      theme: "striped",
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 8 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")} - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: "center" }
      );
    }

    doc.save(`relatorio-estoque-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  const setQuickPeriod = (months: number) => {
    const end = new Date();
    const start = subMonths(end, months);
    setStartDate(format(startOfMonth(start), "yyyy-MM-dd"));
    setEndDate(format(endOfMonth(end), "yyyy-MM-dd"));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios"
        description="Gere relatórios detalhados em PDF sobre seu negócio"
      />

      {/* Seleção de Tipo de Relatório */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`cursor-pointer transition-all border-2 hover:shadow-xl ${
              selectedReport === report.id
                ? "border-blue-500 shadow-lg"
                : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.color} text-white flex items-center justify-center mb-3 shadow-lg`}>
                {report.icon}
              </div>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription className="text-sm">{report.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Configurações do Relatório */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Configurações do Relatório
          </CardTitle>
          <CardDescription>
            Configure o período e gere o relatório em PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filtros de Período */}
          {(selectedReport === "revenue" || selectedReport === "orders") && (
            <div className="space-y-4">
              <Label>Período</Label>
              
              {/* Botões Rápidos */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickPeriod(0)}
                >
                  Este Mês
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickPeriod(1)}
                >
                  Últimos 2 Meses
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickPeriod(2)}
                >
                  Últimos 3 Meses
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickPeriod(5)}
                >
                  Últimos 6 Meses
                </Button>
              </div>

              {/* Datas Personalizadas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botão Gerar */}
          <Button
            onClick={generatePDF}
            disabled={generating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold h-12 text-lg shadow-lg"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Gerar Relatório em PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Sobre os Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Faturamento:</strong> Mostra receitas, despesas e lucro do período selecionado</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Clientes:</strong> Lista todos os clientes com estatísticas de veículos e OS</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Ordens de Serviço:</strong> Detalhamento de todas as OS do período</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Estoque:</strong> Inventário completo com alertas de estoque baixo</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
