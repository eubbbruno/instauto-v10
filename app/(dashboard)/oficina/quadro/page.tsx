"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import PlanGuard from "@/components/auth/PlanGuard";
import { toast } from "sonner";
import {
  Loader2, LayoutGrid, Car, Play, Check, RotateCcw, Undo2, Clock, RefreshCw,
} from "lucide-react";

export default function QuadroPage() {
  return (
    <PlanGuard feature="Quadro da oficina">
      <QuadroContent />
    </PlanGuard>
  );
}

interface Order {
  id: string;
  order_number: number | string;
  status: string;
  total: number | null;
  created_at: string;
  clients?: { name: string } | null;
  vehicles?: { brand: string; model: string; plate: string } | null;
}

const COLUMNS: { key: string; title: string; statuses: string[]; dot: string; head: string }[] = [
  { key: "aguardando", title: "Aguardando", statuses: ["pending", "approved"], dot: "bg-gray-400", head: "border-gray-300" },
  { key: "manutencao", title: "Em manutenção", statuses: ["in_progress", "waiting_parts"], dot: "bg-yellow-500", head: "border-yellow-300" },
  { key: "pronto", title: "Pronto", statuses: ["completed", "delivered"], dot: "bg-green-500", head: "border-green-300" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora há pouco";
  if (h < 24) return `há ${h}h`;
  const d = Math.floor(h / 24);
  return `há ${d}d`;
}

function QuadroContent() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [movingId, setMovingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const init = async () => {
    setLoading(true);
    const ws = await resolveWorkshop(supabase, profile?.id);
    if (ws) {
      setWorkshopId(ws.id);
      await load(ws.id);
    }
    setLoading(false);
  };

  const load = async (id: string) => {
    const { data } = await supabase
      .from("service_orders")
      .select(`id, order_number, status, total, created_at,
        clients!service_orders_client_id_fkey(name),
        vehicles!service_orders_vehicle_id_fkey(brand, model, plate)`)
      .eq("workshop_id", id)
      .neq("status", "cancelled")
      .order("created_at", { ascending: false });
    setOrders((data as any[] as Order[]) || []);
  };

  const move = async (order: Order, to: string) => {
    setMovingId(order.id);
    // Atualização otimista
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: to } : o)));
    try {
      const patch: any = { status: to };
      if (to === "in_progress") patch.started_at = new Date().toISOString();
      if (to === "completed") patch.completed_at = new Date().toISOString();
      const { error } = await supabase.from("service_orders").update(patch).eq("id", order.id);
      if (error) throw error;
    } catch (e: any) {
      toast.error("Não foi possível mover a OS");
      if (workshopId) load(workshopId); // reverte via reload
    } finally {
      setMovingId(null);
    }
  };

  const actionsFor = (status: string): { label: string; to: string; icon: any; primary?: boolean }[] => {
    if (["pending", "approved"].includes(status)) return [{ label: "Iniciar", to: "in_progress", icon: Play, primary: true }];
    if (["in_progress", "waiting_parts"].includes(status))
      return [{ label: "Pronto", to: "completed", icon: Check, primary: true }, { label: "Voltar", to: "pending", icon: Undo2 }];
    return [{ label: "Reabrir", to: "in_progress", icon: RotateCcw }];
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / Quadro</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="w-7 h-7 text-[#1e3a8a]" /> Quadro da oficina
          </h1>
          <p className="text-sm text-gray-600 mt-1">Controle visual: veja o que chegou, o que está em serviço e o que está pronto.</p>
        </div>
        <button
          onClick={() => workshopId && load(workshopId)}
          className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          title="Atualizar"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const cards = orders.filter((o) => col.statuses.includes(o.status));
          return (
            <div key={col.key} className="bg-gray-50 rounded-2xl border border-gray-100 flex flex-col min-h-[200px]">
              <div className={`flex items-center gap-2 px-4 py-3 border-b-2 ${col.head}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                <h2 className="font-bold text-gray-900">{col.title}</h2>
                <span className="ml-auto text-sm font-semibold text-gray-500">{cards.length}</span>
              </div>

              <div className="p-3 space-y-3 flex-1">
                {cards.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhuma OS aqui.</p>
                ) : (
                  cards.map((o) => {
                    const veic = o.vehicles ? `${o.vehicles.brand || ""} ${o.vehicles.model || ""}`.trim() : "";
                    return (
                      <div key={o.id} className="bg-white rounded-xl border border-gray-200 p-3.5 shadow-sm">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-mono text-gray-500">OS #{o.order_number}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {timeAgo(o.created_at)}
                          </span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm truncate">{o.clients?.name || "Cliente"}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                          <Car className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {veic || "Veículo"}{o.vehicles?.plate ? ` · ${o.vehicles.plate}` : ""}
                          </span>
                        </p>
                        {o.total != null && o.total > 0 && (
                          <p className="text-sm font-semibold text-gray-800 mt-1">
                            {Number(o.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          {actionsFor(o.status).map((a) => {
                            const Icon = a.icon;
                            return (
                              <button
                                key={a.to}
                                onClick={() => move(o, a.to)}
                                disabled={movingId === o.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${
                                  a.primary ? "bg-[#1e3a8a] text-white hover:bg-[#1e40af]" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {movingId === o.id && a.primary ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                                {a.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Nenhuma ordem de serviço ainda. As OS que você criar aparecem aqui automaticamente.
        </p>
      )}
    </div>
  );
}
