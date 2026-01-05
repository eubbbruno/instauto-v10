"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Fuel,
  Plus,
  Search,
  Filter,
  Loader2,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Gauge,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { MotoristFueling, MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AbastecimentoPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [fuelings, setFuelings] = useState<MotoristFueling[]>([]);
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalFuelings: 0,
    totalSpent: 0,
    avgConsumption: 0,
    avgPricePerLiter: 0,
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
      fetchFuelings();
    }
  }, [motoristId, selectedVehicle, searchTerm]);

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

  const fetchFuelings = async () => {
    if (!motoristId) return;
    setLoading(true);

    let query = supabase
      .from("motorist_fueling")
      .select("*")
      .eq("motorist_id", motoristId);

    if (selectedVehicle !== "all") {
      query = query.eq("vehicle_id", selectedVehicle);
    }

    if (searchTerm) {
      query = query.or(
        `gas_station.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      console.error("Erro ao buscar abastecimentos:", error);
    } else {
      setFuelings(data || []);
      calculateStats(data || []);
    }
    setLoading(false);
  };

  const calculateStats = (data: MotoristFueling[]) => {
    if (data.length === 0) {
      setStats({ totalFuelings: 0, totalSpent: 0, avgConsumption: 0, avgPricePerLiter: 0 });
      return;
    }

    const totalSpent = data.reduce((sum, f) => sum + f.total_amount, 0);
    const totalLiters = data.reduce((sum, f) => sum + f.liters, 0);
    const avgPricePerLiter = totalSpent / totalLiters;

    // Calcular consumo médio (simplificado)
    let avgConsumption = 0;
    if (data.length >= 2) {
      const sortedByOdometer = [...data].sort((a, b) => a.odometer - b.odometer);
      const totalKm = sortedByOdometer[sortedByOdometer.length - 1].odometer - sortedByOdometer[0].odometer;
      if (totalKm > 0) {
        avgConsumption = (totalKm / totalLiters);
      }
    }

    setStats({
      totalFuelings: data.length,
      totalSpent,
      avgConsumption,
      avgPricePerLiter,
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Veículo";
  };

  const getFuelTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      gasoline: "Gasolina",
      ethanol: "Etanol",
      diesel: "Diesel",
      gnv: "GNV",
    };
    return labels[type] || type;
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
              <Fuel className="w-8 h-8 text-blue-600" /> Histórico de Abastecimento
            </h1>
            <p className="text-gray-600 mt-1">
              Controle seus gastos com combustível e consumo médio
            </p>
          </div>
          <Link href="/motorista/abastecimento/novo">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" /> Adicionar Abastecimento
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Abastecimentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalFuelings}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Fuel className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Gasto</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  R$ {stats.totalSpent.toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Consumo Médio</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.avgConsumption > 0 ? stats.avgConsumption.toFixed(1) : "N/A"} km/l
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Gauge className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Preço Médio/Litro</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  R$ {stats.avgPricePerLiter > 0 ? stats.avgPricePerLiter.toFixed(2) : "0.00"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por posto, cidade..."
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
        </div>

        {/* Lista de Abastecimentos */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          {fuelings.length === 0 ? (
            <div className="p-12 text-center text-gray-600">
              <Fuel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Nenhum abastecimento registrado</p>
              <p className="mb-4">Comece a registrar seus abastecimentos para acompanhar seu consumo!</p>
              <Link href="/motorista/abastecimento/novo">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" /> Adicionar Primeiro Abastecimento
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
                      Combustível
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Litros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço/L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      KM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posto
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fuelings.map((fueling) => (
                    <tr key={fueling.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(fueling.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getVehicleName(fueling.vehicle_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline">{getFuelTypeLabel(fueling.fuel_type)}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fueling.liters.toFixed(2)}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        R$ {fueling.price_per_liter.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        R$ {fueling.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fueling.odometer.toLocaleString()} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {fueling.gas_station || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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

