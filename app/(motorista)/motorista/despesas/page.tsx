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
    if (profile) {
      fetchMotoristId();
    }
  }, [profile]);

  useEffect(() => {
    if (motoristId) {
      fetchVehicles();
      fetchExpenses();
    }
  }, [motoristId, selectedVehicle, selectedCategory, searchTerm]);

  const fetchMotoristId = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("motorists")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (error) {
      console.error("Erro ao buscar ID do motorista:", error);
      setLoading(false);
      return;
    }
    setMotoristId(data.id);
  };

  const fetchVehicles = async () => {
    if (!motoristId) return;
    const { data, error } = await supabase
      .from("motorist_vehicles")
      .select("*")
      .eq("motorist_id", motoristId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar veículos:", error);
    } else {
      setVehicles(data || []);
    }
  };

  const fetchExpenses = async () => {
    if (!motoristId) return;
    setLoading(true);

    let query = supabase
      .from("motorist_expenses")
      .select("*")
      .eq("motorist_id", motoristId);

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

    if (error) {
      console.error("Erro ao buscar despesas:", error);
    } else {
      setExpenses(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" /> Controle de Despesas
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os gastos dos seus veículos
            </p>
          </div>
          <Link href="/motorista/despesas/nova">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" /> Adicionar Despesa
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Despesas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalExpenses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <PieChart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  R$ {stats.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Média por Despesa</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  R$ {stats.avgExpense > 0 ? stats.avgExpense.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Despesas por Categoria */}
        {Object.keys(stats.byCategory).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Despesas por Categoria</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byCategory).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{getCategoryLabel(category)}</span>
                  <span className="text-sm font-bold text-gray-900">R$ {amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por descrição..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-auto"
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
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-auto"
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

