"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Vehicle, Workshop } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
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
import { Plus, Pencil, Trash2, Loader2, Search, Car as CarIcon } from "lucide-react";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlateSearchInput } from "@/components/ui/PlateSearchInput";

interface ClientOption {
  id: string;
  name: string;
}

interface VehicleWithClient extends Vehicle {
  client?: {
    id: string;
    name: string;
  };
}

export default function VeiculosPage() {
  return (
    <PlanGuard feature="Gestão de Veículos">
      <VeiculosContent />
    </PlanGuard>
  );
}

function VeiculosContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<VehicleWithClient[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleWithClient | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadWorkshop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (workshop) {
      loadClients();
      loadVehicles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshop]);

  const loadWorkshop = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;
      setWorkshop(data);
    } catch (error) {
      console.error("Erro ao carregar oficina:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados da oficina.",
      });
    }
  };

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name")
        .eq("workshop_id", workshop?.id)
        .order("name");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
      });
    }
  };

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select(`
          *,
          client:clients(id, name)
        `)
        .eq("workshop_id", workshop?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os veículos.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (vehicle?: VehicleWithClient) => {
    if (clients.length === 0 && !vehicle) {
      toast({
        variant: "destructive",
        title: "Atenção",
        description: "Você precisa cadastrar pelo menos um cliente antes de adicionar veículos.",
      });
      return;
    }
    setEditingVehicle(vehicle || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Veículo excluído com sucesso.",
      });

      await loadVehicles();
    } catch (error: any) {
      console.error("Erro ao excluir veículo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o veículo.",
      });
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Premium */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Veículos</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Veículos</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-600">Gerencie os veículos dos seus clientes</p>
                <Badge className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  {vehicles.length} total
                </Badge>
              </div>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Novo Veículo
            </button>
          </div>
        </div>

        {/* Search Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por placa, marca, modelo ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 text-base focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Nenhum veículo encontrado" : "Nenhum veículo cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Tente ajustar sua busca" : clients.length > 0 ? "Comece adicionando seu primeiro veículo" : "Cadastre um cliente primeiro"}
            </p>
            {!searchTerm && clients.length > 0 && (
              <button
                onClick={() => handleOpenDialog()}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Adicionar Veículo
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs sm:text-sm text-gray-500">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Placa</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Veículo</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden md:table-cell">Cliente</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden lg:table-cell">Ano</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden lg:table-cell">Cor</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVehicles.map((vehicle) => (
                    <tr 
                      key={vehicle.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                            🚗
                          </div>
                          <span className="font-bold text-sm text-blue-700">{vehicle.plate}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden md:table-cell">
                        {vehicle.client?.name || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden lg:table-cell">
                        {vehicle.year || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        {vehicle.color ? (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {vehicle.color}
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenDialog(vehicle)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Dialog */}
        <VehicleDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          vehicle={editingVehicle}
          clients={clients}
          workshopId={workshop?.id || null}
          onSuccess={loadVehicles}
        />
      </div>
    </div>
  );
}

function VehicleDialog({
  open,
  onClose,
  vehicle,
  clients,
  workshopId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleWithClient | null;
  clients: ClientOption[];
  workshopId: string | null;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client_id: "",
    plate: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    km: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        client_id: vehicle.client_id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year?.toString() || "",
        color: vehicle.color || "",
        km: vehicle.km?.toString() || "",
        notes: vehicle.notes || "",
      });
    } else {
      setFormData({
        client_id: "",
        plate: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        km: "",
        notes: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopId) return;

    setLoading(true);

    try {
      const vehicleData = {
        client_id: formData.client_id,
        workshop_id: workshopId,
        plate: formData.plate.toUpperCase(),
        brand: formData.brand,
        model: formData.model,
        year: formData.year ? parseInt(formData.year) : null,
        color: formData.color || null,
        km: formData.km ? parseInt(formData.km) : null,
        notes: formData.notes || null,
      };

      if (vehicle) {
        // Update
        const { error } = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", vehicle.id);

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Veículo atualizado com sucesso.",
        });
      } else {
        // Create
        const { error } = await supabase
          .from("vehicles")
          .insert(vehicleData);

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Veículo cadastrado com sucesso.",
        });
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar veículo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar o veículo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? "Editar Veículo" : "Novo Veículo"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do veículo abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Busca por Placa */}
            {!vehicle && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 col-span-2">
                <PlateSearchInput 
                  onVehicleFound={(data) => {
                    // Preencher campos automaticamente
                    if (data.marca) setFormData(prev => ({ ...prev, brand: data.marca }));
                    if (data.modelo) setFormData(prev => ({ ...prev, model: data.modelo }));
                    if (data.anoModelo) setFormData(prev => ({ ...prev, year: data.anoModelo.toString() }));
                    if (data.cor) setFormData(prev => ({ ...prev, color: data.cor }));
                  }}
                  onPlateChange={(plate) => setFormData(prev => ({ ...prev, plate }))}
                />
                <p className="text-xs text-gray-600 mt-2">
                  💡 Digite a placa para preencher os dados automaticamente, ou preencha manualmente abaixo.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Cliente */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <select
                  id="client_id"
                  value={formData.client_id}
                  onChange={(e) =>
                    setFormData({ ...formData, client_id: e.target.value })
                  }
                  required
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Placa */}
              <div className="space-y-2">
                <Label htmlFor="plate">Placa *</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({ ...formData, plate: e.target.value.toUpperCase() })
                  }
                  required
                  disabled={loading}
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>

              {/* Marca */}
              <div className="space-y-2">
                <Label htmlFor="brand">Marca *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  required
                  disabled={loading}
                  placeholder="Volkswagen"
                />
              </div>

              {/* Modelo */}
              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                  disabled={loading}
                  placeholder="Gol"
                />
              </div>

              {/* Ano */}
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: e.target.value })
                  }
                  disabled={loading}
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              {/* Cor */}
              <div className="space-y-2">
                <Label htmlFor="color">Cor</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  disabled={loading}
                  placeholder="Prata"
                />
              </div>

              {/* KM */}
              <div className="space-y-2">
                <Label htmlFor="km">Quilometragem</Label>
                <Input
                  id="km"
                  type="number"
                  value={formData.km}
                  onChange={(e) =>
                    setFormData({ ...formData, km: e.target.value })
                  }
                  disabled={loading}
                  placeholder="50000"
                  min="0"
                />
              </div>

              {/* Observações */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  disabled={loading}
                  placeholder="Informações adicionais sobre o veículo..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

