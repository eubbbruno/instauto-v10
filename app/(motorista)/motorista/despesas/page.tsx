"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  DollarSign,
  Plus,
  Search,
  Loader2,
  TrendingUp,
  PieChart,
  Calendar,
  Download,
} from "lucide-react";
import Link from "next/link";
import { MotoristExpense, MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DespesasPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [expenses, setExpenses] = useState<MotoristExpense[]>([]);
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    avgExpense: 0,
    byCategory: {} as Record<string, number>,
  });
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-motorista");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const fetchMotoristId = async () => {
      try {
        let query = supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id);

        query = query.abortSignal(abortController.signal);

        const { data, error } = await query.single();

        if (error) throw error;

        if (mounted) {
          setMotoristId(data.id);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao buscar ID do motorista:", error);
          setLoading(false);
        }
      }
    };

    fetchMotoristId();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

  useEffect(() => {
    if (!motoristId) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadData = async () => {
      try {
        let query1 = supabase
          .from("motorist_vehicles")
          .select("*")
          .eq("motorist_id", motoristId)
          .eq("is_active", true);

        query1 = query1.abortSignal(abortController.signal);

        const { data: vehiclesData } = await query1.order("created_at", { ascending: false });

        if (mounted) {
          setVehicles(vehiclesData || []);
        }

        await fetchExpenses(abortController.signal);
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar dados:", error);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [motoristId, selectedVehicle, selectedCategory, searchTerm]);

  const fetchExpenses = async (signal?: AbortSignal) => {
    if (!motoristId) return;
    
    try {
      setLoading(true);

      let query = supabase
        .from("motorist_expenses")
        .select("*")
        .eq("motorist_id", motoristId);

      if (signal) {
        query = query.abortSignal(signal);
      }

      if (selectedVehicle !== "all") {
        query = query.eq("vehicle_id", selectedVehicle);
      }

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("date", { ascending: false });

      if (error) throw error;

      setExpenses(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro ao buscar despesas:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: MotoristExpense[]) => {
    if (data.length === 0) {
      setStats({ totalExpenses: 0, totalAmount: 0, avgExpense: 0, byCategory: {} });
      return;
    }

    const totalAmount = data.reduce((sum, e) => sum + e.amount, 0);
    const avgExpense = totalAmount / data.length;

    const byCategory: Record<string, number> = {};
    data.forEach((expense) => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });

    setStats({
      totalExpenses: data.length,
      totalAmount,
      avgExpense,
      byCategory,
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Veículo";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      fuel: "Combustível",
      maintenance: "Manutenção",
      insurance: "Seguro",
      ipva: "IPVA",
      fine: "Multa",
      parking: "Estacionamento",
      toll: "Pedágio",
      wash: "Lavagem",
      other: "Outro",
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fuel: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      insurance: "bg-green-100 text-green-800",
      ipva: "bg-purple-100 text-purple-800",
      fine: "bg-red-100 text-red-800",
      parking: "bg-gray-100 text-gray-800",
      toll: "bg-indigo-100 text-indigo-800",
      wash: "bg-cyan-100 text-cyan-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-amber-50/20 flex items-center justify-center pt-16">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando despesas...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-amber-50/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header Premium */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-800 bg-clip-text text-transparent leading-tight">
                Despesas 💸
              </h1>
              <p className="text-gray-600 text-lg">
                Gerencie todos os gastos dos seus veículos
              </p>
            </div>
            <Link href="/motorista/despesas/nova">
              <Button className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 font-bold shadow-lg hover:shadow-xl transition-all text-white border-0" size="lg">
                <Plus className="w-5 h-5 mr-2" /> Adicionar Despesa
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-100 hover:shadow-yellow-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total de Despesas</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mt-2">{stats.totalExpenses}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <PieChart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-100 hover:shadow-green-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Valor Total</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">
                  R$ {stats.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-100 hover:shadow-orange-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Média por Despesa</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mt-2">
                  R$ {stats.avgExpense > 0 ? stats.avgExpense.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Despesas por Categoria */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-100 mb-8">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">Despesas por Categoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, amount]) => (
                <div key={category} className="flex flex-col p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200 hover:shadow-lg hover:scale-105 transition-all">
                  <span className="text-sm font-semibold text-gray-700 mb-1">{getCategoryLabel(category)}</span>
                  <span className="text-lg font-extrabold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">R$ {amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros Premium */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all w-full md:w-auto font-medium"
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="all">Todos os Veículos</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plate}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all w-full md:w-auto font-medium"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas as Categorias</option>
              <option value="fuel">Combustível</option>
              <option value="maintenance">Manutenção</option>
              <option value="insurance">Seguro</option>
              <option value="ipva">IPVA</option>
              <option value="fine">Multa</option>
              <option value="parking">Estacionamento</option>
              <option value="toll">Pedágio</option>
              <option value="wash">Lavagem</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>

        {/* Lista de Despesas */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {expenses.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Nenhuma despesa registrada</p>
              <p className="mb-4">Comece a registrar suas despesas para ter controle financeiro!</p>
              <Link href="/motorista/despesas/nova">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-5 h-5 mr-2" /> Adicionar Primeira Despesa
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Veículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getVehicleName(expense.vehicle_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge className={getCategoryColor(expense.category)}>
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {expense.description || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        R$ {expense.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

