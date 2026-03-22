"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import OSCard from "@/components/os/OSCard";
import NewOSModal from "@/components/os/NewOSModal";
import {
  Plus,
  Loader2,
  Search,
  FileText,
  Wrench,
  LayoutGrid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceOrder {
  id: string;
  workshop_id: string;
  order_number: number;
  status: string;
  client_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  total: number;
  estimated_completion?: string;
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

export default function OrdensPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewOSModal, setShowNewOSModal] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (profile?.id) {
      loadOrders();
    }
  }, [profile?.id]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (!workshop) throw new Error("Oficina não encontrada");
      setWorkshopId(workshop.id);

      const { data: ordersData, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          clients!service_orders_client_id_fkey(name),
          vehicles!service_orders_vehicle_id_fkey(brand, model, plate)
        `)
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedOrders = (ordersData || []).map((o: any) => ({
        id: o.id,
        workshop_id: o.workshop_id,
        order_number: o.order_number,
        status: o.status,
        client_name: o.clients?.name,
        vehicle_brand: o.vehicles?.brand,
        vehicle_model: o.vehicles?.model,
        vehicle_plate: o.vehicles?.plate,
        total: o.total,
        estimated_completion: o.estimated_completion,
        created_at: o.created_at,
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error("Erro ao carregar OS:", error);
      toast.error("Erro ao carregar ordens de serviço");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_number?.toString().includes(searchTerm) ||
          order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.vehicle_plate?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    return filtered;
  };

  const getOrdersByStatus = (status: string) => {
    return orders.filter((o) => o.status === status);
  };


  const filteredOrders = getFilteredOrders();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Ordens de Serviço
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie as ordens de serviço da oficina
            </p>
          </div>
          <button
            onClick={() => setShowNewOSModal(true)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Nova OS
          </button>
        </div>
      </FadeIn>

      {/* Filtros e Busca */}
      <FadeIn delay={0.1}>
        <GlassCard className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por número, cliente ou placa..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">Todos os status</option>
                {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      {/* View Mode Toggle */}
      <FadeIn delay={0.15}>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredOrders.length} {filteredOrders.length === 1 ? "ordem" : "ordens"} encontrada(s)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title="Visualização em grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              title="Visualização em lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Lista de OS */}
      {filteredOrders.length > 0 ? (
        viewMode === "grid" ? (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <StaggerItem key={order.id}>
                <OSCard order={order} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeIn delay={0.2}>
            <GlassCard className="p-4 sm:p-6">
              <div className="space-y-2">
                {filteredOrders.map((order) => (
                  <OSCard key={order.id} order={order} />
                ))}
              </div>
            </GlassCard>
          </FadeIn>
        )
      ) : (
        <FadeIn delay={0.2}>
          <GlassCard className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {searchTerm || filterStatus !== "all"
                ? "Nenhuma OS encontrada"
                : "Nenhuma OS cadastrada"}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Clique em 'Nova OS' para criar sua primeira ordem de serviço"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <button
                onClick={() => setShowNewOSModal(true)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Criar Primeira OS
              </button>
            )}
          </GlassCard>
        </FadeIn>
      )}

      {/* Modal Nova OS */}
      <NewOSModal
        isOpen={showNewOSModal}
        onClose={() => setShowNewOSModal(false)}
        workshopId={workshopId || ""}
      />
    </div>
  );
}

