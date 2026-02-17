"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment, AppointmentStatus } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Loader2,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientOption {
  id: string;
  name: string;
}

interface VehicleOption {
  id: string;
  plate: string;
  model: string;
}

interface AppointmentWithRelations extends Appointment {
  client_name?: string;
  vehicle_plate?: string;
}

export default function AgendaPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<AppointmentWithRelations | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<AppointmentWithRelations | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    client_id: "",
    vehicle_id: "",
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    start_time: "09:00",
    end_time: "10:00",
    status: "scheduled" as AppointmentStatus,
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const { data: workshop, error: workshopError } = await supabase
          .from("workshops")
          .select("id")
          .eq("profile_id", profile.id)
          .abortSignal(abortController.signal)
          .single();

        if (workshopError) throw workshopError;
        if (!mounted) return;
        
        setWorkshopId(workshop.id);

        // Carregar clientes
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, name")
          .eq("workshop_id", workshop.id)
          .abortSignal(abortController.signal)
          .order("name");

        if (clientsError) throw clientsError;
        if (!mounted) return;
        
        setClients(clientsData || []);

        // Carregar agendamentos
        await loadAppointments(workshop.id, abortController.signal);
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar dados:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível carregar os dados.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

  const loadAppointments = async (wId: string, signal?: AbortSignal) => {
    try {
      const query = supabase
        .from("appointments")
        .select(`
          *,
          clients (name),
          vehicles (plate)
        `)
        .eq("workshop_id", wId)
        .order("date", { ascending: false })
        .order("start_time", { ascending: true });

      if (signal) {
        query.abortSignal(signal);
      }

      const { data, error } = await query;

      if (error) throw error;

      const appointmentsWithRelations = (data || []).map((apt: any) => ({
        ...apt,
        client_name: apt.clients?.name,
        vehicle_plate: apt.vehicles?.plate,
      }));

      setAppointments(appointmentsWithRelations);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erro ao carregar agendamentos:", error);
      }
    }
  };

  const loadVehiclesByClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, plate, model")
        .eq("client_id", clientId)
        .order("plate");

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      setVehicles([]);
    }
  };

  const openCreateDialog = (selectedDate?: Date) => {
    setEditingAppointment(null);
    setFormData({
      client_id: "",
      vehicle_id: "",
      title: "",
      description: "",
      date: format(selectedDate || new Date(), "yyyy-MM-dd"),
      start_time: "09:00",
      end_time: "10:00",
      status: "scheduled",
      notes: "",
    });
    setVehicles([]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (appointment: AppointmentWithRelations) => {
    setEditingAppointment(appointment);
    setFormData({
      client_id: appointment.client_id || "",
      vehicle_id: appointment.vehicle_id || "",
      title: appointment.title,
      description: appointment.description || "",
      date: appointment.date,
      start_time: appointment.start_time,
      end_time: appointment.end_time || "",
      status: appointment.status,
      notes: appointment.notes || "",
    });
    if (appointment.client_id) {
      loadVehiclesByClient(appointment.client_id);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.date || !formData.start_time) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha título, data e horário de início.",
      });
      return;
    }

    if (!workshopId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID da oficina não encontrado.",
      });
      return;
    }

    setSaving(true);
    try {
      const appointmentData = {
        workshop_id: workshopId,
        client_id: formData.client_id || null,
        vehicle_id: formData.vehicle_id || null,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time || null,
        status: formData.status,
        notes: formData.notes.trim() || null,
      };

      if (editingAppointment) {
        const { error } = await supabase
          .from("appointments")
          .update(appointmentData)
          .eq("id", editingAppointment.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Agendamento atualizado com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from("appointments")
          .insert(appointmentData);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Agendamento criado com sucesso.",
        });
      }

      setIsDialogOpen(false);
      if (workshopId) loadAppointments(workshopId);
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o agendamento.",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (appointment: AppointmentWithRelations) => {
    setDeletingAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAppointment) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", deletingAppointment.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Agendamento removido com sucesso.",
      });

      setIsDeleteDialogOpen(false);
      if (workshopId) loadAppointments(workshopId);
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o agendamento.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const badges = {
      scheduled: { label: "Agendado", color: "bg-gray-100 text-gray-800", icon: Clock },
      confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      in_progress: { label: "Em Andamento", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
      completed: { label: "Concluído", color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
      no_show: { label: "Não Compareceu", color: "bg-orange-100 text-orange-800", icon: XCircle },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  // Estatísticas
  const today = new Date();
  const appointmentsToday = appointments.filter((apt) => isSameDay(new Date(apt.date), today));
  const thisWeekStart = startOfWeek(today, { locale: ptBR });
  const thisWeekEnd = endOfWeek(today, { locale: ptBR });
  const appointmentsThisWeek = appointments.filter((apt) => {
    const aptDate = new Date(apt.date);
    return aptDate >= thisWeekStart && aptDate <= thisWeekEnd;
  });
  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed").length;

  // Calendário
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), day));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <PlanGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Premium */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-1">Dashboard / Agenda</p>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
                <p className="text-gray-600">Gerencie os agendamentos da oficina</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${viewMode === "calendar" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <CalendarIcon className="w-4 h-4 inline mr-2" />
                  Calendário
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Lista
                </button>
                <button
                  onClick={() => openCreateDialog()}
                  className="px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 shadow-lg shadow-yellow-400/30 flex items-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Novo
                </button>
              </div>
            </div>
          </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Hoje
              </CardTitle>
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{appointmentsToday.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {appointmentsToday.length === 1 ? "agendamento" : "agendamentos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Esta Semana
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{appointmentsThisWeek.length}</div>
              <p className="text-xs text-gray-600 mt-1">
                {appointmentsThisWeek.length === 1 ? "agendamento" : "agendamentos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confirmados
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedAppointments}</div>
              <p className="text-xs text-gray-600 mt-1">
                aguardando atendimento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Visualização */}
        {viewMode === "calendar" ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Hoje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Cabeçalho dos dias da semana */}
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Dias do calendário */}
                {calendarDays.map((day) => {
                  const dayAppointments = getAppointmentsForDay(day);
                  const isToday = isSameDay(day, today);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors ${
                        isToday ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50"
                      } ${!isCurrentMonth ? "opacity-40" : ""}`}
                      onClick={() => openCreateDialog(day)}
                    >
                      <div className={`text-sm font-semibold mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}>
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 2).map((apt) => (
                          <div
                            key={apt.id}
                            className={`text-xs p-1 rounded truncate ${
                              apt.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : apt.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : apt.status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(apt);
                            }}
                          >
                            {apt.start_time} - {apt.title}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayAppointments.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
              <CardDescription>
                {appointments.length} {appointments.length === 1 ? "agendamento" : "agendamentos"} cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Nenhum agendamento
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Comece criando um novo agendamento.
                  </p>
                  <Button onClick={() => openCreateDialog()} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            📅 {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} às {appointment.start_time}
                            {appointment.end_time && ` - ${appointment.end_time}`}
                          </p>
                          {appointment.client_name && (
                            <p>👤 {appointment.client_name}</p>
                          )}
                          {appointment.vehicle_plate && (
                            <p>🚗 {appointment.vehicle_plate}</p>
                          )}
                          {appointment.description && (
                            <p className="text-gray-500">{appointment.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(appointment)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialog Criar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
              <DialogDescription>
                {editingAppointment
                  ? "Atualize as informações do agendamento"
                  : "Cadastre um novo agendamento"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Revisão completa"
                />
              </div>

              <div>
                <Label htmlFor="client_id">Cliente</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => {
                    setFormData({ ...formData, client_id: value, vehicle_id: "" });
                    loadVehiclesByClient(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehicle_id">Veículo</Label>
                <Select
                  value={formData.vehicle_id}
                  onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                  disabled={!formData.client_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plate} - {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: AppointmentStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start_time">Horário Início *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="end_time">Horário Fim</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes do serviço..."
                  rows={2}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais..."
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Deletar */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover o agendamento <strong>{deletingAppointment?.title}</strong>?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={saving}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removendo...
                  </>
                ) : (
                  "Remover"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </PlanGuard>
  );
}

