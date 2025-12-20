"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Car, FileText, TrendingUp, Loader2, Package, Calendar, DollarSign, AlertTriangle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

export default function DashboardPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
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
      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (workshopError) throw workshopError;

      // Buscar estatísticas usando a view
      const { data: stats, error: statsError } = await supabase
        .from("dashboard_stats")
        .select("*")
        .eq("workshop_id", workshop.id)
        .single();

      if (statsError) {
        // Se a view não existir, buscar manualmente
        const [clientsRes, vehiclesRes, ordersRes, appointmentsRes, inventoryRes] = await Promise.all([
          supabase.from("clients").select("id", { count: "exact", head: true }).eq("workshop_id", workshop.id),
          supabase.from("vehicles").select("id", { count: "exact", head: true }).eq("client_id", { in: await supabase.from("clients").select("id").eq("workshop_id", workshop.id).then(r => r.data?.map(c => c.id) || []) }),
          supabase.from("service_orders").select("*").eq("workshop_id", workshop.id),
          supabase.from("appointments").select("*").eq("workshop_id", workshop.id).eq("date", format(new Date(), "yyyy-MM-dd")),
          supabase.from("inventory").select("*").eq("workshop_id", workshop.id),
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
          revenueByMonth: await getRevenueByMonth(workshop.id),
        });
      } else {
        // Usar dados da view
        const [ordersRes, appointmentsRes] = await Promise.all([
          supabase.from("service_orders").select("*").eq("workshop_id", workshop.id).order("created_at", { ascending: false }).limit(5),
          supabase.from("appointments").select("*").eq("workshop_id", workshop.id).eq("date", format(new Date(), "yyyy-MM-dd")).limit(5),
        ]);

        const allOrders = await supabase.from("service_orders").select("*").eq("workshop_id", workshop.id);

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
          revenueByMonth: await getRevenueByMonth(workshop.id),
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta, {profile?.name}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/oficina/ordens")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova OS
          </Button>
          <Button variant="outline" onClick={() => router.push("/oficina/clientes")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/oficina/clientes")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data?.totalClients || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Total cadastrados</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/oficina/veiculos")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Veículos
            </CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data?.totalVehicles || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Total cadastrados</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/oficina/ordens")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              OS do Mês
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data?.completedOrdersThisMonth || 0}/{data?.ordersThisMonth || 0}
            </div>
            <p className="text-xs text-gray-600 mt-1">Concluídas / Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Faturamento
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {(data?.revenueThisMonth || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-gray-600 mt-1">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/oficina/agenda")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Agendamentos Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data?.appointmentsToday || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Para hoje</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push("/oficina/estoque")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Estoque Baixo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data?.lowStockItems || 0}</div>
            <p className="text-xs text-gray-600 mt-1">Itens precisam reposição</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Faturamento */}
        <Card>
          <CardHeader>
            <CardTitle>Faturamento (Últimos 6 Meses)</CardTitle>
            <CardDescription>Receita de ordens concluídas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    (value || 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  }
                />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Faturamento" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - OS por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço por Status</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data?.ordersByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.status}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                >
                  {(data?.ordersByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas OS */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Ordens de Serviço</CardTitle>
            <CardDescription>5 mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.recentOrders || []).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma OS cadastrada</p>
            ) : (
              <div className="space-y-3">
                {(data?.recentOrders || []).map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push("/oficina/ordens")}
                  >
                    <div>
                      <p className="font-medium text-sm">OS #{order.order_number}</p>
                      <p className="text-xs text-gray-600">
                        {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "in_progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
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
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos de Hoje</CardTitle>
            <CardDescription>Próximos atendimentos</CardDescription>
          </CardHeader>
          <CardContent>
            {(data?.recentAppointments || []).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nenhum agendamento hoje</p>
            ) : (
              <div className="space-y-3">
                {(data?.recentAppointments || []).map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => router.push("/oficina/agenda")}
                  >
                    <div>
                      <p className="font-medium text-sm">{appointment.title}</p>
                      <p className="text-xs text-gray-600">{appointment.start_time}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
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
