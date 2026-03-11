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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="p-4 sm:p-4 sm:p-6 lg:p-8">
          {/* Header com breadcrumb */}
          <div className="mb-6 sm:mb-4 sm:mb-6 lg:mb-8">
            <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard</p>
            <h1 className="text-lg sm:text-xl lg:text-xl sm:text-2xl font-bold text-gray-900">
              Bem-vindo de volta, {firstName}! 👋
            </h1>
          </div>

        {/* Grid principal - 12 colunas */}
        <div className="grid grid-cols-12 gap-4 sm:gap-3 sm:gap-4 lg:gap-4 sm:p-6 mb-6 sm:mb-4 sm:mb-6 lg:mb-8">
          
          {/* Card grande - Visão Geral (8 colunas) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Visão Geral de Gastos</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Valor total */}
            <div className="mb-6">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">R$ 0,00</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1 font-medium">
                <ArrowUp className="w-4 h-4" />
                +R$ 0,00 comparado ao mês anterior
              </p>
            </div>
            
            {/* Gráfico de barras simples - Reduzido */}
            <div className="h-40 md:h-48 flex items-end justify-between gap-2 md:gap-4">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 md:gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-lg hover:from-blue-500 hover:to-blue-400 transition-all cursor-pointer"
                    style={{ height: `${(item.value / 900) * 100}%` }}
                  />
                  <span className="text-[10px] md:text-xs text-gray-500 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card lateral - Economia (4 colunas) - Com Glassmorphism */}
          <div className="col-span-12 lg:col-span-4 bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold text-gray-900">Economia</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden md:block">
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Gauge circular - Reduzido */}
            <div className="flex flex-col items-center mb-4 md:mb-6">
              <div className="relative w-28 h-28 md:w-36 md:h-36">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="50" stroke="#E5E7EB" strokeWidth="10" fill="none" className="md:hidden" />
                  <circle cx="56" cy="56" r="50" stroke="#3B82F6" strokeWidth="10" fill="none" 
                    strokeDasharray="235 314" strokeLinecap="round" className="md:hidden" />
                  <circle cx="72" cy="72" r="60" stroke="#E5E7EB" strokeWidth="12" fill="none" className="hidden md:block" />
                  <circle cx="72" cy="72" r="60" stroke="#3B82F6" strokeWidth="12" fill="none" 
                    strokeDasharray="283 377" strokeLinecap="round" className="hidden md:block" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">75%</span>
                  <span className="text-xs md:text-sm text-gray-500">da meta</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl md:rounded-2xl">
                <p className="text-[10px] md:text-xs text-gray-500 mb-1">Veículos</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.vehicles}</p>
                <span className="text-[10px] md:text-xs text-green-600 font-medium">+{stats.vehicles}</span>
              </div>
              <div className="text-center p-3 md:p-4 bg-yellow-50 rounded-xl md:rounded-2xl">
                <p className="text-[10px] md:text-xs text-gray-500 mb-1">Orçamentos</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stats.quotes}</p>
                <span className="text-[10px] md:text-xs text-blue-600 font-medium">Este mês</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid principal - 12 colunas */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8">
          
          {/* Tabela de atividades (8 colunas) */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-50 rounded-xl text-sm hover:bg-gray-100 transition-colors font-medium">
                    Filtrar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 flex items-center gap-2 transition-colors font-medium">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    <th className="px-6 py-4 font-medium">Tipo</th>
                    <th className="px-6 py-4 font-medium">Descrição</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.vehicles > 0 ? (
                    <>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Car className="w-5 h-5 text-blue-600" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">Veículo cadastrado</p>
                          <p className="text-sm text-gray-500">Adicionado à garagem</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">Há 2 dias</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Concluído
                          </span>
                        </td>
                      </tr>
                      {stats.quotes > 0 && (
                        <tr className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-yellow-600" />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">Orçamento solicitado</p>
                            <p className="text-sm text-gray-500">Aguardando resposta</p>
                          </td>
                          <td className="px-6 py-4 text-gray-600">Há 1 hora</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
                              Pendente
                            </span>
                          </td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">Nenhuma atividade ainda</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards laterais (4 colunas) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Próximo Lembrete - Com Glassmorphism */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-4 sm:p-5 text-white shadow-lg backdrop-blur-sm">
              <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">Próximo Lembrete</h3>
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <div>
                  <p className="font-medium text-sm md:text-base">Troca de óleo</p>
                  <p className="text-blue-200 text-xs md:text-sm">Em 5 dias</p>
                </div>
              </div>
              <Link
                href="/motorista/lembretes"
                className="block w-full py-2.5 md:py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 transition-colors text-center text-sm md:text-base"
              >
                Ver todos
              </Link>
            </div>

            {/* Ações Rápidas - Com Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl p-4 sm:p-5 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Ações Rápidas</h3>
              <div className="space-y-3">
                <Link
                  href="/motorista/oficinas"
                  className="flex items-center gap-3 p-3 md:p-4 bg-yellow-400 hover:bg-yellow-500 rounded-xl md:rounded-2xl transition-all group shadow-md"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-black/10 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-black text-sm md:text-base">Buscar Oficinas</p>
                    <p className="text-xs md:text-sm text-black/70 hidden sm:block">Encontre as melhores</p>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/motorista/garagem"
                  className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl md:rounded-2xl transition-all group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm md:text-base">Minha Garagem</p>
                    <p className="text-xs md:text-sm text-gray-600 hidden sm:block">{stats.vehicles} veículos</p>
                  </div>
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Consulta FIPE */}
            <FipeConsult />
            
          </div>
        </div>

        {/* Promoções */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Promoções Exclusivas
            </h2>
            <Link href="/motorista/promocoes" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`bg-gradient-to-br ${promo.color} rounded-2xl md:rounded-3xl shadow-lg hover:shadow-xl hover:-translate-y-1 p-4 md:p-5 text-white transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3 md:mb-4">
                  <div className="text-2xl md:text-3xl">{promo.icon}</div>
                  <span className="bg-white/30 backdrop-blur-md px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-bold">
                    {promo.discount} OFF
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">{promo.title}</h3>
                <p className="text-xs md:text-sm opacity-90 mb-3 md:mb-4 hidden sm:block">{promo.description}</p>
                <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-white/20">
                  <span className="text-xs md:text-sm font-semibold">{promo.partner}</span>
                  <button className="bg-white/30 hover:bg-white/40 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-colors">
                    Usar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dica para Novos Usuários */}
        {stats.vehicles === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 border-2 border-yellow-300 rounded-3xl p-8 shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-4 sm:p-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Wrench className="w-8 h-8 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  Comece agora!
                </h3>
                <p className="text-gray-700 mb-6 text-base">
                  Adicione seu primeiro veículo para começar a solicitar orçamentos e acompanhar manutenções.
                </p>
                <Link
                  href="/motorista/garagem"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-4 rounded-xl font-bold transition-all shadow-lg text-lg"
                >
                  <Plus className="w-6 h-6" />
                  Adicionar Veículo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
