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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Olá, {workshop?.name || 'Oficina'}! 👋
                </h1>
              </div>
            </div>
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            title="Orçamentos"
            value={stats.quotes}
            description={stats.quotes === 0 ? "Nenhum pendente" : "pendentes"}
            icon={FileText}
            color="blue"
            trend={trends.quotes}
            loading={statsLoading}
          />
          <StatCard
            title="Clientes"
            value={stats.clients}
            description="cadastrados"
            icon={Users}
            color="blue"
            trend={trends.clients}
            loading={statsLoading}
          />
          <StatCard
            title="Receita"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            description="este mês"
            icon={DollarSign}
            color="blue"
            trend={trends.revenue}
            loading={statsLoading}
          />
          <StatCard
            title="OS"
            value={stats.orders}
            description="este mês"
            icon={Wrench}
            color="blue"
            trend={trends.orders}
            loading={statsLoading}
          />
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Coluna Principal - 2/3 */}
          <div className="lg:col-span-2 space-y-4">
            {/* Orçamentos Pendentes */}
            {stats.quotes > 0 && (
              <div className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/50 transition-all duration-300 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Orçamentos Pendentes
                  </h2>
                  <Link 
                    href="/oficina/orcamentos"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentActivities
                    .filter(a => a.type === 'quote' && a.status === 'pending')
                    .slice(0, 3)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {format(new Date(activity.time), "HH:mm")}
                        </span>
                      </div>
                    ))}
                  {recentActivities.filter(a => a.type === 'quote' && a.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Nenhum orçamento pendente</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gráfico de Receita */}
            <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 hidden sm:block">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Receita dos Últimos 7 Dias
              </h2>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Receita']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            {/* Diagnóstico IA Premium */}
            <Link href="/oficina/diagnostico" className="block group">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base">Diagnóstico com IA</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                  Analise problemas de veículos com inteligência artificial
                </p>
                <div className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-sm font-semibold text-center group-hover:bg-blue-50 transition-colors">
                  Iniciar Diagnóstico
                </div>
              </div>
            </Link>

            {/* Agenda Premium */}
            <div className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Agenda de Hoje
                </h3>
                <span className="text-xs text-gray-500">
                  {format(new Date(), "dd/MM")}
                </span>
              </div>
              <div className="text-center py-6 text-gray-500">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-xs">Nenhum agendamento</p>
                <p className="text-[10px] text-gray-400 mt-1">Em breve</p>
              </div>
            </div>

            {/* Avaliações Resumo Premium */}
            {workshop && (
              <div className="group bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        {workshop.rating?.toFixed(1) || "0.0"}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">
                        ({workshop.reviews_count || 0})
                      </span>
                    </div>
                  </div>
                  <Link 
                    href="/oficina/avaliacoes" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todas
                  </Link>
                </div>
                {recentReviews.length > 0 ? (
                  <div className="space-y-2">
                    {recentReviews.slice(0, 2).map((review: any) => (
                      <div key={review.id} className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {review.motorist_name}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">
                    Ainda não há avaliações
                  </p>
                )}
              </div>
            )}

            {/* Card PRO (apenas se FREE) */}
            {workshop?.plan_type === "free" && (
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-bold text-base text-gray-900">Upgrade PRO</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Orçamentos ilimitados, destaque na busca e mais recursos
                </p>
                <Link 
                  href="/oficina/planos"
                  className="block w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold text-center hover:bg-blue-700 transition-colors"
                >
                  Ver Planos
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Alertas (se houver) */}
        {alerts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Alertas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {alerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                const colorClass = getAlertColor(alert.type);
                
                return (
                  <div 
                    key={alert.id} 
                    className={`border-2 ${colorClass} rounded-xl p-4 shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {alert.title}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {alert.description}
                        </p>
                        {alert.actionLink && (
                          <Link
                            href={alert.actionLink}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            {alert.action} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

