"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { StatCard } from "@/components/dashboard/StatCard";
import { StarRating } from "@/components/ui/StarRating";
import { 
  FileText, 
  Users, 
  DollarSign, 
  Wrench, 
  Plus,
  Car,
  Calendar,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle2,
  Crown,
  ArrowRight,
  Sparkles,
  Loader2,
  Building2,
  ClipboardList,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { OnboardingModal } from "@/components/ui/OnboardingModal";

interface RecentActivity {
  id: string;
  type: 'order' | 'quote' | 'client';
  title: string;
  description: string;
  time: string;
  status?: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  actionLink?: string;
}

export default function OficinaDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    quotes: 0,
    clients: 0,
    revenue: 0,
    orders: 0
  });
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [trends, setTrends] = useState({
    quotes: { value: 0, positive: true },
    clients: { value: 0, positive: true },
    revenue: { value: 0, positive: true },
    orders: { value: 0, positive: true }
  });
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [forceLoaded, setForceLoaded] = useState(false);
  const supabase = createClient();

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((authLoading || loading) && !forceLoaded) {
        setForceLoaded(true);
        setLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [authLoading, loading, forceLoaded]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", user.id)
        .single()
        .then(({ data }) => {
          if (!data) {
            router.push("/completar-cadastro");
          } else {
            setWorkshop(data);
          }
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (workshop) {
      loadStats();
    }
  }, [workshop]);

  const loadStats = async () => {
    if (!workshop) return;

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Buscar orçamentos pendentes (mês atual vs anterior)
      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .eq("status", "pending");

      const { count: lastMonthQuotes } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .gte("created_at", startOfLastMonth.toISOString())
        .lte("created_at", endOfLastMonth.toISOString());

      // Buscar total de clientes
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id);

      const { count: lastMonthClients } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .lte("created_at", endOfLastMonth.toISOString());

      // Buscar ordens de serviço do mês
      const { data: orders } = await supabase
        .from("service_orders")
        .select("total, created_at")
        .eq("workshop_id", workshop.id)
        .gte("created_at", startOfMonth.toISOString());

      const { data: lastMonthOrders } = await supabase
        .from("service_orders")
        .select("total")
        .eq("workshop_id", workshop.id)
        .gte("created_at", startOfLastMonth.toISOString())
        .lte("created_at", endOfLastMonth.toISOString());

      const revenue = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
      const lastMonthRevenue = lastMonthOrders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

      // Calcular trends
      const calculateTrend = (current: number, previous: number) => {
        if (previous === 0) return { value: 0, positive: true };
        const change = ((current - previous) / previous) * 100;
        return { value: Math.round(Math.abs(change)), positive: change >= 0 };
      };

      setStats({
        quotes: quotesCount || 0,
        clients: clientsCount || 0,
        revenue,
        orders: orders?.length || 0
      });

      setTrends({
        quotes: calculateTrend(quotesCount || 0, lastMonthQuotes || 0),
        clients: calculateTrend(clientsCount || 0, lastMonthClients || 0),
        revenue: calculateTrend(revenue, lastMonthRevenue),
        orders: calculateTrend(orders?.length || 0, lastMonthOrders?.length || 0)
      });

      // Gerar dados do gráfico (últimos 7 dias)
      await loadRevenueChart();

      // Carregar atividades recentes
      await loadRecentActivities();

      // Carregar alertas
      await loadAlerts();

      // Carregar avaliações recentes
      await loadRecentReviews();

    } catch (error) {
      console.error("Erro ao carregar stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadRecentReviews = async () => {
    if (!workshop) return;

    try {
      const { data } = await supabase
        .from("reviews")
        .select(`
          *,
          motorist:motorists(profile_id),
          profile:profiles(name, email)
        `)
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false })
        .limit(3);

      setRecentReviews(data || []);
      console.log("⭐ [Dashboard] Avaliações recentes:", data?.length || 0);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    }
  };

  const loadRevenueChart = async () => {
    if (!workshop) return;

    try {
      const days = [];
      const now = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const { data } = await supabase
          .from("service_orders")
          .select("total")
          .eq("workshop_id", workshop.id)
          .gte("created_at", date.toISOString())
          .lt("created_at", nextDay.toISOString());

        const total = data?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

        days.push({
          day: format(date, "EEE", { locale: ptBR }),
          value: total
        });
      }

      setRevenueChart(days);
    } catch (error) {
      console.error("Erro ao carregar gráfico:", error);
    }
  };

  const loadRecentActivities = async () => {
    if (!workshop) return;

    try {
      const activities: RecentActivity[] = [];

      // Últimas 3 OS
      const { data: orders } = await supabase
        .from("service_orders")
        .select("id, order_number, status, created_at, clients(name)")
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false })
        .limit(3);

      orders?.forEach((order: any) => {
        activities.push({
          id: order.id,
          type: 'order',
          title: `OS ${order.order_number}`,
          description: order.clients?.name || 'Cliente não especificado',
          time: order.created_at,
          status: order.status
        });
      });

      // Últimos 2 orçamentos
      const { data: quotes } = await supabase
        .from("quotes")
        .select("id, service_type, status, created_at")
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false })
        .limit(2);

      quotes?.forEach((quote: any) => {
        activities.push({
          id: quote.id,
          type: 'quote',
          title: 'Novo orçamento',
          description: quote.service_type,
          time: quote.created_at,
          status: quote.status
        });
      });

      // Ordenar por data
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
    }
  };

  const loadAlerts = async () => {
    if (!workshop) return;

    try {
      const newAlerts: Alert[] = [];

      // Verificar orçamentos pendentes
      const { count: pendingQuotes } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .eq("status", "pending");

      if (pendingQuotes && pendingQuotes > 0) {
        newAlerts.push({
          id: 'pending-quotes',
          type: 'warning',
          title: `${pendingQuotes} orçamento${pendingQuotes > 1 ? 's' : ''} pendente${pendingQuotes > 1 ? 's' : ''}`,
          description: 'Responda aos orçamentos para não perder clientes',
          action: 'Ver orçamentos',
          actionLink: '/oficina/orcamentos'
        });
      }

      // Verificar estoque baixo
      const { data: lowStock } = await supabase
        .from("inventory")
        .select("id, name, quantity, min_quantity")
        .eq("workshop_id", workshop.id)
        .lte("quantity", supabase.rpc("get_min_quantity"));

      const lowStockCount = lowStock?.filter(item => item.quantity <= item.min_quantity).length || 0;

      if (lowStockCount > 0) {
        newAlerts.push({
          id: 'low-stock',
          type: 'warning',
          title: `${lowStockCount} ${lowStockCount > 1 ? 'peças' : 'peça'} com estoque baixo`,
          description: 'Reponha o estoque para evitar atrasos',
          action: 'Ver estoque',
          actionLink: '/oficina/estoque'
        });
      }

      // Verificar plano FREE
      if (workshop.plan_type === 'free') {
        newAlerts.push({
          id: 'upgrade-plan',
          type: 'info',
          title: 'Desbloqueie todo o potencial',
          description: 'Faça upgrade para PRO e tenha recursos ilimitados',
          action: 'Ver planos',
          actionLink: '/oficina/planos'
        });
      }

      setAlerts(newAlerts);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
    }
  };

  if ((authLoading || loading) && !forceLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!workshop && !forceLoaded) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return Wrench;
      case 'quote': return FileText;
      case 'client': return Users;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-yellow-600 bg-yellow-100';
      case 'quote': return 'text-blue-600 bg-blue-100';
      case 'client': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const badges: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
      responded: { label: 'Respondido', color: 'bg-green-100 text-green-800' },
    };

    const badge = badges[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <Badge className={`${badge.color} border-0 text-xs`}>
        {badge.label}
      </Badge>
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle2;
      default: return Sparkles;
    }
  };

  // Onboarding steps
  const oficinaSteps = [
    {
      title: "Bem-vindo ao Instauto!",
      description: "Vamos te mostrar como usar a plataforma para gerenciar sua oficina e atrair mais clientes.",
      icon: <Wrench className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Complete seu Perfil",
      description: "Adicione logo, endereço e especialidades da sua oficina para atrair mais clientes.",
      icon: <Building2 className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Cadastre Clientes",
      description: "Organize seus clientes e mantenha histórico completo de todos os serviços realizados.",
      icon: <Users className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Receba Orçamentos",
      description: "Motoristas vão solicitar orçamentos. Responda rápido para fechar mais serviços!",
      icon: <FileText className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Crie Ordens de Serviço",
      description: "Registre serviços, gere PDFs profissionais e mantenha tudo organizado.",
      icon: <ClipboardList className="w-10 h-10 text-blue-600" />
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'success': return 'border-green-200 bg-green-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <>
      {/* Onboarding Modal */}
      <OnboardingModal steps={oficinaSteps} storageKey="onboarding_oficina_done" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="p-4 sm:p-4 sm:p-6 lg:p-8">
          {/* Header padrão */}
          <div className="mb-4 sm:mb-6">
            <p className="text-xs text-gray-500 mb-1">Dashboard</p>
            <h1 className="text-lg sm:text-base sm:text-lg lg:text-2xl font-bold text-gray-900">
              Bem-vindo de volta, {workshop?.name || 'Oficina'}! 👋
          </h1>
        </div>

        {/* Stats Cards - Compactos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <StatCard
            title="Orçamentos Pendentes"
            value={stats.quotes}
            description={stats.quotes === 0 ? "Nenhum pendente" : `${stats.quotes} aguardando resposta`}
            icon={FileText}
            color="blue"
            trend={trends.quotes}
            loading={statsLoading}
          />
          <StatCard
            title="Total de Clientes"
            value={stats.clients}
            description={stats.clients === 0 ? "Nenhum cliente" : "clientes cadastrados"}
            icon={Users}
            color="green"
            trend={trends.clients}
            loading={statsLoading}
          />
          <StatCard
            title="Receita do Mês"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            description="Faturamento mensal"
            icon={DollarSign}
            color="yellow"
            trend={trends.revenue}
            loading={statsLoading}
          />
          <StatCard
            title="OS do Mês"
            value={stats.orders}
            description={stats.orders === 0 ? "Nenhuma OS" : "ordens de serviço"}
            icon={Wrench}
            color="purple"
            trend={trends.orders}
            loading={statsLoading}
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-4 sm:mb-6 lg:mb-4 sm:mb-6 lg:mb-8 border-2 shadow-lg">
          <CardHeader className="p-4 sm:p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesse rapidamente as funcionalidades mais usadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/oficina/ordens">
                <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-600/30">
                  <Wrench className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-bold">Nova OS</span>
                </Button>
              </Link>
              
              <Link href="/oficina/clientes">
                <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-600/30">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-bold">Novo Cliente</span>
                </Button>
              </Link>
              
              <Link href="/oficina/veiculos">
                <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/30">
                  <Car className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-bold">Novo Veículo</span>
                </Button>
              </Link>
              
              <Link href="/oficina/agenda">
                <Button className="w-full h-24 flex flex-col gap-2 bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 shadow-lg shadow-yellow-500/30">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="font-bold">Agendar</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Destaque: Diagnóstico IA + Agenda */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8">
          {/* Diagnóstico IA */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="p-2.5 md:p-3 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">Diagnóstico com IA</h3>
                <p className="text-blue-100 text-xs md:text-sm">Em breve</p>
              </div>
            </div>
            <p className="text-blue-100 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">
              Use inteligência artificial para diagnosticar problemas dos veículos 
              a partir de fotos e descrições dos clientes.
            </p>
            <button 
              disabled
              className="w-full py-2.5 md:py-3 bg-white/20 backdrop-blur-sm rounded-lg text-xs md:text-sm font-medium cursor-not-allowed hover:bg-white/25 transition-colors"
            >
              🔒 Disponível em breve
            </button>
          </div>

          {/* Agenda de Hoje */}
          <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base md:text-lg">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                Agenda de Hoje
              </h3>
              <span className="text-xs md:text-sm text-gray-500">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>
            
            {/* Placeholder - sem agendamentos */}
            <div className="text-center py-6 md:py-8 text-gray-500">
              <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
              <p className="text-xs md:text-sm">Nenhum agendamento para hoje</p>
              <p className="text-[10px] md:text-xs text-gray-400 mt-1">Em breve: sistema de agendamentos</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart + Recent Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Revenue Chart */}
            <Card className="border-2 shadow-lg">
              <CardHeader className="p-4 sm:p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  Receita dos Últimos 7 Dias
                </CardTitle>
                <CardDescription>
                  Acompanhe o faturamento diário da sua oficina
                </CardDescription>
              </CardHeader>
              <CardContent>
                {revenueChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={revenueChart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#6b7280"
                        style={{ fontSize: '11px' }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: '11px' }}
                        tickFormatter={(value) => `R$ ${value}`}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[180px] flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <TrendingUp className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Nenhuma receita nos últimos 7 dias</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews Card */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 fill-yellow-500" />
                      Avaliações
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      O que seus clientes estão dizendo
                    </CardDescription>
                  </div>
                  {workshop?.rating && (
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                        {workshop.rating.toFixed(1)}
                      </div>
                      <StarRating
                        rating={workshop.rating}
                        size="sm"
                        showCount={true}
                        count={workshop.reviews_count || 0}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {review.profile?.name?.charAt(0) || review.profile?.email?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {review.profile?.name || review.profile?.email?.split("@")[0] || "Cliente"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(review.created_at), "dd/MM/yyyy", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                        )}
                      </div>
                    ))}
                    <Link href="/oficina/avaliacoes">
                      <Button variant="outline" className="w-full">
                        Ver todas as avaliações
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500 mb-2">Nenhuma avaliação ainda</p>
                    <p className="text-xs text-gray-400">
                      Suas avaliações aparecerão aqui quando os clientes avaliarem seus serviços
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Últimas movimentações na sua oficina
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      const colorClass = getActivityColor(activity.type);
                      
                      return (
                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-colors">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} flex-shrink-0`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-900">{activity.title}</p>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {format(new Date(activity.time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">Nenhuma atividade recente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alerts Sidebar - Com Glassmorphism */}
          <div className="space-y-4 md:space-y-6">
            {alerts.length > 0 ? (
              alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const colorClass = getAlertColor(alert.type);
                
                return (
                  <Card key={alert.id} className={`border-2 ${colorClass} bg-white/80 backdrop-blur-sm shadow-lg`}>
                    <CardHeader className="pb-3 p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                        {alert.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4">
                        {alert.description}
                      </p>
                      {alert.action && alert.actionLink && (
                        <Link href={alert.actionLink}>
                          <Button 
                            variant="outline" 
                            className="w-full border-2 font-bold group text-xs md:text-sm h-9 md:h-10"
                          >
                            {alert.action}
                            <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="border-2 border-green-200 bg-green-50/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg text-green-900">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                    Tudo em ordem!
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <p className="text-xs md:text-sm text-green-800">
                    Não há alertas no momento. Continue o ótimo trabalho!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Upgrade Banner */}
            {workshop?.plan_type === 'free' && (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-purple-900">
                    <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    Desbloqueie o Poder Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4 text-sm text-purple-800">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Clientes ilimitados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      OS ilimitadas
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Relatórios avançados
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      Suporte prioritário
                    </li>
                  </ul>
                  <Link href="/oficina/planos">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold shadow-lg shadow-purple-600/30">
                      <Crown className="mr-2 h-4 w-4" />
                      Fazer Upgrade Agora
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
