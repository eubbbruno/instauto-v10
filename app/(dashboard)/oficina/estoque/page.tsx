"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Inventory } from "@/types/database";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlanGuard } from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  Loader2,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
} from "lucide-react";

export default function EstoquePage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Inventory[]>([]);
  const [filteredItems, setFilteredItems] = useState<Inventory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [workshopId, setWorkshopId] = useState<string | null>(null);

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [deletingItem, setDeletingItem] = useState<Inventory | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    category: "",
    quantity: 0,
    min_quantity: 5,
    unit_price: 0,
    supplier: "",
    location: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (profile?.id) {
      loadWorkshopAndItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  useEffect(() => {
    filterItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, items]);

  const loadWorkshopAndItems = async () => {
    try {
      setLoading(true);

      // Buscar workshop
      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (workshopError) throw workshopError;
      setWorkshopId(workshop.id);

      // Buscar itens do estoque
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select("*")
        .eq("workshop_id", workshop.id)
        .order("name");

      if (inventoryError) throw inventoryError;
      setItems(inventoryData || []);
    } catch (error) {
      console.error("Erro ao carregar estoque:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o estoque.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.code?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term)
    );
    setFilteredItems(filtered);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      code: "",
      category: "",
      quantity: 0,
      min_quantity: 5,
      unit_price: 0,
      supplier: "",
      location: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Inventory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      code: item.code || "",
      category: item.category || "",
      quantity: item.quantity,
      min_quantity: item.min_quantity,
      unit_price: item.unit_price || 0,
      supplier: item.supplier || "",
      location: item.location || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O nome da peça é obrigatório.",
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
      if (editingItem) {
        // Atualizar
        const { error } = await supabase
          .from("inventory")
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            code: formData.code.trim() || null,
            category: formData.category.trim() || null,
            quantity: formData.quantity,
            min_quantity: formData.min_quantity,
            unit_price: formData.unit_price,
            supplier: formData.supplier.trim() || null,
            location: formData.location.trim() || null,
          })
          .eq("id", editingItem.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Peça atualizada com sucesso.",
        });
      } else {
        // Criar
        const { error } = await supabase.from("inventory").insert({
          workshop_id: workshopId,
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          code: formData.code.trim() || null,
          category: formData.category.trim() || null,
          quantity: formData.quantity,
          min_quantity: formData.min_quantity,
          unit_price: formData.unit_price,
          supplier: formData.supplier.trim() || null,
          location: formData.location.trim() || null,
        });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Peça cadastrada com sucesso.",
        });
      }

      setIsDialogOpen(false);
      loadWorkshopAndItems();
    } catch (error) {
      console.error("Erro ao salvar peça:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a peça.",
      });
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (item: Inventory) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", deletingItem.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Peça removida com sucesso.",
      });

      setIsDeleteDialogOpen(false);
      loadWorkshopAndItems();
    } catch (error) {
      console.error("Erro ao deletar peça:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a peça.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Calcular estatísticas
  const totalItems = items.length;
  const lowStockItems = items.filter((item) => item.quantity <= item.min_quantity).length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity * (item.unit_price || 0), 0);

  const getStockBadge = (item: Inventory) => {
    if (item.quantity === 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Zerado
        </span>
      );
    }
    if (item.quantity <= item.min_quantity) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Baixo ({item.quantity})
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        OK ({item.quantity})
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <PlanGuard>
      <div className="space-y-8">
        <PageHeader
          title="Estoque de Peças"
          description="Gerencie o inventário da sua oficina"
          action={
            <Button onClick={openCreateDialog} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg shadow-blue-600/30">
              <Plus className="mr-2 h-4 w-4" />
              Nova Peça
            </Button>
          }
        />

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Itens
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
              <p className="text-xs text-gray-600 mt-1">
                Peças cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estoque Baixo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
              <p className="text-xs text-gray-600 mt-1">
                Itens precisam reposição
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Valor Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalValue.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Valor em estoque
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Pesquisar Peças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, código ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Itens do Estoque</CardTitle>
            <CardDescription>
              {filteredItems.length} {filteredItems.length === 1 ? "peça encontrada" : "peças encontradas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Nenhuma peça cadastrada
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Comece adicionando a primeira peça ao estoque.
                </p>
                <Button onClick={openCreateDialog} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Peça
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead className="text-right">Preço Unitário</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-gray-600">
                          {item.code || "-"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.category || "-"}
                        </TableCell>
                        <TableCell>{getStockBadge(item)}</TableCell>
                        <TableCell className="text-gray-600">
                          {item.location || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.unit_price || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.supplier || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(item)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Criar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Peça" : "Nova Peça"}
              </DialogTitle>
              <DialogDescription>
                {editingItem
                  ? "Atualize as informações da peça"
                  : "Cadastre uma nova peça no estoque"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nome da Peça *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Filtro de óleo"
                />
              </div>

              <div>
                <Label htmlFor="code">Código/SKU</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Ex: FO-123"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ex: Filtro de óleo para motor diesel"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="Ex: Motor, Freios, Suspensão"
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <Label htmlFor="min_quantity">Quantidade Mínima</Label>
                <Input
                  id="min_quantity"
                  type="number"
                  min="0"
                  value={formData.min_quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_quantity: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit_price: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                  placeholder="Ex: Auto Peças Brasil"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Ex: Prateleira A3"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
              >
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
                Tem certeza que deseja remover <strong>{deletingItem?.name}</strong> do
                estoque? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
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
    </PlanGuard>
  );
}

