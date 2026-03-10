"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Building2, 
  Search, 
  Filter,
  Eye,
  Edit,
  Power,
  MapPin,
  Phone,
  Mail,
  Crown,
  Calendar,
  Star
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Workshop {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  address: string | null;
  plan_type: string;
  is_public: boolean;
  accepts_quotes: boolean;
  rating: number | null;
  reviews_count: number | null;
  created_at: string;
}

export default function AdminOficinasPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("");
  const [filterState, setFilterState] = useState<string>("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [searchTerm, filterPlan, filterState, workshops]);

  const loadWorkshops = async () => {
    try {
      console.log("📊 [Admin Oficinas] Carregando oficinas...");
      
      const { data, error } = await supabase
        .from("workshops")
        .select(`
          *,
          profiles!inner(email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const workshopsWithEmail = data.map(w => ({
        ...w,
        email: w.profiles.email
      }));

      setWorkshops(workshopsWithEmail);
      setFilteredWorkshops(workshopsWithEmail);
      console.log("✅ [Admin Oficinas] Carregadas:", workshopsWithEmail.length);
    } catch (error) {
      console.error("❌ [Admin Oficinas] Erro:", error);
      toast.error("Erro ao carregar oficinas");
    } finally {
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = [...workshops];

    if (searchTerm) {
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPlan) {
      filtered = filtered.filter(w => w.plan_type === filterPlan);
    }

    if (filterState) {
      filtered = filtered.filter(w => w.state === filterState);
    }

    setFilteredWorkshops(filtered);
  };

  const handleView = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setViewDialogOpen(true);
  };

  const handleEdit = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setEditData({
      name: workshop.name,
      phone: workshop.phone || "",
      city: workshop.city,
      state: workshop.state,
      address: workshop.address || "",
      plan_type: workshop.plan_type,
      is_public: workshop.is_public,
      accepts_quotes: workshop.accepts_quotes,
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedWorkshop) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("workshops")
        .update(editData)
        .eq("id", selectedWorkshop.id);

      if (error) throw error;

      toast.success("Oficina atualizada com sucesso!");
      setEditDialogOpen(false);
      loadWorkshops();
    } catch (error) {
      console.error("❌ [Admin] Erro ao salvar:", error);
      toast.error("Erro ao atualizar oficina");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (workshop: Workshop) => {
    try {
      const { error } = await supabase
        .from("workshops")
        .update({ is_public: !workshop.is_public })
        .eq("id", workshop.id);

      if (error) throw error;

      toast.success(`Oficina ${!workshop.is_public ? "ativada" : "desativada"}`);
      loadWorkshops();
    } catch (error) {
      console.error("❌ [Admin] Erro ao alterar status:", error);
      toast.error("Erro ao alterar status");
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Gerenciar Oficinas
        </h1>
        <p className="text-gray-600">
          {filteredWorkshops.length} oficina{filteredWorkshops.length !== 1 ? "s" : ""} encontrada{filteredWorkshops.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro Plano */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os planos</option>
            <option value="pro">PRO</option>
            <option value="free">FREE</option>
          </select>

          {/* Filtro Estado */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os estados</option>
            <option value="SP">São Paulo</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="MG">Minas Gerais</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="SC">Santa Catarina</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Oficina
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Localização
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Plano
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Avaliação
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkshops.map((workshop) => (
                <tr key={workshop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{workshop.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(workshop.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {workshop.email}
                      </p>
                      {workshop.phone && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {workshop.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {workshop.city}, {workshop.state}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      workshop.plan_type === "pro"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {workshop.plan_type === "pro" ? "PRO" : "FREE"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      workshop.is_public
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {workshop.is_public ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {workshop.rating && workshop.rating > 0 ? (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {workshop.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({workshop.reviews_count || 0})
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Sem avaliações</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(workshop)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(workshop)}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(workshop)}
                        className={`p-2 rounded-lg transition-colors ${
                          workshop.is_public
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-green-50 text-green-600"
                        }`}
                        title={workshop.is_public ? "Desativar" : "Ativar"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma oficina encontrada</p>
          </div>
        )}
      </div>

      {/* Dialog Ver Detalhes */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Oficina</DialogTitle>
          </DialogHeader>
          
          {selectedWorkshop && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Nome</Label>
                  <p className="font-semibold text-gray-900">{selectedWorkshop.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Plano</Label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    selectedWorkshop.plan_type === "pro"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedWorkshop.plan_type === "pro" ? "PRO" : "FREE"}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Email</Label>
                <p className="text-gray-900">{selectedWorkshop.email}</p>
              </div>

              {selectedWorkshop.phone && (
                <div>
                  <Label className="text-gray-500">Telefone</Label>
                  <p className="text-gray-900">{selectedWorkshop.phone}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Cidade</Label>
                  <p className="text-gray-900">{selectedWorkshop.city}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Estado</Label>
                  <p className="text-gray-900">{selectedWorkshop.state}</p>
                </div>
              </div>

              {selectedWorkshop.address && (
                <div>
                  <Label className="text-gray-500">Endereço</Label>
                  <p className="text-gray-900">{selectedWorkshop.address}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-500">Status</Label>
                  <p className={`font-medium ${
                    selectedWorkshop.is_public ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedWorkshop.is_public ? "Ativo" : "Inativo"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Aceita Orçamentos</Label>
                  <p className={`font-medium ${
                    selectedWorkshop.accepts_quotes ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedWorkshop.accepts_quotes ? "Sim" : "Não"}
                  </p>
                </div>
              </div>

              {selectedWorkshop.rating && selectedWorkshop.rating > 0 && (
                <div>
                  <Label className="text-gray-500">Avaliação</Label>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">
                      {selectedWorkshop.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({selectedWorkshop.reviews_count || 0} avaliações)
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-gray-500">Cadastro</Label>
                <p className="text-gray-900">
                  {new Date(selectedWorkshop.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Label className="text-gray-500">ID do Profile</Label>
                <p className="text-xs text-gray-600 font-mono">{selectedWorkshop.profile_id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Oficina</DialogTitle>
            <DialogDescription>
              Altere os dados da oficina abaixo
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkshop && (
            <div className="space-y-4">
              <div>
                <Label>Nome da Oficina</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Nome"
                />
              </div>

              <div>
                <Label>Telefone</Label>
                <Input
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Input
                    value={editData.state}
                    onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <Label>Endereço</Label>
                <Input
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>

              <div>
                <Label>Plano</Label>
                <select
                  value={editData.plan_type}
                  onChange={(e) => setEditData({ ...editData, plan_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="free">FREE</option>
                  <option value="pro">PRO</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.is_public}
                    onChange={(e) => setEditData({ ...editData, is_public: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Oficina pública</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.accepts_quotes}
                    onChange={(e) => setEditData({ ...editData, accepts_quotes: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Aceita orçamentos</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  onClick={() => setEditDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
