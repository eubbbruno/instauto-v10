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

      const { data, error } = await query.order("due_date", { ascending: true });

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
              <Bell className="w-8 h-8 text-yellow-600" /> Lembretes de Manutenção
            </h1>
            <p className="text-gray-600 mt-1">
              Nunca mais esqueça de pagar IPVA, renovar seguro ou fazer revisão
            </p>
          </div>
          <Link href="/motorista/lembretes/novo">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-5 h-5 mr-2" /> Adicionar Lembrete
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Lembretes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Concluídos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Urgentes (7 dias)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.urgent}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
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
              placeholder="Buscar lembretes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-full md:w-auto"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>

        {/* Lista de Lembretes */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center text-gray-600">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Nenhum lembrete cadastrado</p>
              <p className="mb-4">Crie lembretes para nunca mais esquecer obrigações importantes!</p>
              <Link href="/motorista/lembretes/novo">
                <Button className="bg-yellow-600 hover:bg-yellow-700">
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
                  className={`bg-white rounded-2xl shadow-sm p-6 border transition-all hover:shadow-md ${
                    isOverdue
                      ? "border-red-300 bg-red-50"
                      : isUrgent
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{reminder.title}</h3>
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {getPriorityLabel(reminder.priority)}
                        </Badge>
                        <Badge variant="outline">{getReminderTypeLabel(reminder.type)}</Badge>
                        {reminder.is_completed && (
                          <Badge className="bg-green-100 text-green-800">
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

