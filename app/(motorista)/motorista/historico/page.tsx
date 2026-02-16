"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { History, ArrowLeft, Calendar, DollarSign, Wrench, Loader2 } from "lucide-react";
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
    make: string;
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
            vehicle:motorist_vehicles(make, model, year, plate),
            workshop:workshops(name, city, state)
          `)
          .eq("motorist_id", motorist.id);

        if (abortController.signal) query2 = query2.abortSignal(abortController.signal);

        const { data, error} = await query2
          .order("service_date", { ascending: false })
          .limit(100);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="p-8">
        {/* Header padrão */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Dashboard / Histórico</p>
          <h1 className="text-3xl font-bold text-gray-900">Histórico de Manutenções</h1>
        </div>

        {/* Lista de Manutenções Premium */}
        {maintenances.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-violet-200 flex items-center justify-center">
              <History className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">
              Nenhuma manutenção registrada
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Quando você realizar serviços em oficinas parceiras, eles aparecerão aqui
            </p>
            <Link href="/motorista/oficinas">
              <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Buscar Oficinas
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {maintenances.map((maintenance, index) => (
              <div
                key={maintenance.id}
                className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100 hover:shadow-purple-200/50 hover:scale-[1.01] transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold rounded-xl shadow-lg mb-3">
                      {getServiceTypeLabel(maintenance.service_type)}
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">
                      {maintenance.vehicle.make} {maintenance.vehicle.model} ({maintenance.vehicle.year})
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Placa: <span className="text-gray-700">{maintenance.vehicle.plate}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Valor Total</p>
                    <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      R$ {maintenance.cost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 mb-6 border-2 border-purple-100">
                  <p className="text-sm font-semibold text-purple-700 mb-2 uppercase tracking-wide">Descrição do Serviço</p>
                  <p className="text-gray-800 leading-relaxed">{maintenance.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-purple-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Oficina</p>
                      <p className="font-bold text-gray-900 text-sm">
                        {maintenance.workshop.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {maintenance.workshop.city}, {maintenance.workshop.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Data do Serviço</p>
                      <p className="font-bold text-gray-900">
                        {new Date(maintenance.service_date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  {maintenance.mileage && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl border-2 border-orange-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Quilometragem</p>
                        <p className="font-bold text-gray-900">
                          {maintenance.mileage.toLocaleString()} km
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-gray-100 to-purple-100 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-xs text-gray-600 font-medium">
                    📅 Registrado em {new Date(maintenance.created_at).toLocaleDateString("pt-BR")} às {new Date(maintenance.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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

