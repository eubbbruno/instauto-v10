"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import ChecklistManager from "@/components/os/ChecklistManager";
import {
  Loader2,
  ArrowLeft,
  Car,
  User,
  Calendar,
  DollarSign,
  FileText,
  CheckSquare,
  History,
  Plus,
  Edit,
  Trash2,
  Printer,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceOrder {
  id: string;
  workshop_id: string;
  client_id?: string;
  vehicle_id?: string;
  order_number: number;
  status: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  delivered_at?: string;
  estimated_completion?: string;
  labor_cost: number;
  parts_cost: number;
  discount: number;
  total: number;
  description?: string;
  internal_notes?: string;
  client_notes?: string;
  km_entry?: number;
  km_exit?: number;
  diagnosis?: string;
}

interface OrderItem {
  id: string;
  type: "service" | "part";
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  notes?: string;
  checked_at?: string;
}

interface HistoryItem {
  id: string;
  status: string;
  notes?: string;
  created_at: string;
}

const STATUS_CONFIG = {
  pending: { label: "Aguardando", color: "bg-gray-100 text-gray-700 border-gray-300" },
  approved: { label: "Aprovado", color: "bg-blue-100 text-blue-700 border-blue-300" },
  in_progress: { label: "Em Andamento", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  waiting_parts: { label: "Aguard. Peças", color: "bg-orange-100 text-orange-700 border-orange-300" },
  completed: { label: "Finalizado", color: "bg-green-100 text-green-700 border-green-300" },
  delivered: { label: "Entregue", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-700 border-red-300" },
};

export default function OSDetailsPage({ params }: { params: { id: string } }) {
  const { profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"geral" | "itens" | "checklist" | "historico">("geral");

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [client, setClient] = useState<any>(null);
  const [vehicle, setVehicle] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [showItemModal, setShowItemModal] = useState(false);
  const [itemType, setItemType] = useState<"service" | "part">("service");

  const supabase = createClient();

  useEffect(() => {
    if (profile?.id) {
      loadOrderDetails();
    }
  }, [profile?.id, params.id]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);

      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (!workshop) throw new Error("Oficina não encontrada");

      const { data: orderData, error: orderError } = await supabase
        .from("service_orders")
        .select("*")
        .eq("id", params.id)
        .eq("workshop_id", workshop.id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      if (orderData.client_id) {
        const { data: clientData } = await supabase
          .from("clients")
          .select("*")
          .eq("id", orderData.client_id)
          .single();
        setClient(clientData);
      }

      if (orderData.vehicle_id) {
        const { data: vehicleData } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", orderData.vehicle_id)
          .single();
        setVehicle(vehicleData);
      }

      const [itemsRes, checklistRes, historyRes] = await Promise.all([
        supabase
          .from("service_order_items")
          .select("*")
          .eq("order_id", params.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("service_order_checklist")
          .select("*")
          .eq("order_id", params.id)
          .order("created_at", { ascending: true }),
        supabase
          .from("service_order_history")
          .select("*")
          .eq("order_id", params.id)
          .order("created_at", { ascending: false }),
      ]);

      setItems(itemsRes.data || []);
      setChecklist(checklistRes.data || []);
      setHistory(historyRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar OS:", error);
      toast.error("Erro ao carregar detalhes da OS");
      router.push("/oficina/ordens");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      const updates: any = { status: newStatus };

      if (newStatus === "in_progress" && !order.started_at) {
        updates.started_at = new Date().toISOString();
      }
      if (newStatus === "completed" && !order.completed_at) {
        updates.completed_at = new Date().toISOString();
      }
      if (newStatus === "delivered" && !order.delivered_at) {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("service_orders")
        .update(updates)
        .eq("id", order.id);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      loadOrderDetails();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">OS não encontrada</p>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/oficina/ordens")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                OS #{order.order_number?.toString().padStart(4, "0")}
              </h1>
              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            {client && (
              <p className="text-sm text-gray-600">
                Cliente: <span className="font-medium">{client.name}</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${statusConfig.color} cursor-pointer`}
            >
              {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("geral")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "geral"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Geral
          </button>
          <button
            onClick={() => setActiveTab("itens")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "itens"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Itens
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "checklist"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CheckSquare className="w-4 h-4 inline mr-2" />
            Checklist
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === "historico"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            Histórico
          </button>
        </div>
      </FadeIn>

      {/* Tab Content */}
      {activeTab === "geral" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Veículo */}
            <FadeIn delay={0.2}>
              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-blue-600" />
                  Informações do Veículo
                </h2>
                {vehicle ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Marca/Modelo</p>
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Placa</p>
                      <p className="text-sm font-medium text-gray-900">{vehicle.plate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ano</p>
                      <p className="text-sm font-medium text-gray-900">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Cor</p>
                      <p className="text-sm font-medium text-gray-900">{vehicle.color || "-"}</p>
                    </div>
                    {order.km_entry && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">KM Entrada</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.km_entry.toLocaleString("pt-BR")} km
                        </p>
                      </div>
                    )}
                    {order.km_exit && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">KM Saída</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.km_exit.toLocaleString("pt-BR")} km
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Veículo não informado</p>
                )}
              </GlassCard>
            </FadeIn>

            {/* Descrição do Problema */}
            <FadeIn delay={0.3}>
              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Descrição do Problema</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {order.description || "Sem descrição"}
                </p>
              </GlassCard>
            </FadeIn>

            {/* Diagnóstico */}
            {order.diagnosis && (
              <FadeIn delay={0.4}>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Diagnóstico</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">{order.diagnosis}</p>
                </GlassCard>
              </FadeIn>
            )}

            {/* Observações */}
            {(order.internal_notes || order.client_notes) && (
              <FadeIn delay={0.5}>
                <GlassCard className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Observações</h2>
                  {order.internal_notes && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Internas:</p>
                      <p className="text-sm text-gray-700">{order.internal_notes}</p>
                    </div>
                  )}
                  {order.client_notes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Para o cliente:</p>
                      <p className="text-sm text-gray-700">{order.client_notes}</p>
                    </div>
                  )}
                </GlassCard>
              </FadeIn>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Datas */}
            <FadeIn delay={0.2}>
              <GlassCard className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Datas
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Criada em</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(order.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  {order.estimated_completion && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Previsão</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(order.estimated_completion), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {order.started_at && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Iniciada em</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(order.started_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                  {order.completed_at && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Finalizada em</p>
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(order.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </FadeIn>

            {/* Valores */}
            <FadeIn delay={0.3}>
              <GlassCard className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Valores
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mão de obra</span>
                    <span className="text-sm font-medium text-gray-900">
                      {order.labor_cost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Peças</span>
                    <span className="text-sm font-medium text-gray-900">
                      {order.parts_cost.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Desconto</span>
                      <span className="text-sm font-medium text-red-600">
                        -{order.discount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-green-600">
                      {order.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </FadeIn>

            {/* Ações */}
            <FadeIn delay={0.4}>
              <GlassCard className="p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">Ações</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Printer className="w-4 h-4" />
                    Imprimir OS
                  </button>
                  <button className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Send className="w-4 h-4" />
                    Enviar p/ Cliente
                  </button>
                  {order.status !== "delivered" && (
                    <button
                      onClick={() => handleStatusChange("delivered")}
                      className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Marcar como Entregue
                    </button>
                  )}
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      )}

      {activeTab === "itens" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Itens da OS</h2>
              <button
                onClick={() => {
                  setItemType("service");
                  setShowItemModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Item
              </button>
            </div>

            {items.length > 0 ? (
              <div className="space-y-4">
                {/* Serviços */}
                {items.filter((i) => i.type === "service").length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Serviços</h3>
                    <div className="space-y-2">
                      {items
                        .filter((i) => i.type === "service")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity}x R$ {item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Peças */}
                {items.filter((i) => i.type === "part").length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-700 mb-2">Peças</h3>
                    <div className="space-y-2">
                      {items
                        .filter((i) => i.type === "part")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              <p className="text-xs text-gray-500">
                                {item.quantity}x R$ {item.unit_price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {item.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    {items.reduce((sum, item) => sum + item.total, 0).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Nenhum item adicionado</p>
                <p className="text-xs text-gray-400 mt-1">Clique em "Adicionar Item" para começar</p>
              </div>
            )}
          </GlassCard>
        </FadeIn>
      )}

      {activeTab === "checklist" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Checklist de Verificação</h2>
            <ChecklistManager orderId={order.id} items={checklist} onUpdate={loadOrderDetails} />
          </GlassCard>
        </FadeIn>
      )}

      {activeTab === "historico" && (
        <FadeIn delay={0.2}>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Histórico de Alterações</h2>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((h) => (
                  <div key={h.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <History className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Status alterado para:{" "}
                        <span className="text-blue-600">
                          {STATUS_CONFIG[h.status as keyof typeof STATUS_CONFIG]?.label || h.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(h.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                      {h.notes && <p className="text-xs text-gray-600 mt-1">{h.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Nenhum histórico registrado</p>
              </div>
            )}
          </GlassCard>
        </FadeIn>
      )}
    </div>
  );
}
