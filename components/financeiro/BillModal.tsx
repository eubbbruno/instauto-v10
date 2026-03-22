"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FadeIn } from "@/components/ui/motion";

interface Bill {
  id: string;
  workshop_id: string;
  supplier?: string;
  description: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  category?: string;
  recurrence?: string;
}

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
  onSuccess: () => void;
  editingBill?: Bill | null;
}

const BILL_CATEGORIES = [
  "Aluguel",
  "Energia",
  "Água",
  "Internet",
  "Telefone",
  "Fornecedores",
  "Salários",
  "Impostos",
  "Seguro",
  "Manutenção",
  "Outros",
];

export default function BillModal({
  isOpen,
  onClose,
  workshopId,
  onSuccess,
  editingBill,
}: BillModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    supplier: editingBill?.supplier || "",
    description: editingBill?.description || "",
    amount: editingBill?.amount?.toString() || "",
    due_date: editingBill?.due_date || new Date().toISOString().split("T")[0],
    category: editingBill?.category || BILL_CATEGORIES[0],
    recurrence: editingBill?.recurrence || "once",
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
      const billData = {
        workshop_id: workshopId,
        supplier: formData.supplier.trim() || null,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        category: formData.category,
        recurrence: formData.recurrence,
        status: "pending" as const,
      };

      if (editingBill) {
        const { error } = await supabase
          .from("bills")
          .update(billData)
          .eq("id", editingBill.id);

        if (error) throw error;
        toast.success("Conta atualizada com sucesso!");
      } else {
        const { error } = await supabase.from("bills").insert(billData);

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
              {editingBill ? "Editar Conta a Pagar" : "Nova Conta a Pagar"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fornecedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fornecedor
              </label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Ex: Distribuidora de Peças XYZ"
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
                placeholder="Ex: Compra de peças para estoque"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Categoria e Recorrência */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {BILL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recorrência
                </label>
                <select
                  value={formData.recurrence}
                  onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="once">Única</option>
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                </select>
              </div>
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
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
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
