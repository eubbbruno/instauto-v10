"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, TrendingUp, MapPin, Wrench } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function MotoristaDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ vehicles: 0, quotes: 0, maintenances: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const supabase = createClient();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Gerencie seus veículos e encontre as melhores oficinas
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              {stats.vehicles > 0 && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Ativo
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-1">Meus Veículos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.vehicles}</p>
            <p className="text-xs text-gray-400 mt-2">
              {stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
               stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              {stats.quotes > 0 && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Pendente
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-1">Orçamentos</p>
            <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
            <p className="text-xs text-gray-400 mt-2">
              {stats.quotes === 0 ? "Nenhum orçamento" : 
               stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">Manutenções</p>
            <p className="text-3xl font-bold text-gray-900">{stats.maintenances}</p>
            <p className="text-xs text-gray-400 mt-2">
              {stats.maintenances === 0 ? "Nenhuma manutenção" : 
               stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
            </p>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/motorista/oficinas"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Buscar Oficinas</h3>
              <p className="text-sm text-gray-500">Encontre as melhores oficinas</p>
            </Link>

            <Link
              href="/motorista/garagem"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Minha Garagem</h3>
              <p className="text-sm text-gray-500">Gerencie seus veículos</p>
            </Link>

            <Link
              href="/motorista/orcamentos"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-green-300 transition-all group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Orçamentos</h3>
              <p className="text-sm text-gray-500">Suas solicitações</p>
            </Link>

            <Link
              href="/motorista/historico"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-yellow-300 transition-all group"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Histórico</h3>
              <p className="text-sm text-gray-500">Suas manutenções</p>
            </Link>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                🎉 Sua conta é 100% gratuita!
              </h3>
              <p className="text-blue-100">
                Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              </p>
            </div>
            <Link
              href="/motorista/oficinas"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap shadow-md"
            >
              Buscar Oficinas
            </Link>
          </div>
        </div>

        {/* Dicas Rápidas */}
        {stats.vehicles === 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Comece agora!
            </h3>
            <p className="text-yellow-800 mb-4">
              Adicione seu primeiro veículo para começar a solicitar orçamentos e acompanhar manutenções.
            </p>
            <Link
              href="/motorista/garagem"
              className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Veículo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
