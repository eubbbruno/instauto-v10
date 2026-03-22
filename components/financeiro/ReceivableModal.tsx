"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FadeIn } from "@/components/ui/motion";

interface Receivable {
  id: string;
  workshop_id: string;
  client_name?: string;
  description: string;
  amount: number;
  due_date: string;
  received_date?: string;
  status: "pending" | "received" | "overdue" | "cancelled";
  order_id?: string;
}

interface ReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
  onSuccess: () => void;
  editingReceivable?: Receivable | null;
}

export default function ReceivableModal({
  isOpen,
  onClose,
  workshopId,
  onSuccess,
  editingReceivable,
}: ReceivableModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client_name: editingReceivable?.client_name || "",
    description: editingReceivable?.description || "",
    amount: editingReceivable?.amount?.toString() || "",
    due_date: editingReceivable?.due_date || new Date().toISOString().split("T")[0],
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim() || !formData.amount) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const receivableData = {
        workshop_id: workshopId,
        client_name: formData.client_name.trim() || null,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        status: "pending" as const,
      };

      if (editingReceivable) {
        const { error } = await supabase
          .from("receivables")
          .update(receivableData)
          .eq("id", editingReceivable.id);

        if (error) throw error;
        toast.success("Conta atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("receivables").insert(receivableData);

        if (error) throw error;
        toast.success("Conta cadastrada com sucesso!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar conta:", error);
      toast.error("Erro ao salvar conta");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <FadeIn>
        <GlassCard className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingReceivable ? "Editar Conta a Receber" : "Nova Conta a Receber"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <input
                type="text"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="Ex: João Silva"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Serviço de revisão completa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Valor e Data de Vencimento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vencimento *
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
