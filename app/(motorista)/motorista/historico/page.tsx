"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { History, ArrowLeft, Calendar, DollarSign, Wrench } from "lucide-react";
import Link from "next/link";

interface Maintenance {
  id: string;
  motorist_id: string;
  vehicle_id: string;
  workshop_id: string;
  service_type: string;
  description: string;
  cost: number;
  mileage: number | null;
  service_date: string;
  created_at: string;
  vehicle: {
    brand: string;
    model: string;
    year: number;
    plate: string;
  };
  workshop: {
    name: string;
    city: string;
    state: string;
  };
}

export default function HistoricoMotoristPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;
    
    if (!profile) {
      router.push("/login-motorista");
      return;
    }

    const abortController = new AbortController();
    let mounted = true;

    const loadMaintenances = async () => {
      try {
        setLoading(true);

        let query1 = supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id);

        if (abortController.signal) query1 = query1.abortSignal(abortController.signal);

        const { data: motorist } = await query1.single();

        if (!motorist || !mounted) {
          setLoading(false);
          return;
        }

        let query2 = supabase
          .from("maintenance_history")
          .select(`
            *,
            vehicle:motorist_vehicles(brand, model, year, plate),
            workshop:workshops(name, city, state)
          `)
          .eq("motorist_id", motorist.id);

        if (abortController.signal) query2 = query2.abortSignal(abortController.signal);

        const { data, error } = await query2.order("service_date", { ascending: false });

      if (error) throw error;
      if (mounted) {
        setMaintenances(data || []);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError' && mounted) {
        console.error("Erro ao carregar histórico:", error);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  loadMaintenances();

  return () => {
    mounted = false;
    abortController.abort();
  };
}, [profile, authLoading, router]);

  const getServiceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      maintenance: "Manutenção",
      repair: "Reparo",
      diagnostic: "Diagnóstico",
      inspection: "Inspeção",
      other: "Outro",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-violet-50/20 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-violet-50/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header Premium */}
        <div className="mb-10">
          <Link href="/motorista">
            <button className="flex items-center gap-2 text-gray-600 hover:text-purple-700 mb-6 font-medium hover:gap-3 transition-all">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Dashboard
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent leading-tight mb-3">
            Histórico de Manutenções 📜
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe todas as manutenções realizadas nos seus veículos
          </p>
        </div>

        {/* Lista de Manutenções */}
        {maintenances.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma manutenção registrada
            </h3>
            <p className="text-gray-600 mb-6">
              Quando você realizar serviços em oficinas parceiras, eles aparecerão aqui
            </p>
            <Link href="/buscar-oficinas">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Buscar Oficinas
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {maintenances.map((maintenance) => (
              <div
                key={maintenance.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getServiceTypeLabel(maintenance.service_type)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {maintenance.vehicle.brand} {maintenance.vehicle.model} ({maintenance.vehicle.year})
                    </p>
                    <p className="text-xs text-gray-500">
                      Placa: {maintenance.vehicle.plate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      R$ {maintenance.cost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Descrição do Serviço</p>
                  <p className="text-gray-900">{maintenance.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Oficina</p>
                      <p className="font-semibold text-gray-900">
                        {maintenance.workshop.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Data do Serviço</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(maintenance.service_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {maintenance.mileage && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-gray-600">Quilometragem</p>
                        <p className="font-semibold text-gray-900">
                          {maintenance.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    Registrado em {new Date(maintenance.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

