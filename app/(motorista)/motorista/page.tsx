"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, ChevronRight, Loader2, Sparkles, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function MotoristaDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ vehicles: 0, quotes: 0, maintenances: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* HERO SECTION MELHORADO */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 overflow-hidden">
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-bounce" style={{ animationDuration: "2s" }} />
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Olá, {firstName}!
                  </h1>
                </div>
                <p className="text-blue-100 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Gerencie seus veículos e encontre as melhores oficinas
                </p>
              </div>
              <Link
                href="/motorista/garagem"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
        {/* CARDS DE ESTATÍSTICAS MELHORADOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsLoading ? (
            <div className="col-span-3 flex justify-center py-12 bg-white rounded-2xl shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Card Veículos */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-100 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Meus Veículos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.vehicles}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
                         stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Badge de tendência */}
                  {stats.vehicles > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                      <TrendingUp className="w-3 h-3" />
                      <span>Ativo</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Orçamentos */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-100 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Orçamentos</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.quotes === 0 ? "Nenhum orçamento" : 
                         stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  {stats.quotes > 0 && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                      <Clock className="w-3 h-3" />
                      <span>Aguardando resposta</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Manutenções */}
              <div className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 border border-gray-100 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Manutenções</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.maintenances}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.maintenances === 0 ? "Nenhuma manutenção" : 
                         stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full w-fit">
                    <span>Histórico completo</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/motorista/oficinas" className="block group animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                  <Search className="w-5 h-5" />
                </div>
                <p className="font-semibold">Buscar Oficinas</p>
                <p className="text-sm text-blue-100 mt-1">Encontre as melhores</p>
              </div>
            </Link>

            <Link href="/motorista/garagem" className="block group animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-3">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900">Minha Garagem</p>
                <p className="text-sm text-gray-500 mt-1">Gerencie veículos</p>
              </div>
            </Link>

            <Link href="/motorista/orcamentos" className="block group animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900">Orçamentos</p>
                <p className="text-sm text-gray-500 mt-1">Suas solicitações</p>
              </div>
            </Link>

            <Link href="/motorista/historico" className="block group animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
              <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="font-semibold text-gray-900">Histórico</p>
                <p className="text-sm text-gray-500 mt-1">Suas manutenções</p>
              </div>
            </Link>
          </div>
        </div>

        {/* BANNER CONTA GRATUITA */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 whitespace-nowrap shadow-lg hover:scale-105 active:scale-95"
              >
                Buscar Oficinas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="h-8"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
