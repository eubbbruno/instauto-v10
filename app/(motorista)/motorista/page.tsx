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
        console.error("⚠️ Timeout: loading demorou mais de 10 segundos. Forçando carregamento.");
        setForceLoaded(true);
      }
    }, 10000); // 10 segundos

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

        let query2 = supabase
          .from("motorist_vehicles")
          .select("*", { count: "exact", head: true })
          .eq("motorist_id", motorist.id)
          .eq("is_active", true);

        if (abortController.signal) query2 = query2.abortSignal(abortController.signal);

        const { count: vehiclesCount } = await query2;

        let query3 = supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("motorist_id", motorist.id);

        if (abortController.signal) query3 = query3.abortSignal(abortController.signal);

        const { count: quotesCount } = await query3;

        if (mounted) {
          setStats({
            vehicles: vehiclesCount || 0,
            quotes: quotesCount || 0,
            maintenances: 0,
          });
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar stats:", error);
        }
      } finally {
        if (mounted) {
          setStatsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-sky-50/30 to-blue-50/20 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Premium com Boas-vindas */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-sky-800 bg-clip-text text-transparent leading-tight">
                  Olá, {firstName}! 👋
                </h1>
                {hasFleet && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg shadow-purple-500/40 animate-pulse">
                    <Users className="w-4 h-4" />
                    Frota Ativa
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg">
                Gerencie seus veículos e encontre as melhores oficinas
              </p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Meus Veículos"
            value={stats.vehicles}
            description={stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
                        stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
            icon={Car}
            color="blue"
            loading={statsLoading}
          />
          <StatCard
            title="Orçamentos"
            value={stats.quotes}
            description={stats.quotes === 0 ? "Nenhum orçamento" : 
                        stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
            icon={FileText}
            color="green"
            loading={statsLoading}
          />
          <StatCard
            title="Manutenções"
            value={stats.maintenances}
            description={stats.maintenances === 0 ? "Nenhuma manutenção" : 
                        stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
            icon={Clock}
            color="yellow"
            loading={statsLoading}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/motorista/oficinas"
              className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">Buscar Oficinas</h3>
              <p className="text-sm text-blue-100">Encontre as melhores oficinas</p>
            </Link>

            <Link
              href="/motorista/garagem"
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Minha Garagem</h3>
              <p className="text-sm text-gray-500">Gerencie seus veículos</p>
            </Link>

            <Link
              href="/motorista/orcamentos"
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl hover:border-green-300 transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Orçamentos</h3>
              <p className="text-sm text-gray-500">Suas solicitações</p>
            </Link>

            <Link
              href="/motorista/historico"
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl hover:border-yellow-300 transition-all hover:-translate-y-1 group"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Histórico</h3>
              <p className="text-sm text-gray-500">Suas manutenções</p>
            </Link>
          </div>
        </div>

        {/* Últimas Promoções Premium */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <Gift className="w-5 h-5 text-white" />
              </div>
              Últimas Promoções
            </h2>
            <Link href="/motorista/promocoes" className="text-base text-sky-600 hover:text-sky-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Ver todas
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <div
                key={promo.id}
                className={`bg-gradient-to-br ${promo.color} rounded-2xl shadow-2xl p-7 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/20`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="text-5xl drop-shadow-lg">{promo.icon}</div>
                  <span className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-base font-black shadow-lg">
                    {promo.discount} OFF
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                <p className="text-sm opacity-95 mb-5 leading-relaxed">{promo.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <span className="text-sm font-bold opacity-90">{promo.partner}</span>
                  <button className="bg-white/30 hover:bg-white/40 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-lg">
                    Usar agora →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Informativo Premium */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-sky-700 rounded-2xl p-8 sm:p-10 text-white shadow-2xl shadow-sky-600/30 mb-10 border-2 border-sky-400/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                Sua conta é 100% gratuita!
              </h3>
              <p className="text-sky-100 text-lg leading-relaxed">
                Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              </p>
            </div>
            <Link
              href="/motorista/oficinas"
              className="bg-white text-sky-600 px-8 py-4 rounded-xl font-bold hover:bg-sky-50 transition-all whitespace-nowrap shadow-xl flex items-center gap-3 hover:scale-105 duration-300 text-lg"
            >
              Buscar Oficinas
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Dica para Novos Usuários */}
        {stats.vehicles === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-yellow-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-900 mb-2">
                  Comece agora!
                </h3>
                <p className="text-yellow-800 mb-4">
                  Adicione seu primeiro veículo para começar a solicitar orçamentos e acompanhar manutenções.
                </p>
                <Link
                  href="/motorista/garagem"
                  className="inline-flex items-center gap-2 bg-yellow-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors shadow-md"
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
