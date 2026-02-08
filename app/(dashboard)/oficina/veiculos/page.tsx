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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Customizado com Gradiente */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              Veículos 🚗
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-gray-600 text-lg">
                Gerencie os veículos dos seus clientes
              </p>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm font-bold px-3 py-1">
                {vehicles.length} total
              </Badge>
            </div>
          </div>
          <Button 
            onClick={() => handleOpenDialog()} 
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold shadow-xl shadow-blue-600/40 hover:scale-105 transition-all duration-300 text-lg px-6 py-6"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Novo Veículo
          </Button>
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
          <Card className="border-2 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Carregando veículos...</p>
            </CardContent>
          </Card>
        ) : filteredVehicles.length === 0 ? (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center">
                <CarIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm
                  ? "Nenhum veículo encontrado"
                  : "Nenhum veículo cadastrado ainda"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Tente ajustar sua busca ou limpar os filtros"
                  : clients.length > 0
                    ? "Comece adicionando o primeiro veículo para gerenciar melhor sua oficina"
                    : "Cadastre um cliente primeiro para adicionar veículos"}
              </p>
              {!searchTerm && clients.length > 0 && (
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 font-bold shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Primeiro Veículo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-blue-100 shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 overflow-hidden">
            <CardHeader className="border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50/50 py-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CarIcon className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-gray-900">Lista de Veículos</span>
                <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-base px-4 py-2 shadow-lg">
                  {filteredVehicles.length} {filteredVehicles.length === 1 ? 'veículo' : 'veículos'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50/30 border-b-2 border-blue-100">
                    <TableHead className="font-bold text-gray-900 text-base py-4">Placa</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Veículo</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4 hidden md:table-cell">Cliente</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4 hidden lg:table-cell">Ano</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4 hidden lg:table-cell">Cor</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4 hidden xl:table-cell">KM</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 text-base py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle, index) => (
                    <TableRow 
                      key={vehicle.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50/30 transition-all duration-300 border-b border-gray-100 hover:border-blue-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-black text-blue-700 py-4 text-base group-hover:text-blue-900 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                            🚗
                          </div>
                          {vehicle.plate}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-gray-900 py-4 group-hover:text-blue-700 transition-colors">
                        {vehicle.brand} {vehicle.model}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                        {vehicle.client?.name || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600 py-4 group-hover:text-gray-900 transition-colors">
                        {vehicle.year || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-4">
                        {vehicle.color ? (
                          <Badge className="bg-gray-100 text-gray-800 border-gray-300 font-medium">
                            {vehicle.color}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                        {vehicle.km ? `${vehicle.km.toLocaleString()} km` : "-"}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(vehicle)}
                            className="hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(vehicle.id)}
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
          </Card>
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

