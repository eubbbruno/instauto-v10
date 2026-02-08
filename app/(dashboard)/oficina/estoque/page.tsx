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
import PlanGuard from "@/components/auth/PlanGuard";
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
import { Badge } from "@/components/ui/badge";

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
        <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg shadow-red-500/40">
          🚫 Zerado
        </Badge>
      );
    }
    if (item.quantity <= item.min_quantity) {
      return (
        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg shadow-yellow-500/40 animate-pulse">
          ⚠️ Baixo ({item.quantity})
        </Badge>
      );
    }
    return (
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 py-1.5 text-sm font-bold shadow-lg shadow-green-500/40">
        ✅ OK ({item.quantity})
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 flex items-center justify-center">
        <Card className="border-2 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600 font-medium">Carregando estoque...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PlanGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Customizado */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-800 bg-clip-text text-transparent leading-tight">
                Estoque de Peças 📦
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-600 text-lg">
                  Gerencie o inventário da sua oficina
                </p>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-sm font-bold px-3 py-1">
                  {totalItems} itens
                </Badge>
                {lowStockItems > 0 && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
                    ⚠️ {lowStockItems} baixo
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={openCreateDialog} 
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold shadow-xl shadow-orange-600/40 hover:scale-105 transition-all duration-300 text-lg px-6 py-6"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Nova Peça
            </Button>
          </div>

          {/* Cards de Resumo Premium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  Total de Itens
                </CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-gray-900 tracking-tight">{totalItems}</div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Peças cadastradas
                </p>
              </CardContent>
            </Card>

            <Card className="relative bg-white rounded-2xl p-6 border-2 border-yellow-200 shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  Estoque Baixo
                </CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-yellow-600 tracking-tight">{lowStockItems}</div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Itens precisam reposição
                </p>
              </CardContent>
            </Card>

            <Card className="relative bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg shadow-green-500/20 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                  Valor Total
                </CardTitle>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-green-600 tracking-tight">
                  {totalValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  Valor em estoque
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Busca Premium */}
          <Card className="border-2 shadow-lg">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, código ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 border-2 text-base focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabela Premium */}
          {filteredItems.length === 0 ? (
            <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                  <Package className="h-10 w-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {searchTerm ? "Nenhuma peça encontrada" : "Nenhuma peça cadastrada"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? "Tente ajustar sua busca ou limpar os filtros"
                    : "Comece adicionando a primeira peça ao estoque"}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={openCreateDialog}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold shadow-lg shadow-orange-600/30 hover:scale-105 transition-transform"
                    size="lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Cadastrar Primeira Peça
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-orange-100 shadow-2xl hover:shadow-orange-200/50 transition-all duration-300 overflow-hidden">
              <CardHeader className="border-b-2 border-orange-100 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 py-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-bold text-gray-900">Itens do Estoque</span>
                  <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 text-base px-4 py-2 shadow-lg">
                    {filteredItems.length} {filteredItems.length === 1 ? 'peça' : 'peças'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-orange-50/30 border-b-2 border-orange-100">
                        <TableHead className="font-bold text-gray-900 text-base py-4">Nome</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Código</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Categoria</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Estoque</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Localização</TableHead>
                        <TableHead className="text-right font-bold text-gray-900 text-base py-4">Preço Unit.</TableHead>
                        <TableHead className="font-bold text-gray-900 text-base py-4">Fornecedor</TableHead>
                        <TableHead className="text-right font-bold text-gray-900 text-base py-4">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item, index) => (
                        <TableRow 
                          key={item.id}
                          className="group hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50/30 transition-all duration-300 border-b border-gray-100 hover:border-orange-200"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <TableCell className="font-bold text-gray-900 py-4 group-hover:text-orange-700 transition-colors">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                            {item.code || "-"}
                          </TableCell>
                          <TableCell className="py-4">
                            {item.category ? (
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300 font-medium">
                                {item.category}
                              </Badge>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="py-4">{getStockBadge(item)}</TableCell>
                          <TableCell className="text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                            {item.location || "-"}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600 py-4 text-base">
                            {(item.unit_price || 0).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell className="text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                            {item.supplier || "-"}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(item)}
                                className="hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(item)}
                                className="hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/50"
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
              </CardContent>
            </Card>
          )}

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
      </div>
    </PlanGuard>
  );
}

