"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { Car, FileText, MessageSquare, History, Plus } from "lucide-react";
import Link from "next/link";

export default function MotoristaDashboard() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    vehicles: 0,
    quotes: 0,
    maintenances: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [showConfirmed, setShowConfirmed] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Verificar se veio da confirmação de email
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirmed") === "true" || params.get("welcome") === "true") {
      setShowConfirmed(true);
      // Remover o parâmetro da URL
      window.history.replaceState({}, "", "/motorista");
      // Esconder mensagem após 5 segundos
      setTimeout(() => setShowConfirmed(false), 5000);
    }
  }, []);

  useEffect(() => {
    console.log("🔄 Dashboard motorista - Profile:", profile, "Auth Loading:", authLoading);
    
    // Aguardar o AuthContext terminar de carregar
    if (authLoading) {
      console.log("⏳ Aguardando AuthContext carregar...");
      return;
    }
    
    // Se não está carregando e não tem profile, redirecionar
    if (!authLoading && !profile) {
      console.log("⚠️ Sem profile, redirecionando para login...");
      router.push("/login-motorista");
      return;
    }
    
    // Se tem profile, carregar stats
    if (profile) {
      console.log("✅ Profile encontrado, carregando stats...");
      loadStats();
    }
  }, [profile, authLoading, router]);

  const loadStats = async () => {
    try {
      console.log("🔍 Carregando stats para profile:", profile?.id);
      
      // Buscar motorista
      const { data: motorist, error: motoristError } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      console.log("Motorist:", motorist, "Error:", motoristError);

      if (motoristError || !motorist) {
        console.warn("Motorista não encontrado, mostrando dashboard vazio");
        setStats({ vehicles: 0, quotes: 0, maintenances: 0 });
        setStatsLoading(false);
        return;
      }

      // Contar veículos
      const { count: vehiclesCount, error: vehiclesError } = await supabase
        .from("motorist_vehicles")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      if (vehiclesError) console.warn("Erro ao contar veículos:", vehiclesError);

      // Contar orçamentos
      const { count: quotesCount, error: quotesError } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      if (quotesError) console.warn("Erro ao contar orçamentos:", quotesError);

      // Contar manutenções
      const { count: maintenancesCount, error: maintenancesError } = await supabase
        .from("maintenance_history")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      if (maintenancesError) console.warn("Erro ao contar manutenções:", maintenancesError);

      setStats({
        vehicles: vehiclesCount || 0,
        quotes: quotesCount || 0,
        maintenances: maintenancesCount || 0,
      });
      
      console.log("✅ Stats carregadas:", { vehiclesCount, quotesCount, maintenancesCount });
    } catch (error) {
      console.error("❌ Erro ao carregar estatísticas:", error);
      setStats({ vehicles: 0, quotes: 0, maintenances: 0 });
    } finally {
      setStatsLoading(false);
    }
  };

  // Mostrar loading enquanto auth ou stats estão carregando
  if (authLoading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagem de Email Confirmado */}
        {showConfirmed && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-900">
                  🎉 Email confirmado com sucesso!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Sua conta está ativa. Agora você pode aproveitar todos os recursos do Instauto!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Olá, {profile?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie seus veículos e encontre as melhores oficinas
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Meus Veículos</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {stats.vehicles}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4">
                <Car className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Orçamentos</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-green-600 to-green-800 bg-clip-text text-transparent">
                  {stats.quotes}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Manutenções</p>
                <p className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {stats.maintenances}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4">
                <History className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/buscar-oficinas" className="group">
              <div className="h-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 px-6 rounded-xl transition-all flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="bg-white/20 rounded-full p-3">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-center">Buscar Oficinas</span>
              </div>
            </Link>

            <Link href="/motorista/garagem" className="group">
              <div className="h-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-1">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <span className="text-center">Minha Garagem</span>
              </div>
            </Link>

            <Link href="/motorista/orcamentos" className="group">
              <div className="h-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <span className="text-center">Meus Orçamentos</span>
              </div>
            </Link>

            <Link href="/motorista/historico" className="group">
              <div className="h-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 text-gray-900 font-semibold py-6 px-6 rounded-xl transition-all flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-1">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-3">
                  <History className="h-6 w-6 text-white" />
                </div>
                <span className="text-center">Histórico</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              🎉 Sua conta é 100% gratuita!
            </h3>
            <p className="text-blue-50 text-lg leading-relaxed">
              Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
              <span className="font-bold text-white"> Tudo grátis para sempre!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

