"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Building2, 
  Users, 
  FileText, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  Crown
} from "lucide-react";

interface Stats {
  totalWorkshops: number;
  totalMotorists: number;
  totalQuotes: number;
  pendingQuotes: number;
  respondedQuotes: number;
  totalReviews: number;
  avgRating: number;
  proWorkshops: number;
  freeWorkshops: number;
  newUsersLast7Days: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalWorkshops: 0,
    totalMotorists: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    respondedQuotes: 0,
    totalReviews: 0,
    avgRating: 0,
    proWorkshops: 0,
    freeWorkshops: 0,
    newUsersLast7Days: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      console.log("📊 [Admin] Carregando estatísticas...");

      // Total de oficinas
      const { count: workshopsCount } = await supabase
        .from("workshops")
        .select("*", { count: "exact", head: true });

      // Total de motoristas
      const { count: motoristsCount } = await supabase
        .from("motorists")
        .select("*", { count: "exact", head: true });

      // Total de orçamentos
      const { count: quotesCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true });

      // Orçamentos pendentes
      const { count: pendingCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Orçamentos respondidos
      const { count: respondedCount } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("status", "responded");

      // Total de avaliações
      const { count: reviewsCount } = await supabase
        .from("reviews")
        .select("*", { count: "exact", head: true });

      // Média de avaliações
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("rating");
      
      const avgRating = reviewsData && reviewsData.length > 0
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / reviewsData.length
        : 0;

      // Oficinas PRO vs FREE
      const { data: workshopsData } = await supabase
        .from("workshops")
        .select("plan_type");
      
      const proCount = workshopsData?.filter(w => w.plan_type === "pro").length || 0;
      const freeCount = workshopsData?.filter(w => w.plan_type === "free").length || 0;

      // Novos usuários nos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: newUsersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      setStats({
        totalWorkshops: workshopsCount || 0,
        totalMotorists: motoristsCount || 0,
        totalQuotes: quotesCount || 0,
        pendingQuotes: pendingCount || 0,
        respondedQuotes: respondedCount || 0,
        totalReviews: reviewsCount || 0,
        avgRating: avgRating,
        proWorkshops: proCount,
        freeWorkshops: freeCount,
        newUsersLast7Days: newUsersCount || 0,
      });

      console.log("✅ [Admin] Estatísticas carregadas:", stats);
    } catch (error) {
      console.error("❌ [Admin] Erro ao carregar stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-600">
          Visão geral do sistema Instauto
        </p>
      </div>

      {/* Stats Grid - Compacto com Glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {/* Total Oficinas */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <span className="text-[10px] md:text-xs font-medium text-gray-500">OFICINAS</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalWorkshops}</p>
          <p className="text-xs md:text-sm text-gray-500">
            {stats.proWorkshops} PRO • {stats.freeWorkshops} FREE
          </p>
        </div>

        {/* Total Motoristas */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <span className="text-[10px] md:text-xs font-medium text-gray-500">MOTORISTAS</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalMotorists}</p>
          <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Usuários cadastrados</p>
        </div>

        {/* Total Orçamentos */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <span className="text-[10px] md:text-xs font-medium text-gray-500">ORÇAMENTOS</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalQuotes}</p>
          <p className="text-xs md:text-sm text-gray-500">
            {stats.pendingQuotes} pendentes
          </p>
        </div>

        {/* Avaliações */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-lg md:rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <span className="text-[10px] md:text-xs font-medium text-gray-500">AVALIAÇÕES</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stats.totalReviews}</p>
          <p className="text-xs md:text-sm text-gray-500">
            Média: {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0.0"} ⭐
          </p>
        </div>
      </div>

      {/* Cards Secundários - Com Glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Novos Usuários */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-blue-100">Últimos 7 dias</p>
              <p className="text-2xl md:text-3xl font-bold">{stats.newUsersLast7Days}</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-blue-100">Novos usuários cadastrados</p>
        </div>

        {/* Status dos Orçamentos */}
        <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            Status dos Orçamentos
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-yellow-400 rounded-full"></div>
                <span className="text-sm md:text-base text-gray-700">Pendentes</span>
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">{stats.pendingQuotes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm md:text-base text-gray-700">Respondidos</span>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.respondedQuotes}</span>
            </div>
            <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-gray-200">
              <span className="text-sm md:text-base text-gray-700 font-medium">Total</span>
              <span className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalQuotes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Planos - Com Glassmorphism */}
      <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-lg">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
          Distribuição de Planos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="text-center p-4 md:p-6 bg-yellow-50/80 backdrop-blur-sm rounded-lg md:rounded-xl border-2 border-yellow-200">
            <p className="text-3xl md:text-4xl font-bold text-yellow-600 mb-1 md:mb-2">{stats.proWorkshops}</p>
            <p className="text-sm md:text-base text-gray-700 font-medium">Oficinas PRO</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">R$ 97/mês</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-gray-50/80 backdrop-blur-sm rounded-lg md:rounded-xl border-2 border-gray-200">
            <p className="text-3xl md:text-4xl font-bold text-gray-600 mb-1 md:mb-2">{stats.freeWorkshops}</p>
            <p className="text-sm md:text-base text-gray-700 font-medium">Oficinas FREE</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Gratuito</p>
          </div>
        </div>
        
        {stats.totalWorkshops > 0 && (
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-gray-600">Taxa de conversão PRO:</span>
              <span className="text-base md:text-lg font-bold text-blue-600">
                {((stats.proWorkshops / stats.totalWorkshops) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="/admin/oficinas"
            className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center border border-gray-200"
          >
            Ver Oficinas
          </a>
          <a
            href="/admin/motoristas"
            className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center border border-gray-200"
          >
            Ver Motoristas
          </a>
          <a
            href="/admin/orcamentos"
            className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center border border-gray-200"
          >
            Ver Orçamentos
          </a>
          <a
            href="/admin/avaliacoes"
            className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center border border-gray-200"
          >
            Ver Avaliações
          </a>
        </div>
      </div>
    </div>
  );
}
