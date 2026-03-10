"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { 
  Users, 
  Search, 
  Eye,
  Edit,
  Mail,
  Phone,
  Calendar,
  Car,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Motorist {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  vehicles_count?: number;
  quotes_count?: number;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  color: string | null;
}

export default function AdminMotoristasPage() {
  const [motorists, setMotorists] = useState<Motorist[]>([]);
  const [filteredMotorists, setFilteredMotorists] = useState<Motorist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMotorist, setSelectedMotorist] = useState<Motorist | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadMotorists();
  }, []);

  useEffect(() => {
    filterMotorists();
  }, [searchTerm, motorists]);

  const loadMotorists = async () => {
    try {
      console.log("📊 [Admin Motoristas] Carregando motoristas...");
      
      const { data, error } = await supabase
        .from("motorists")
        .select(`
          *,
          profiles!inner(email, name, phone)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Buscar contagem de veículos e orçamentos para cada motorista
      const motoristsWithCounts = await Promise.all(
        data.map(async (m) => {
          const { count: vehiclesCount } = await supabase
            .from("motorist_vehicles")
            .select("*", { count: "exact", head: true })
            .eq("motorist_id", m.id);

          const { count: quotesCount } = await supabase
            .from("quotes")
            .select("*", { count: "exact", head: true })
            .eq("motorist_email", m.profiles.email);

          return {
            ...m,
            name: m.profiles.name,
            email: m.profiles.email,
            phone: m.profiles.phone,
            vehicles_count: vehiclesCount || 0,
            quotes_count: quotesCount || 0,
          };
        })
      );

      setMotorists(motoristsWithCounts);
      setFilteredMotorists(motoristsWithCounts);
      console.log("✅ [Admin Motoristas] Carregados:", motoristsWithCounts.length);
    } catch (error) {
      console.error("❌ [Admin Motoristas] Erro:", error);
      toast.error("Erro ao carregar motoristas");
    } finally {
      setLoading(false);
    }
  };

  const filterMotorists = () => {
    let filtered = [...motorists];

    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMotorists(filtered);
  };

  const handleView = async (motorist: Motorist) => {
    setSelectedMotorist(motorist);
    
    // Buscar veículos do motorista
    const { data: vehiclesData } = await supabase
      .from("motorist_vehicles")
      .select("*")
      .eq("motorist_id", motorist.id);
    
    setVehicles(vehiclesData || []);
    setViewDialogOpen(true);
  };

  const handleEdit = (motorist: Motorist) => {
    setSelectedMotorist(motorist);
    setEditData({
      name: motorist.name,
      phone: motorist.phone || "",
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedMotorist) return;
    
    setSaving(true);
    try {
      // Atualizar profile (nome e telefone)
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editData.name,
          phone: editData.phone,
        })
        .eq("id", selectedMotorist.profile_id);

      if (error) throw error;

      toast.success("Motorista atualizado com sucesso!");
      setEditDialogOpen(false);
      loadMotorists();
    } catch (error) {
      console.error("❌ [Admin] Erro ao salvar:", error);
      toast.error("Erro ao atualizar motorista");
    } finally {
      setSaving(false);
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
          Gerenciar Motoristas
        </h1>
        <p className="text-gray-600">
          {filteredMotorists.length} motorista{filteredMotorists.length !== 1 ? "s" : ""} encontrado{filteredMotorists.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Motorista
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Contato
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Veículos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Orçamentos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Cadastro
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMotorists.map((motorist) => (
                <tr key={motorist.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{motorist.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {motorist.email}
                      </p>
                      {motorist.phone && (
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {motorist.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-bold text-gray-900">
                        {motorist.vehicles_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-yellow-600" />
                      <span className="text-lg font-bold text-gray-900">
                        {motorist.quotes_count}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(motorist.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleView(motorist)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(motorist)}
                        className="p-2 hover:bg-yellow-50 text-yellow-600 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMotorists.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum motorista encontrado</p>
          </div>
        )}
      </div>

      {/* Dialog Ver Detalhes */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Motorista</DialogTitle>
          </DialogHeader>
          
          {selectedMotorist && (
            <div className="space-y-6">
              {/* Informações Pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Informações Pessoais</h3>
                
                <div>
                  <Label className="text-gray-500">Nome</Label>
                  <p className="font-semibold text-gray-900">{selectedMotorist.name}</p>
                </div>

                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="text-gray-900">{selectedMotorist.email}</p>
                </div>

                {selectedMotorist.phone && (
                  <div>
                    <Label className="text-gray-500">Telefone</Label>
                    <p className="text-gray-900">{selectedMotorist.phone}</p>
                  </div>
                )}

                <div>
                  <Label className="text-gray-500">Cadastro</Label>
                  <p className="text-gray-900">
                    {new Date(selectedMotorist.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Estatísticas</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Veículos</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedMotorist.vehicles_count}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm text-gray-600">Orçamentos</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedMotorist.quotes_count}
                    </p>
                  </div>
                </div>
              </div>

              {/* Veículos */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">
                  Veículos Cadastrados ({vehicles.length})
                </h3>
                
                {vehicles.length > 0 ? (
                  <div className="space-y-3">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-sm text-gray-600">
                              {vehicle.year} • {vehicle.plate}
                              {vehicle.color && ` • ${vehicle.color}`}
                            </p>
                          </div>
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum veículo cadastrado
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Label className="text-gray-500">ID do Profile</Label>
                <p className="text-xs text-gray-600 font-mono">{selectedMotorist.profile_id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Motorista</DialogTitle>
            <DialogDescription>
              Altere os dados do motorista abaixo
            </DialogDescription>
          </DialogHeader>
          
          {selectedMotorist && (
            <div className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Nome completo"
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
