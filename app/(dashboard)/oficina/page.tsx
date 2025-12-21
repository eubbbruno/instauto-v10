"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Car, FileText, TrendingUp, Loader2, Package, Calendar, DollarSign, AlertTriangle, Plus, ArrowUpRight, Sparkles, Crown, Lock, Settings, Zap, Shield, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Workshop } from "@/types/database";

interface DashboardData {
  totalClients: number;
  totalVehicles: number;
  ordersThisMonth: number;
  completedOrdersThisMonth: number;
  revenueThisMonth: number;
  appointmentsToday: number;
  lowStockItems: number;
  recentOrders: any[];
  recentAppointments: any[];
  ordersByStatus: { status: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

const COLORS = ["#2563EB", "#FBBF24", "#10B981", "#EF4444"];

export default function DashboardPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar workshop
      const { data: workshopData, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (workshopError) throw workshopError;
      setWorkshop(workshopData);

      // Verificar se tem acesso PRO
      const isPro = workshopData.plan_type === "pro" && workshopData.subscription_status === "active";
      const isTrialActive = workshopData.trial_ends_at && new Date(workshopData.trial_ends_at) > new Date();
      const hasProAccess = isPro || isTrialActive;

      // Se não tem acesso PRO, não carrega dados de gestão
      if (!hasProAccess) {
        setLoading(false);
        return;
      }

      // Buscar estatísticas usando a view
      const { data: stats, error: statsError } = await supabase
        .from("dashboard_stats")
        .select("*")
        .eq("workshop_id", workshopData.id)
        .single();

      if (statsError) {
        // Se a view não existir, buscar manualmente
        const [clientsRes, vehiclesRes, ordersRes, appointmentsRes, inventoryRes] = await Promise.all([
          supabase.from("clients").select("id", { count: "exact", head: true }).eq("workshop_id", workshopData.id),
          supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("client_id", { in: await supabase.from("clients").select("id").eq("workshop_id", workshopData.id).then(r => r.data?.map(c => c.id) || []) }),
          supabase.from("service_orders").select("*").eq("workshop_id", workshopData.id),
          supabase.from("appointments").select("*").eq("workshop_id", workshopData.id).eq("date", format(new Date(), "yyyy-MM-dd")),
          supabase.from("inventory").select("*").eq("workshop_id", workshopData.id),
        ]);

        const orders = ordersRes.data || [];
        const now = new Date();
        const thisMonthOrders = orders.filter(o => new Date(o.created_at).getMonth() === now.getMonth());
        
        setData({
          totalClients: clientsRes.count || 0,
          totalVehicles: vehiclesRes.count || 0,
          ordersThisMonth: thisMonthOrders.length,
          completedOrdersThisMonth: thisMonthOrders.filter(o => o.status === "completed").length,
          revenueThisMonth: thisMonthOrders.filter(o => o.status === "completed").reduce((sum, o) => sum + (o.total || 0), 0),
          appointmentsToday: appointmentsRes.data?.length || 0,
          lowStockItems: (inventoryRes.data || []).filter((item: any) => item.quantity <= item.min_quantity).length,
          recentOrders: orders.slice(0, 5),
          recentAppointments: appointmentsRes.data?.slice(0, 5) || [],
          ordersByStatus: getOrdersByStatus(orders),
          revenueByMonth: await getRevenueByMonth(workshopData.id),
        });
      } else {
        // Usar dados da view
        const [ordersRes, appointmentsRes] = await Promise.all([
          supabase.from("service_orders").select("*").eq("workshop_id", workshopData.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("appointments").select("*").eq("workshop_id", workshopData.id).eq("date", format(new Date(), "yyyy-MM-dd")).limit(5),
        ]);

        const allOrders = await supabase.from("service_orders").select("*").eq("workshop_id", workshopData.id);

        setData({
          totalClients: stats.total_clients,
          totalVehicles: stats.total_vehicles,
          ordersThisMonth: stats.orders_this_month,
          completedOrdersThisMonth: stats.completed_orders_this_month,
          revenueThisMonth: stats.revenue_this_month,
          appointmentsToday: stats.appointments_today,
          lowStockItems: stats.low_stock_items,
          recentOrders: ordersRes.data || [],
          recentAppointments: appointmentsRes.data || [],
          ordersByStatus: getOrdersByStatus(allOrders.data || []),
          revenueByMonth: await getRevenueByMonth(workshopData.id),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOrdersByStatus = (orders: any[]) => {
    const statusCount = orders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return [
      { status: "Pendente", count: statusCount.pending || 0 },
      { status: "Em Andamento", count: statusCount.in_progress || 0 },
      { status: "Concluída", count: statusCount.completed || 0 },
      { status: "Cancelada", count: statusCount.cancelled || 0 },
    ];
  };

  const getRevenueByMonth = async (workshopId: string) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const { data } = await supabase
        .from("service_orders")
        .select("total")
        .eq("workshop_id", workshopId)
        .eq("status", "completed")
        .gte("created_at", monthStart.toISOString())
        .lte("created_at", monthEnd.toISOString());

      const revenue = (data || []).reduce((sum, order) => sum + (order.total || 0), 0);

      months.push({
        month: format(date, "MMM/yy", { locale: ptBR }),
        revenue,
      });
    }
    return months;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Verificar acesso PRO
  const isPro = workshop?.plan_type === "pro" && workshop?.subscription_status === "active";
  const isTrialActive = workshop?.trial_ends_at && new Date(workshop.trial_ends_at) > new Date();
  const hasProAccess = isPro || isTrialActive;

  // DASHBOARD FREE
  if (!hasProAccess) {
    const trialEnded = workshop?.trial_ends_at && new Date(workshop.trial_ends_at) < new Date();
    const daysAgo = trialEnded ? Math.floor(
      (new Date().getTime() - new Date(workshop.trial_ends_at).getTime()) / (1000 * 60 * 60 * 24)
    ) : 0;

    return (
      <div className="space-y-8">
        <PageHeader
          title={`Bem-vindo, ${workshop?.name || profile?.name}! 👋`}
          description="Configure sua oficina e faça upgrade para o plano PRO para acessar o sistema completo de gestão"
        />

        {/* Status do Plano */}
        <Card className="border-4 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  <Zap className="h-7 w-7" />
                  Plano FREE
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {trialEnded ? (
                    <span className="text-red-600 font-bold">
                      ⚠️ Seu período de teste expirou há {daysAgo} {daysAgo === 1 ? "dia" : "dias"}
                    </span>
                  ) : (
                    "Você está no plano gratuito com acesso limitado"
                  )}
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push("/oficina/planos")}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold shadow-xl shadow-yellow-500/30 h-14 px-8"
              >
                <Crown className="mr-2 h-6 w-6" />
                Fazer Upgrade
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* CTA Principal */}
        <Card className="border-4 border-purple-300 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🚀 Desbloqueie o Sistema Completo de Gestão
            </CardTitle>
            <CardDescription className="text-lg text-gray-700 leading-relaxed">
              Com o <span className="font-bold text-purple-600">Plano PRO</span>, você terá acesso a todas as ferramentas profissionais para gerenciar sua oficina:
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Clientes Ilimitados"
                description="Cadastre e gerencie todos os seus clientes"
              />
              <FeatureCard
                icon={<Car className="h-6 w-6" />}
                title="Veículos Ilimitados"
                description="Controle total do histórico de cada veículo"
              />
              <FeatureCard
                icon={<FileText className="h-6 w-6" />}
                title="OS Ilimitadas"
                description="Crie ordens de serviço sem limites"
              />
              <FeatureCard
                icon={<Package className="h-6 w-6" />}
                title="Estoque Completo"
                description="Gerencie peças e alertas de reposição"
              />
              <FeatureCard
                icon={<DollarSign className="h-6 w-6" />}
                title="Financeiro"
                description="Receitas, despesas e relatórios"
              />
              <FeatureCard
                icon={<Calendar className="h-6 w-6" />}
                title="Agenda"
                description="Calendário completo de agendamentos"
              />
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Relatórios"
                description="Análises e insights do seu negócio"
              />
              <FeatureCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Diagnóstico IA"
                description="Inteligência artificial para diagnósticos"
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="WhatsApp"
                description="Integração e automação de mensagens"
              />
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-purple-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Apenas</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    R$ 97
                  </p>
                  <p className="text-gray-600">/mês</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">✓ 14 dias grátis para testar</p>
                  <p className="text-sm text-gray-600 mb-2">✓ Cancele quando quiser</p>
                  <p className="text-sm text-gray-600">✓ Suporte prioritário</p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/oficina/planos")}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold h-14 text-lg shadow-xl"
              >
                <Crown className="mr-2 h-6 w-6" />
                Começar Teste Grátis de 14 Dias
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Prévia do Dashboard PRO (Blur) */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
            <div className="text-center p-8">
              <Lock className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Completo</h3>
              <p className="text-gray-600 mb-4">Disponível no Plano PRO</p>
              <Button
                onClick={() => router.push("/oficina/planos")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
              >
                <Crown className="mr-2 h-5 w-5" />
                Ver Planos
              </Button>
            </div>
          </div>

          {/* Preview Cards (Blur) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-30">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-gray-600">Clientes</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">127</div>
                <p className="text-sm text-gray-600">Total cadastrados</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-gray-600">Veículos</CardTitle>
                <Car className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">89</div>
                <p className="text-sm text-gray-600">Total cadastrados</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-gray-600">OS do Mês</CardTitle>
                <FileText className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">45</div>
                <p className="text-sm text-gray-600">Concluídas / Total</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-gray-600">Faturamento</CardTitle>
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">R$ 45.890</div>
                <p className="text-sm text-gray-600">Este mês</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group"
            onClick={() => router.push("/oficina/configuracoes")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Settings className="h-6 w-6 text-blue-600" />
                Configurações da Oficina
              </CardTitle>
              <CardDescription>Configure os dados da sua oficina</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full font-bold group-hover:bg-blue-50">
                Acessar Configurações
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group bg-gradient-to-br from-purple-50 to-blue-50"
            onClick={() => router.push("/oficina/planos")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Crown className="h-6 w-6 text-purple-600" />
                Ver Planos e Preços
              </CardTitle>
              <CardDescription>Compare os planos e faça upgrade</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold">
                Ver Planos
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // DASHBOARD PRO (mantém como estava)
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Bem-vindo de volta, <span className="font-bold">{profile?.name}</span>!
          </span>
        }
        action={
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => router.push("/oficina/ordens")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova OS
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push("/oficina/clientes")}
              className="border-2 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        }
      />

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Clientes */}
        <Card 
          className="border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group overflow-hidden relative"
          onClick={() => router.push("/oficina/clientes")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-600">
              Clientes
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {data?.totalClients || 0}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Total cadastrados
              <ArrowUpRight className="h-4 w-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </CardContent>
        </Card>

        {/* Veículos */}
        <Card 
          className="border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group overflow-hidden relative"
          onClick={() => router.push("/oficina/veiculos")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-600">
              Veículos
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <Car className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {data?.totalVehicles || 0}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Total cadastrados
              <ArrowUpRight className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </CardContent>
        </Card>

        {/* OS do Mês */}
        <Card 
          className="border-2 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group overflow-hidden relative"
          onClick={() => router.push("/oficina/ordens")}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-600">
              OS do Mês
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {data?.completedOrdersThisMonth || 0}<span className="text-2xl text-gray-400">/{data?.ordersThisMonth || 0}</span>
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              Concluídas / Total
              <ArrowUpRight className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </CardContent>
        </Card>

        {/* Faturamento */}
        <Card className="border-2 overflow-hidden relative group hover:shadow-xl hover:scale-105 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-500/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-gray-600">
              Faturamento
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl text-gray-900 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-1">
              {(data?.revenueThisMonth || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-sm text-gray-600">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Agendamentos Hoje */}
        <Card 
          className="border-2 cursor-pointer hover:shadow-xl transition-all group"
          onClick={() => router.push("/oficina/agenda")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Agendamentos Hoje</CardTitle>
              <CardDescription>Para hoje</CardDescription>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-blue-600">
              {data?.appointmentsToday || 0}
            </div>
          </CardContent>
        </Card>

        {/* Estoque Baixo */}
        <Card 
          className="border-2 cursor-pointer hover:shadow-xl transition-all group"
          onClick={() => router.push("/oficina/estoque")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Estoque Baixo</CardTitle>
              <CardDescription>Itens precisam reposição</CardDescription>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl text-gray-900 shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-yellow-600">
              {data?.lowStockItems || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Faturamento */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Faturamento</CardTitle>
            <CardDescription>Receita dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.revenueByMonth || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                  formatter={(value) =>
                    (value || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  name="Faturamento"
                  fill="url(#colorRevenue)"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - OS por Status */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Ordens de Serviço</CardTitle>
            <CardDescription>Distribuição por status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data?.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => entry.count > 0 ? `${entry.status}: ${entry.count}` : ''}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {(data?.ordersByStatus || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontWeight: 'bold'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas OS */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Últimas Ordens de Serviço</CardTitle>
            <CardDescription>5 mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.recentOrders || []).length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">Nenhuma OS cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.recentOrders || []).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer border-2 border-transparent hover:border-blue-200 transition-all group"
                    onClick={() => router.push("/oficina/ordens")}
                  >
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        OS #{order.order_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800 border-2 border-green-200"
                          : order.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-200"
                          : "bg-blue-100 text-blue-800 border-2 border-blue-200"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Concluída"
                        : order.status === "in_progress"
                        ? "Em Andamento"
                        : "Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos Agendamentos */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Agendamentos de Hoje</CardTitle>
            <CardDescription>Próximos atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.recentAppointments || []).length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500 font-medium">Nenhum agendamento hoje</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(data?.recentAppointments || []).map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-blue-100 cursor-pointer border-2 border-transparent hover:border-blue-200 transition-all group"
                    onClick={() => router.push("/oficina/agenda")}
                  >
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {appointment.title}
                      </p>
                      <p className="text-sm text-gray-600">{appointment.start_time}</p>
                    </div>
                    <span
                      className={`px-3 py-1.5 text-xs font-bold rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800 border-2 border-blue-200"
                          : "bg-gray-100 text-gray-800 border-2 border-gray-200"
                      }`}
                    >
                      {appointment.status === "confirmed" ? "Confirmado" : "Agendado"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg p-4 border-2 border-purple-100 hover:border-purple-300 transition-all group">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
