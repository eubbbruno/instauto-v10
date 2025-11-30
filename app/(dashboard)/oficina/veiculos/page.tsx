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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Veículos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie os veículos dos seus clientes
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por placa, marca, modelo ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {searchTerm
              ? "Nenhum veículo encontrado"
              : "Nenhum veículo cadastrado ainda"}
          </p>
          {!searchTerm && clients.length > 0 && (
            <Button
              onClick={() => handleOpenDialog()}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Veículo
            </Button>
          )}
          {!searchTerm && clients.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Cadastre um cliente primeiro para adicionar veículos
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>KM</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell>{vehicle.client?.name || "-"}</TableCell>
                  <TableCell>{vehicle.year || "-"}</TableCell>
                  <TableCell>{vehicle.color || "-"}</TableCell>
                  <TableCell>
                    {vehicle.km ? `${vehicle.km.toLocaleString()} km` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(vehicle)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

