"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, ChevronRight, Loader2 } from "lucide-react";
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
      // Buscar motorista
      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (!motorist) {
        setStatsLoading(false);
        return;
      }

      // Buscar veículos ativos
      const { count: vehiclesCount } = await supabase
        .from("motorist_vehicles")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id)
        .eq("is_active", true);

      // Buscar orçamentos
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
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Olá, {firstName}! 👋
                </h1>
                <p className="text-blue-100 mt-1">
                  Gerencie seus veículos e encontre as melhores oficinas
                </p>
              </div>
              <Link
                href="/motorista/garagem"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Adicionar Veículo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* CARDS DE ESTATÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsLoading ? (
            <div className="col-span-3 flex justify-center py-12 bg-white rounded-2xl shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Meus Veículos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.vehicles}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
                       stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Orçamentos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.quotes}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.quotes === 0 ? "Nenhum orçamento" : 
                       stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Manutenções</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.maintenances}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.maintenances === 0 ? "Nenhuma manutenção" : 
                       stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/motorista/oficinas" className="group">
              <div className="bg-blue-600 rounded-2xl p-5 text-white hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <p className="font-semibold">Buscar Oficinas</p>
                <p className="text-sm text-blue-200 mt-1">Encontre as melhores</p>
              </div>
            </Link>

            <Link href="/motorista/garagem" className="group">
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900">Minha Garagem</p>
                <p className="text-sm text-gray-500 mt-1">Gerencie veículos</p>
              </div>
            </Link>

            <Link href="/motorista/orcamentos" className="group">
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">Orçamentos</p>
                <p className="text-sm text-gray-500 mt-1">Suas solicitações</p>
              </div>
            </Link>

            <Link href="/motorista/historico" className="group">
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-yellow-500 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="font-semibold text-gray-900">Histórico</p>
                <p className="text-sm text-gray-500 mt-1">Suas manutenções</p>
              </div>
            </Link>
          </div>
        </div>

        {/* BANNER CONTA GRATUITA */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  🎉 Sua conta é 100% gratuita!
                </h3>
                <p className="text-gray-800 mt-1">
                  Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
                </p>
              </div>
              <Link
                href="/motorista/oficinas"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Buscar Oficinas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ESPAÇO ANTES DO FOOTER */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
