"use client";

import { Car, User, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface ServiceOrder {
  id: string;
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

interface OSCardProps {
  order: ServiceOrder;
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

export default function OSCard({ order }: OSCardProps) {
  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;

  return (
    <Link href={`/oficina/ordens-servico/${order.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              OS #{order.order_number?.toString().padStart(4, "0")}
            </span>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Cliente */}
        {order.client_name && (
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 font-medium">{order.client_name}</span>
          </div>
        )}

        {/* Veículo */}
        {(order.vehicle_brand || order.vehicle_model || order.vehicle_plate) && (
          <div className="flex items-center gap-2 mb-2">
            <Car className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {order.vehicle_brand} {order.vehicle_model}
              {order.vehicle_plate && ` - ${order.vehicle_plate}`}
            </span>
          </div>
        )}

        {/* Data de previsão */}
        {order.estimated_completion && (
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Previsão: {format(new Date(order.estimated_completion), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        )}

        {/* Valor */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <span className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {order.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
