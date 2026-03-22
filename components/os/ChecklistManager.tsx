"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  notes?: string;
  checked_at?: string;
}

interface ChecklistManagerProps {
  orderId: string;
  items: ChecklistItem[];
  onUpdate: () => void;
}

export default function ChecklistManager({ orderId, items, onUpdate }: ChecklistManagerProps) {
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleAddItem = async () => {
    if (!newItem.trim()) {
      toast.error("Digite o item do checklist");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("service_order_checklist").insert({
        order_id: orderId,
        item: newItem.trim(),
        checked: false,
      });

      if (error) throw error;

      toast.success("Item adicionado!");
      setNewItem("");
      onUpdate();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast.error("Erro ao adicionar item");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (item: ChecklistItem) => {
    try {
      const { error } = await supabase
        .from("service_order_checklist")
        .update({
          checked: !item.checked,
          checked_at: !item.checked ? new Date().toISOString() : null,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast.success(item.checked ? "Item desmarcado" : "Item verificado!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      toast.error("Erro ao atualizar item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este item?")) return;

    try {
      const { error } = await supabase.from("service_order_checklist").delete().eq("id", id);

      if (error) throw error;

      toast.success("Item removido!");
      onUpdate();
    } catch (error) {
      console.error("Erro ao remover item:", error);
      toast.error("Erro ao remover item");
    }
  };

  return (
    <div className="space-y-4">
      {/* Adicionar novo item */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
          placeholder="Ex: Verificar nível de óleo"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          onClick={handleAddItem}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Lista de itens */}
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                item.checked
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300"
              }`}
            >
              <button
                onClick={() => handleToggleItem(item)}
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked
                    ? "bg-green-600 border-green-600"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                {item.checked && <Check className="w-3 h-3 text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    item.checked ? "text-gray-500 line-through" : "text-gray-900"
                  }`}
                >
                  {item.item}
                </p>
                {item.checked && item.checked_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Verificado em {format(new Date(item.checked_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                title="Remover"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhum item no checklist</p>
          <p className="text-xs text-gray-400 mt-1">Adicione itens de verificação acima</p>
        </div>
      )}

      {/* Progresso */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-blue-600">
              {items.filter((i) => i.checked).length} / {items.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${(items.filter((i) => i.checked).length / items.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
