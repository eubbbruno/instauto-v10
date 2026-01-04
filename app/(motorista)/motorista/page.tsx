"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Olá, {name}! 👋</h1>
          <p className="text-blue-100 mt-2">Gerencie seus veículos e encontre oficinas próximas</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statsLoading ? (
            <div className="col-span-3 flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm font-medium">Veículos</p>
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.vehicles}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm font-medium">Orçamentos</p>
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.quotes}</p>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-500 text-sm font-medium">Manutenções</p>
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.maintenances}</p>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/motorista/oficinas"
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 text-center transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <Search className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Buscar Oficinas</p>
          </Link>
          <Link
            href="/motorista/garagem"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
          >
            <Car className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="font-semibold text-gray-900">Minha Garagem</p>
          </Link>
          <Link
            href="/motorista/orcamentos"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
          >
            <FileText className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="font-semibold text-gray-900">Orçamentos</p>
          </Link>
          <Link
            href="/motorista/historico"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center transition-all hover:border-blue-500 hover:shadow-lg hover:-translate-y-1"
          >
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-semibold text-gray-900">Histórico</p>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-md">
          <p className="font-bold text-lg text-gray-900 mb-1">🎉 Sua conta é 100% gratuita!</p>
          <p className="text-gray-800">Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.</p>
        </div>
      </div>
    </div>
  );
}
