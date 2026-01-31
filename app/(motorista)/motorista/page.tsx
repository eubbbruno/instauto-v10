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
    if (profile) {
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    if (!profile) return;

    try {
      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (!motorist) {
        setStatsLoading(false);
        return;
      }

      const { count: vehiclesCount } = await supabase
        .from("motorist_vehicles")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id)
        .eq("is_active", true);

      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      setStats({
        vehicles: vehiclesCount || 0,
        quotes: quotesCount || 0,
        maintenances: 0,
      });
    } catch (error) {
      console.error("Erro ao carregar stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading && !forceLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com Boas-vindas */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {firstName}! 👋
            </h1>
            {hasFleet && (
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                <Users className="w-4 h-4" />
                Frota
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Gerencie seus veículos e encontre as melhores oficinas
          </p>
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

        {/* Últimas Promoções */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" />
              Últimas Promoções
            </h2>
            <Link href="/motorista/promocoes" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`bg-gradient-to-br ${promo.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{promo.icon}</div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    {promo.discount} OFF
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-1">{promo.title}</h3>
                <p className="text-sm opacity-90 mb-4">{promo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium opacity-75">{promo.partner}</span>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    Usar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Sua conta é 100% gratuita!
              </h3>
              <p className="text-blue-100">
                Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              </p>
            </div>
            <Link
              href="/motorista/oficinas"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap shadow-md flex items-center gap-2"
            >
              Buscar Oficinas
              <ChevronRight className="w-4 h-4" />
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
