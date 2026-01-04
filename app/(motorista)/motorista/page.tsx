"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
        maintenances: 0, // TODO: implementar quando tivermos tabela de manutenções
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

  const name = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white pt-12 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Olá, {name}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Gerencie seus veículos e encontre as melhores oficinas
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/motorista/garagem">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  <Car className="mr-2 h-5 w-5" />
                  Adicionar Veículo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statsLoading ? (
            <div className="col-span-3 flex justify-center py-12 bg-white rounded-2xl shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Meus Veículos
                  </span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{stats.vehicles}</p>
                <p className="text-sm text-gray-500">
                  {stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
                   stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Orçamentos
                  </span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{stats.quotes}</p>
                <p className="text-sm text-gray-500">
                  {stats.quotes === 0 ? "Nenhum orçamento" : 
                   stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    Manutenções
                  </span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-1">{stats.maintenances}</p>
                <p className="text-sm text-gray-500">
                  {stats.maintenances === 0 ? "Nenhuma manutenção" : 
                   stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-600 rounded-full"></span>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/motorista/oficinas"
              className="group bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 transition-all hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative z-10">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <p className="font-bold text-lg mb-1">Buscar Oficinas</p>
                <p className="text-blue-100 text-sm">Encontre as melhores próximas a você</p>
              </div>
            </Link>

            <Link
              href="/motorista/garagem"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all hover:border-blue-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-3 bg-blue-50 rounded-xl w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                <Car className="w-7 h-7 text-blue-600" />
              </div>
              <p className="font-bold text-lg text-gray-900 mb-1">Minha Garagem</p>
              <p className="text-gray-500 text-sm">Gerencie seus veículos</p>
            </Link>

            <Link
              href="/motorista/orcamentos"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all hover:border-green-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-3 bg-green-50 rounded-xl w-fit mb-4 group-hover:bg-green-100 transition-colors">
                <FileText className="w-7 h-7 text-green-600" />
              </div>
              <p className="font-bold text-lg text-gray-900 mb-1">Orçamentos</p>
              <p className="text-gray-500 text-sm">Acompanhe suas solicitações</p>
            </Link>

            <Link
              href="/motorista/historico"
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 transition-all hover:border-purple-500 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="p-3 bg-purple-50 rounded-xl w-fit mb-4 group-hover:bg-purple-100 transition-colors">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
              <p className="font-bold text-lg text-gray-900 mb-1">Histórico</p>
              <p className="text-gray-500 text-sm">Veja suas manutenções</p>
            </Link>
          </div>
        </div>

        {/* Banner Gratuito */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-2xl text-gray-900 mb-2 flex items-center gap-2">
                🎉 Sua conta é 100% gratuita!
              </p>
              <p className="text-gray-800 text-lg">
                Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="text-6xl">🚗</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
