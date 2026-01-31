"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { StatCard } from "@/components/dashboard/StatCard";
import { FileText, Users, DollarSign, Wrench } from "lucide-react";

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
  const [statsLoading, setStatsLoading] = useState(true);
  const [forceLoaded, setForceLoaded] = useState(false);
  const supabase = createClient();

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((authLoading || loading) && !forceLoaded) {
        console.error("⚠️ Timeout: loading demorou mais de 10 segundos. Forçando carregamento.");
        setForceLoaded(true);
        setLoading(false);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timeout);
  }, [authLoading, loading, forceLoaded]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-oficina");
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
      // Buscar orçamentos pendentes
      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .eq("status", "pending");

      // Buscar total de clientes
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id);

      // Buscar ordens de serviço do mês
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: orders } = await supabase
        .from("service_orders")
        .select("total")
        .eq("workshop_id", workshop.id)
        .gte("created_at", startOfMonth.toISOString());

      const revenue = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

      setStats({
        quotes: quotesCount || 0,
        clients: clientsCount || 0,
        revenue,
        orders: orders?.length || 0
      });
    } catch (error) {
      console.error("Erro ao carregar stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  if ((authLoading || loading) && !forceLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!workshop && !forceLoaded) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Olá, {workshop.name}!</h1>
        <p className="text-gray-600 mb-8">Bem-vindo ao seu painel de controle.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Orçamentos Pendentes"
            value={stats.quotes}
            description={stats.quotes === 0 ? "Nenhum orçamento pendente" : `${stats.quotes} aguardando resposta`}
            icon={FileText}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Clientes"
            value={stats.clients}
            description={stats.clients === 0 ? "Nenhum cliente cadastrado" : "clientes cadastrados"}
            icon={Users}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Receita do Mês"
            value={`R$ ${stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            description="Faturamento mensal"
            icon={DollarSign}
            color="yellow"
            loading={statsLoading}
          />
          <StatCard
            title="OS do Mês"
            value={stats.orders}
            description={stats.orders === 0 ? "Nenhuma OS este mês" : "ordens de serviço"}
            icon={Wrench}
            color="purple"
            loading={statsLoading}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">🚀 Seu plano está ativo!</h2>
          <p className="text-blue-800">
            Você tem acesso a todos os recursos da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
