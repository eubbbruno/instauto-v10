"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, FileText, TrendingUp, Loader2 } from "lucide-react";

interface Stats {
  total_clients: number;
  total_vehicles: number;
  total_service_orders: number;
  pending_orders: number;
  in_progress_orders: number;
  completed_orders: number;
  total_revenue: number;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from("workshop_stats")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo de volta, {profile?.name}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Clientes"
          value={stats?.total_clients || 0}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Total de clientes cadastrados"
        />
        <StatCard
          title="Veículos"
          value={stats?.total_vehicles || 0}
          icon={<Car className="h-6 w-6 text-green-600" />}
          description="Veículos cadastrados"
        />
        <StatCard
          title="Ordens de Serviço"
          value={stats?.total_service_orders || 0}
          icon={<FileText className="h-6 w-6 text-orange-600" />}
          description="Total de OS criadas"
        />
        <StatCard
          title="Faturamento"
          value={`R$ ${(stats?.total_revenue || 0).toFixed(2)}`}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          description="Receita total"
        />
      </div>

      {/* Orders Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {stats?.pending_orders || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Aguardando início</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.in_progress_orders || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Sendo executadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {stats?.completed_orders || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionButton href="/oficina/clientes">
              Adicionar Cliente
            </QuickActionButton>
            <QuickActionButton href="/oficina/veiculos">
              Cadastrar Veículo
            </QuickActionButton>
            <QuickActionButton href="/oficina/ordens">
              Nova Ordem de Serviço
            </QuickActionButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

function QuickActionButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      {children}
    </a>
  );
}

