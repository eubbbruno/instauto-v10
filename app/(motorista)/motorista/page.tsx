"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { Car, FileText, MessageSquare, History, Plus } from "lucide-react";
import Link from "next/link";

export default function MotoristaDashboard() {
  const router = useRouter();
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    vehicles: 0,
    quotes: 0,
    maintenances: 0,
  });
  const [loading, setLoading] = useState(true);
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
    if (!profile) {
      router.push("/login-motorista");
      return;
    }
    loadStats();
  }, [profile]);

  const loadStats = async () => {
    try {
      // Buscar motorista
      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (!motorist) {
        setLoading(false);
        return;
      }

      // Contar veículos
      const { count: vehiclesCount } = await supabase
        .from("motorist_vehicles")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      // Contar orçamentos
      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      // Contar manutenções
      const { count: maintenancesCount } = await supabase
        .from("maintenance_history")
        .select("*", { count: "exact", head: true })
        .eq("motorist_id", motorist.id);

      setStats({
        vehicles: vehiclesCount || 0,
        quotes: quotesCount || 0,
        maintenances: maintenancesCount || 0,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {profile?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Meus Veículos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.vehicles}</p>
              </div>
              <Car className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Orçamentos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
              </div>
              <FileText className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Manutenções</p>
                <p className="text-3xl font-bold text-gray-900">{stats.maintenances}</p>
              </div>
              <History className="h-12 w-12 text-yellow-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/buscar-oficinas">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                <Plus className="h-5 w-5" />
                Buscar Oficinas
              </button>
            </Link>

            <Link href="/motorista/garagem">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                <Car className="h-5 w-5" />
                Minha Garagem
              </button>
            </Link>

            <Link href="/motorista/orcamentos">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Meus Orçamentos
              </button>
            </Link>

            <Link href="/motorista/historico">
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2">
                <History className="h-5 w-5" />
                Histórico
              </button>
            </Link>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            🎉 Sua conta é 100% gratuita!
          </h3>
          <p className="text-gray-700">
            Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
            Tudo grátis para sempre!
          </p>
        </div>
      </div>
    </div>
  );
}

