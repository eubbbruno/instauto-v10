"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  Bell,
  Plus,
  Search,
  Loader2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { MotoristReminder, MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LembretesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [reminders, setReminders] = useState<MotoristReminder[]>([]);
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    urgent: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
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

        await fetchReminders(abortController.signal);
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
  }, [motoristId, filterStatus, searchTerm]);

  const fetchReminders = async (signal?: AbortSignal) => {
    if (!motoristId) return;
    
    try {
      setLoading(true);

      let query = supabase
        .from("motorist_reminders")
        .select("*")
        .eq("motorist_id", motoristId);

      if (signal) {
        query = query.abortSignal(signal);
      }

      if (filterStatus === "pending") {
        query = query.eq("is_completed", false);
      } else if (filterStatus === "completed") {
        query = query.eq("is_completed", true);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query
        .order("due_date", { ascending: true })
        .limit(100);

      if (error) throw error;

      setReminders(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro ao buscar lembretes:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: MotoristReminder[]) => {
    const pending = data.filter((r) => !r.is_completed).length;
    const completed = data.filter((r) => r.is_completed).length;
    const urgent = data.filter((r) => {
      if (r.is_completed) return false;
      const daysUntilDue = Math.ceil(
        (new Date(r.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDue <= 7;
    }).length;

    setStats({
      total: data.length,
      pending,
      completed,
      urgent,
    });
  };

  const getVehicleName = (vehicleId: string | undefined) => {
    if (!vehicleId) return "Geral";
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Veículo";
  };

  const getReminderTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ipva: "IPVA",
      insurance: "Seguro",
      revision: "Revisão",
      licensing: "Licenciamento",
      tire_rotation: "Rodízio de Pneus",
      oil_change: "Troca de Óleo",
      inspection: "Vistoria",
      other: "Outro",
    };
    return labels[type] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
    };
    return labels[priority] || priority;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return `Atrasado ${Math.abs(days)} dias`;
    if (days === 0) return "Vence hoje";
    if (days === 1) return "Vence amanhã";
    return `${days} dias`;
  };

  const handleToggleComplete = async (reminderId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("motorist_reminders")
      .update({
        is_completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null,
      })
      .eq("id", reminderId);

    if (error) {
      console.error("Erro ao atualizar lembrete:", error);
    } else {
      fetchReminders();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header padrão */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Lembretes</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Lembretes</h1>
            <Link href="/motorista/lembretes/novo">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2 transition-all">
                <Plus className="w-5 h-5" />
                Adicionar Lembrete
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-teal-100 hover:shadow-teal-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total de Lembretes</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mt-2">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bell className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-100 hover:shadow-yellow-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pendentes</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mt-2">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-100 hover:shadow-green-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Concluídos</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-2">{stats.completed}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-red-100 hover:shadow-red-200/50 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Urgentes (7 dias)</p>
                <p className="text-4xl font-extrabold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mt-2">{stats.urgent}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros Premium */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar lembretes..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all w-full md:w-auto font-medium"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="completed">Concluídos</option>
            </select>
          </div>
        </div>

        {/* Lista de Lembretes Premium */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-teal-100 p-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-teal-100 to-cyan-200 flex items-center justify-center">
                <Bell className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Nenhum lembrete cadastrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Crie lembretes para nunca mais esquecer obrigações importantes como IPVA, seguro e revisões!
              </p>
              <Link href="/motorista/lembretes/novo">
                <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 font-bold shadow-lg hover:shadow-xl transition-all text-white border-0" size="lg">
                  <Plus className="w-5 h-5 mr-2" /> Criar Primeiro Lembrete
                </Button>
              </Link>
            </div>
          ) : (
            reminders.map((reminder) => {
              const daysUntil = Math.ceil(
                (new Date(reminder.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              const isUrgent = !reminder.is_completed && daysUntil <= 7;
              const isOverdue = !reminder.is_completed && daysUntil < 0;

              return (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-2xl shadow-2xl p-6 border-2 transition-all hover:shadow-teal-200/50 hover:scale-[1.02] ${
                    isOverdue
                      ? "border-red-300 bg-red-50"
                      : isUrgent
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className={`text-xl font-bold ${reminder.is_completed ? 'text-gray-400 line-through' : 'bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent'}`}>
                          {reminder.title}
                        </h3>
                        <Badge className={`${getPriorityColor(reminder.priority)} font-bold shadow-md`}>
                          {getPriorityLabel(reminder.priority)}
                        </Badge>
                        <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold border-0">
                          {getReminderTypeLabel(reminder.type)}
                        </Badge>
                        {reminder.is_completed && (
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold border-0 shadow-md">
                            <CheckCircle className="w-3 h-3 mr-1" /> Concluído
                          </Badge>
                        )}
                      </div>
                      {reminder.description && (
                        <p className="text-gray-600 mb-3">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(reminder.due_date).toLocaleDateString("pt-BR")}
                        </span>
                        <span>{getVehicleName(reminder.vehicle_id)}</span>
                        {reminder.amount && (
                          <span className="font-semibold text-green-600">
                            R$ {reminder.amount.toFixed(2)}
                          </span>
                        )}
                        {!reminder.is_completed && (
                          <span
                            className={`font-semibold ${
                              isOverdue
                                ? "text-red-600"
                                : isUrgent
                                ? "text-yellow-600"
                                : "text-gray-600"
                            }`}
                          >
                            {getDaysUntilDue(reminder.due_date)}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant={reminder.is_completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleToggleComplete(reminder.id, reminder.is_completed)}
                      className={
                        reminder.is_completed
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {reminder.is_completed ? "Reabrir" : "Concluir"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

