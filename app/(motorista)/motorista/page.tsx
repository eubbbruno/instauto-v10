"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, TrendingUp, Sparkles, Users, Tag, Gift, Star, MapPin, Wrench, ChevronRight, Zap, ArrowUp, MoreHorizontal, Download, Fuel, AlertCircle, Bell } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { StatCard } from "@/components/dashboard/StatCard";
import { FipeConsult } from "@/components/motorista/FipeConsult";
import { OnboardingModal } from "@/components/ui/OnboardingModal";

export default function MotoristaDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ vehicles: 0, quotes: 0, maintenances: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [forceLoaded, setForceLoaded] = useState(false);
  const supabase = createClient();

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !forceLoaded) {
        setForceLoaded(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [loading, forceLoaded]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadStats = async () => {
      try {
        console.log("🚀 [Dashboard] Iniciando fetch de stats...");

        // Buscar motorist_id
        let query1 = supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id);

        if (abortController.signal) query1 = query1.abortSignal(abortController.signal);

        const { data: motorist } = await query1.single();

        if (!motorist || !mounted) {
          setStatsLoading(false);
          return;
        }

        // Contar veículos
        let query2 = supabase
          .from("motorist_vehicles")
          .select("*", { count: "exact", head: true })
          .eq("motorist_id", motorist.id)
          .eq("is_active", true);

        if (abortController.signal) query2 = query2.abortSignal(abortController.signal);

        const { count: vehiclesCount } = await query2;

        // Contar orçamentos usando EMAIL ao invés de motorist_id
        let query3 = supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("motorist_email", profile.email);

        if (abortController.signal) query3 = query3.abortSignal(abortController.signal);

        const { count: quotesCount } = await query3;

        if (mounted) {
          setStats({
            vehicles: vehiclesCount || 0,
            quotes: quotesCount || 0,
            maintenances: 0,
          });
          console.log("✅ [Dashboard] Stats carregadas:", { vehiclesCount, quotesCount });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("❌ [Dashboard] Erro ao carregar stats:", error);
          // Em caso de erro, mostrar stats zerados
          setStats({ vehicles: 0, quotes: 0, maintenances: 0 });
        }
      } finally {
        if (mounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      console.log("🛑 [Dashboard] Cleanup - abortando fetch");
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

  if (loading && !forceLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user && !forceLoaded) return null;

  const firstName = profile?.name?.split(" ")[0] || "Motorista";
  const hasFleet = stats.vehicles >= 5;

  // Onboarding steps
  const motoristaSteps = [
    {
      title: "Bem-vindo ao Instauto!",
      description: "Vamos te mostrar como usar a plataforma para encontrar as melhores oficinas e gerenciar seus veículos.",
      icon: <Car className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Cadastre seus Veículos",
      description: "Adicione seus veículos na Garagem para solicitar orçamentos mais rápido e manter histórico de manutenções.",
      icon: <Car className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Busque Oficinas",
      description: "Encontre oficinas perto de você, veja avaliações de outros motoristas e compare especialidades.",
      icon: <Search className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Solicite Orçamentos",
      description: "Peça orçamentos para várias oficinas de uma vez e compare preços antes de decidir.",
      icon: <FileText className="w-10 h-10 text-blue-600" />
    },
    {
      title: "Pronto para começar!",
      description: "Você receberá notificações quando as oficinas responderem seus orçamentos. Boa sorte!",
      icon: <Bell className="w-10 h-10 text-blue-600" />
    }
  ];

  // Promoções fictícias (depois conectar com banco)
  const promotions = [
    {
      id: 1,
      partner: "Uber",
      title: "15% OFF em manutenções",
      description: "Parceiros Uber têm desconto especial",
      discount: "15%",
      color: "from-black to-gray-800",
      icon: "🚗",
    },
    {
      id: 2,
      partner: "Mercado Livre",
      title: "10% OFF + Frete Grátis",
      description: "Peças automotivas com desconto",
      discount: "10%",
      color: "from-yellow-400 to-yellow-500",
      icon: "📦",
    },
    {
      id: 3,
      partner: "iFood",
      title: "20% OFF em revisões",
      description: "Entregadores parceiros economizam mais",
      discount: "20%",
      color: "from-red-500 to-red-600",
      icon: "🍔",
    },
  ];

  const currentDate = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Dados para o gráfico de barras
  const chartData = [
    { name: 'Jan', value: 450 },
    { name: 'Fev', value: 380 },
    { name: 'Mar', value: 520 },
    { name: 'Abr', value: 680 },
    { name: 'Mai', value: 890 },
    { name: 'Jun', value: 750 },
    { name: 'Jul', value: 620 },
  ];

  return (
    <>
      {/* Onboarding Modal */}
      <OnboardingModal steps={motoristaSteps} storageKey="onboarding_motorista_done" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Olá, {firstName}! 👋
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard
              title="Veículos"
              value={stats.vehicles}
              description="cadastrados"
              icon={Car}
              color="blue"
              loading={statsLoading}
            />
            <StatCard
              title="Orçamentos"
              value={stats.quotes}
              description="solicitados"
              icon={FileText}
              color="blue"
              loading={statsLoading}
            />
            <StatCard
              title="Manutenções"
              value={stats.maintenances}
              description="agendadas"
              icon={Wrench}
              color="blue"
              loading={statsLoading}
            />
            <StatCard
              title="Economia"
              value="R$ 0"
              description="este mês"
              icon={TrendingUp}
              color="blue"
              loading={statsLoading}
            />
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Coluna Principal - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meus Veículos */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Car className="w-5 h-5 text-blue-600" />
                    Meus Veículos
                  </h2>
                  <Link 
                    href="/motorista/garagem"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
                {stats.vehicles > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Seu primeiro veículo</p>
                        <p className="text-xs text-gray-500">Adicione detalhes na garagem</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm mb-4">Nenhum veículo cadastrado</p>
                    <Link 
                      href="/motorista/garagem"
                      className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                    >
                      Adicionar Veículo
                    </Link>
                  </div>
                )}
              </div>

              {/* Últimos Orçamentos */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Últimos Orçamentos
                  </h2>
                  <Link 
                    href="/motorista/orcamentos"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
                {stats.quotes > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">Orçamento solicitado</p>
                        <p className="text-xs text-gray-500">Aguardando resposta</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                        Pendente
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm mb-4">Nenhum orçamento ainda</p>
                    <Link 
                      href="/motorista/oficinas"
                      className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                    >
                      Buscar Oficinas
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - 1/3 */}
            <div className="space-y-6">
              {/* Ações Rápidas */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-base text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-2">
                  <Link 
                    href="/motorista/oficinas"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Buscar Oficinas</p>
                      <p className="text-xs text-gray-500">Encontre perto de você</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  
                  <Link 
                    href="/motorista/garagem"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Adicionar Veículo</p>
                      <p className="text-xs text-gray-500">Cadastre seu carro</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>
              </div>

              {/* Dicas de Manutenção */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-gray-900">Dica do Dia</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Verifique regularmente o nível de óleo do motor. Isso pode evitar problemas graves e economizar muito dinheiro.
                </p>
                <Link 
                  href="/motorista/lembretes"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Criar lembrete →
                </Link>
              </div>

              {/* Próximo Lembrete */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  Próximo Lembrete
                </h3>
                <div className="text-center py-6 text-gray-500">
                  <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs">Nenhum lembrete</p>
                  <Link 
                    href="/motorista/lembretes/novo"
                    className="inline-block mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Criar lembrete →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}