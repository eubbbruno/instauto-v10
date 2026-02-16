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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-yellow-50 lg:pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header GRANDE e VISÍVEL */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-gray-900">
                Bem-vindo de volta, {firstName}! 👋
              </h1>
              <p className="text-gray-600 text-lg capitalize font-medium">
                {currentDate}
              </p>
            </div>
            {hasFleet && (
              <span className="px-6 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-base font-bold rounded-full flex items-center gap-2 shadow-xl w-fit">
                <Users className="w-5 h-5" />
                Frota Ativa
              </span>
            )}
          </div>
        </div>

        {/* CARDS GRANDES E VISÍVEIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Card 1 - Veículos */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-blue-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                <Car className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-gray-600 text-base font-semibold mb-3 uppercase tracking-wide">Meus Veículos</h3>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {statsLoading ? "..." : stats.vehicles}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {stats.vehicles === 0 ? "Nenhum cadastrado" : 
                 stats.vehicles === 1 ? "veículo ativo" : "veículos ativos"}
              </p>
            </div>
          </div>

          {/* Card 2 - Orçamentos */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-yellow-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mb-6 shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-gray-600 text-base font-semibold mb-3 uppercase tracking-wide">Orçamentos</h3>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {statsLoading ? "..." : stats.quotes}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {stats.quotes === 0 ? "Nenhum solicitado" : "solicitações ativas"}
              </p>
            </div>
          </div>

          {/* Card 3 - Manutenções */}
          <div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-green-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-gray-600 text-base font-semibold mb-3 uppercase tracking-wide">Manutenções</h3>
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {statsLoading ? "..." : stats.maintenances}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {stats.maintenances === 0 ? "Nenhuma registrada" : "serviços realizados"}
              </p>
            </div>
          </div>

          {/* Card 4 - Economia */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg hover:shadow-xl transition-all p-8 border-2 border-blue-400">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-blue-100 text-base font-semibold mb-3 uppercase tracking-wide">Economia</h3>
              <p className="text-5xl font-bold text-white mb-2">R$ 0</p>
              <p className="text-sm text-blue-200 font-medium">em descontos este mês</p>
            </div>
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
              
              <div className="grid grid-cols-2 gap-6">
                <Link
                  href="/motorista/oficinas"
                  className="group bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-8 px-8 text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-bold mb-2">Buscar Oficinas</h3>
                  <p className="text-sm font-medium opacity-80">Encontre as melhores</p>
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
              
              <div className="space-y-2">
                {stats.vehicles > 0 ? (
                  <>
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer odd:bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900">Veículo cadastrado</p>
                        <p className="text-sm text-gray-600 font-medium">Há 2 dias</p>
                      </div>
                    </div>
                    
                    {stats.quotes > 0 && (
                      <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-yellow-50 transition-colors cursor-pointer odd:bg-gray-50">
                        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-md">
                          <FileText className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900">Orçamento solicitado</p>
                          <p className="text-sm text-gray-600 font-medium">Há 1 hora</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors cursor-pointer odd:bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Wrench className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900">Manutenção agendada</p>
                        <p className="text-sm text-gray-600 font-medium">Há 5 dias</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-500">Nenhuma atividade ainda</p>
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
