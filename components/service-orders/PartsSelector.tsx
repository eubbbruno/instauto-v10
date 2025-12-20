"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Plus, Trash2, Package } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InventoryItem {
  id: string;
  name: string;
  code?: string;
  quantity: number;
  sell_price: number;
}

interface ServiceOrderItem {
  id?: string;
  inventory_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface PartsSelectorProps {
  workshopId: string;
  serviceOrderId?: string;
  onItemsChange: (items: ServiceOrderItem[], total: number) => void;
  initialItems?: ServiceOrderItem[];
}

export function PartsSelector({ workshopId, serviceOrderId, onItemsChange, initialItems = [] }: PartsSelectorProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<ServiceOrderItem[]>(initialItems);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form para adicionar peça
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const supabase = createClient();

  useEffect(() => {
    if (workshopId) {
      loadInventory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId]);

  useEffect(() => {
    if (serviceOrderId) {
      loadExistingItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceOrderId]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    onItemsChange(items, total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const loadInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("id, name, code, quantity, sell_price")
        .eq("workshop_id", workshopId)
        .gt("quantity", 0)
        .order("name");

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
    }
  };

  const loadExistingItems = async () => {
    try {
      const { data, error } = await supabase
        .from("service_order_items")
        .select("*")
        .eq("service_order_id", serviceOrderId);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    }
  };

  const handleAddItem = () => {
    if (!selectedInventoryId || quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione uma peça e quantidade válida.",
      });
      return;
    }

    const inventoryItem = inventory.find((i) => i.id === selectedInventoryId);
    if (!inventoryItem) return;

    if (quantity > inventoryItem.quantity) {
      toast({
        variant: "destructive",
        title: "Estoque insuficiente",
        description: `Apenas ${inventoryItem.quantity} unidades disponíveis.`,
      });
      return;
    }

    // Verificar se já existe
    const existingIndex = items.findIndex((i) => i.inventory_id === selectedInventoryId);
    
    if (existingIndex >= 0) {
      // Atualizar quantidade
      const updatedItems = [...items];
      const newQuantity = updatedItems[existingIndex].quantity + quantity;
      
      if (newQuantity > inventoryItem.quantity) {
        toast({
          variant: "destructive",
          title: "Estoque insuficiente",
          description: `Apenas ${inventoryItem.quantity} unidades disponíveis.`,
        });
        return;
      }

      updatedItems[existingIndex].quantity = newQuantity;
      updatedItems[existingIndex].total = newQuantity * updatedItems[existingIndex].unit_price;
      setItems(updatedItems);
    } else {
      // Adicionar novo
      const newItem: ServiceOrderItem = {
        inventory_id: inventoryItem.id,
        name: inventoryItem.name,
        quantity,
        unit_price: inventoryItem.sell_price,
        total: quantity * inventoryItem.sell_price,
      };
      setItems([...items, newItem]);
    }

    setDialogOpen(false);
    setSelectedInventoryId("");
    setQuantity(1);

    toast({
      title: "Peça adicionada!",
      description: `${inventoryItem.name} adicionado à OS.`,
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    
    toast({
      title: "Peça removida",
      description: "Item removido da OS.",
    });
  };

  const selectedItem = inventory.find((i) => i.id === selectedInventoryId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Peças Utilizadas</Label>
        <Button type="button" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Peça
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Nenhuma peça adicionada</p>
          <p className="text-xs text-gray-500">Clique em "Adicionar Peça" para incluir itens do estoque</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Peça</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {item.unit_price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {item.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  Total em Peças:
                </td>
                <td className="px-4 py-3 text-sm font-bold text-green-600 text-right">
                  {items.reduce((sum, item) => sum + item.total, 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Dialog Adicionar Peça */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Peça do Estoque</DialogTitle>
            <DialogDescription>
              Selecione uma peça disponível no estoque
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="inventory_item">Peça *</Label>
              <Select value={selectedInventoryId} onValueChange={setSelectedInventoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma peça..." />
                </SelectTrigger>
                <SelectContent>
                  {inventory.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} {item.code && `(${item.code})`} - Estoque: {item.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1">
                <p className="text-sm text-blue-900">
                  <strong>Disponível:</strong> {selectedItem.quantity} unidades
                </p>
                <p className="text-sm text-blue-900">
                  <strong>Preço:</strong>{" "}
                  {selectedItem.sell_price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedItem?.quantity || 999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            {selectedItem && quantity > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-900">
                  Total:{" "}
                  {(quantity * selectedItem.sell_price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem} disabled={!selectedInventoryId || quantity <= 0}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

