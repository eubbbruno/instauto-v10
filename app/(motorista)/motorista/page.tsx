"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, TrendingUp, Sparkles, Users, Tag, Gift, Star, MapPin, Wrench, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { StatCard } from "@/components/dashboard/StatCard";

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
      router.push("/login-motorista");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 lg:pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Premium com Boas-vindas */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Bem-vindo de volta, {firstName}! 👋
              </h1>
              <p className="text-gray-500 text-sm capitalize">
                {currentDate}
              </p>
            </div>
            {hasFleet && (
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-sm font-semibold rounded-full flex items-center gap-2 shadow-lg w-fit">
                <Users className="w-4 h-4" />
                Frota Ativa
              </span>
            )}
          </div>
        </div>

        {/* Cards de Estatísticas Premium */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Veículos */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                +{stats.vehicles} total
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Meus Veículos</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? "..." : stats.vehicles}
            </p>
            <p className="text-xs text-gray-400">
              {stats.vehicles === 0 ? "Nenhum cadastrado" : 
               stats.vehicles === 1 ? "veículo ativo" : "veículos ativos"}
            </p>
          </div>

          {/* Card 2 - Orçamentos */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Este mês
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Orçamentos</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? "..." : stats.quotes}
            </p>
            <p className="text-xs text-gray-400">
              {stats.quotes === 0 ? "Nenhum solicitado" : "solicitações ativas"}
            </p>
          </div>

          {/* Card 3 - Manutenções */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                Histórico
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Manutenções</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {statsLoading ? "..." : stats.maintenances}
            </p>
            <p className="text-xs text-gray-400">
              {stats.maintenances === 0 ? "Nenhuma registrada" : "serviços realizados"}
            </p>
          </div>

          {/* Card 4 - Economia */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-blue-100 text-sm font-medium mb-1">Economia</h3>
            <p className="text-3xl font-bold mb-1">R$ 0</p>
            <p className="text-xs text-blue-200">em descontos este mês</p>
          </div>
        </div>

        {/* Grid Principal - 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Coluna Esquerda - Ações Rápidas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/motorista/oficinas"
                  className="group bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-lg">Buscar Oficinas</h3>
                  <p className="text-sm text-yellow-50">Encontre as melhores</p>
                </Link>

                <Link
                  href="/motorista/garagem"
                  className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Minha Garagem</h3>
                  <p className="text-sm text-gray-500">Gerencie veículos</p>
                </Link>

                <Link
                  href="/motorista/orcamentos"
                  className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-green-300 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Orçamentos</h3>
                  <p className="text-sm text-gray-500">Suas solicitações</p>
                </Link>

                <Link
                  href="/motorista/historico"
                  className="group bg-white rounded-xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-purple-300 transition-all hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">Histórico</h3>
                  <p className="text-sm text-gray-500">Manutenções</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Atividade Recente */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Atividade</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {stats.vehicles > 0 ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Veículo cadastrado</p>
                        <p className="text-xs text-gray-500">Há 2 dias</p>
                      </div>
                    </div>
                    
                    {stats.quotes > 0 && (
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">Orçamento solicitado</p>
                          <p className="text-xs text-gray-500">Há 1 hora</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Nenhuma atividade ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Promoções */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Promoções Exclusivas
            </h2>
            <Link href="/motorista/promocoes" className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`bg-gradient-to-br ${promo.color} rounded-2xl shadow-sm hover:shadow-md p-6 text-white transition-all cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{promo.icon}</div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    {promo.discount} OFF
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
                <p className="text-sm opacity-90 mb-4">{promo.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm font-semibold">{promo.partner}</span>
                  <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Usar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-sm mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold">Conta 100% Gratuita!</h3>
              </div>
              <p className="text-blue-100 text-base">
                Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              </p>
            </div>
            <Link
              href="/motorista/oficinas"
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all whitespace-nowrap shadow-lg flex items-center gap-2"
            >
              Buscar Oficinas
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Dica para Novos Usuários */}
        {stats.vehicles === 0 && (
          <div className="bg-white border-2 border-yellow-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Comece agora!
                </h3>
                <p className="text-gray-600 mb-4">
                  Adicione seu primeiro veículo para começar a solicitar orçamentos e acompanhar manutenções.
                </p>
                <Link
                  href="/motorista/garagem"
                  className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-5 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Veículo
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
