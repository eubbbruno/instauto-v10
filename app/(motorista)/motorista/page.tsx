"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Car, FileText, Clock, Search, Plus, ChevronRight, Loader2, Sparkles, Zap, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Mock data para gráficos
const mockChartData = [
  { value: 20 },
  { value: 35 },
  { value: 25 },
  { value: 45 },
  { value: 30 },
  { value: 50 },
  { value: 40 },
];

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
        />
      </div>
    );
  }

  if (!user) return null;

  const firstName = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* HERO SECTION COM GLASSMORPHISM E ANIMAÇÕES */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 overflow-hidden">
        {/* Efeitos de fundo animados */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Olá, {firstName}!
                  </h1>
                </div>
                <p className="text-blue-100 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Gerencie seus veículos e encontre as melhores oficinas
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/motorista/garagem"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Veículo
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* CARDS DE ESTATÍSTICAS COM ANIMAÇÕES E GRÁFICOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsLoading ? (
            <div className="col-span-3 flex justify-center py-12 bg-white rounded-2xl shadow-md">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Card Veículos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative overflow-hidden group"
              >
                {/* Gradiente de fundo sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Meus Veículos</p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        {stats.vehicles}
                      </motion.p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.vehicles === 0 ? "Nenhum veículo cadastrado" : 
                         stats.vehicles === 1 ? "veículo cadastrado" : "veículos cadastrados"}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Car className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Mini gráfico */}
                  <div className="h-12 -mx-2 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Card Orçamentos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Orçamentos</p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        {stats.quotes}
                      </motion.p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.quotes === 0 ? "Nenhum orçamento" : 
                         stats.quotes === 1 ? "orçamento solicitado" : "orçamentos solicitados"}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <FileText className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="h-12 -mx-2 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#10B981"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              {/* Card Manutenções */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Manutenções</p>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                        className="text-3xl font-bold text-gray-900"
                      >
                        {stats.maintenances}
                      </motion.p>
                      <p className="text-xs text-gray-400 mt-1">
                        {stats.maintenances === 0 ? "Nenhuma manutenção" : 
                         stats.maintenances === 1 ? "manutenção realizada" : "manutenções realizadas"}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg"
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  
                  <div className="h-12 -mx-2 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#FBBF24"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* AÇÕES RÁPIDAS COM ANIMAÇÕES */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"
          >
            <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></span>
            Ações Rápidas
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link href="/motorista/oficinas" className="block">
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 text-white hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="font-semibold">Buscar Oficinas</p>
                  <p className="text-sm text-blue-100 mt-1">Encontre as melhores</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link href="/motorista/garagem" className="block">
                <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-3">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Minha Garagem</p>
                  <p className="text-sm text-gray-500 mt-1">Gerencie veículos</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link href="/motorista/orcamentos" className="block">
                <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Orçamentos</p>
                  <p className="text-sm text-gray-500 mt-1">Suas solicitações</p>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link href="/motorista/historico" className="block">
                <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 hover:border-yellow-500 hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="font-semibold text-gray-900">Histórico</p>
                  <p className="text-sm text-gray-500 mt-1">Suas manutenções</p>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* BANNER CONTA GRATUITA COM ANIMAÇÃO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            {/* Efeito de brilho animado */}
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎉
                  </motion.span>
                  Sua conta é 100% gratuita!
                </h3>
                <p className="text-gray-800 mt-1">
                  Busque oficinas, solicite orçamentos e gerencie seus veículos sem pagar nada.
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/motorista/oficinas"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap shadow-lg"
                >
                  Buscar Oficinas
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ESPAÇO ANTES DO FOOTER */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
