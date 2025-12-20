"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceOrder, Vehicle, Workshop } from "@/types/database";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Loader2, Search, FileText, AlertCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanGuard } from "@/components/auth/PlanGuard";

interface ClientOption {
  id: string;
  name: string;
}

interface ServiceOrderWithRelations extends ServiceOrder {
  client?: {
    id: string;
    name: string;
  };
  vehicle?: {
    id: string;
    plate: string;
    brand: string;
    model: string;
  };
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  approved: { label: "Aprovada", color: "bg-purple-100 text-purple-800 border-purple-300" },
  in_progress: { label: "Em Andamento", color: "bg-blue-100 text-blue-800 border-blue-300" },
  completed: { label: "Concluída", color: "bg-green-100 text-green-800 border-green-300" },
  cancelled: { label: "Cancelada", color: "bg-red-100 text-red-800 border-red-300" },
};

export default function OrdensPage() {
  return (
    <PlanGuard feature="Ordens de Serviço">
      <OrdensContent />
    </PlanGuard>
  );
}

function OrdensContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<ServiceOrderWithRelations[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ServiceOrderWithRelations | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [ordersThisMonth, setOrdersThisMonth] = useState(0);
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
      loadOrders();
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
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          client:clients(id, name),
          vehicle:vehicles(id, plate, brand, model)
        `)
        .eq("workshop_id", workshop?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);

      // Contar OS do mês atual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count } = await supabase
        .from("service_orders")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop?.id)
        .gte("created_at", firstDay.toISOString());

      setOrdersThisMonth(count || 0);
    } catch (error) {
      console.error("Erro ao carregar ordens:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as ordens de serviço.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCanAddOrder = (): boolean => {
    if (workshop?.plan_type === "pro") {
      return true;
    }

    // Plano FREE: limite de 30 OS por mês
    if (ordersThisMonth >= 30) {
      toast({
        variant: "destructive",
        title: "Limite atingido",
        description: "Você atingiu o limite de 30 OS por mês do plano FREE. Faça upgrade para o plano PRO!",
      });
      return false;
    }

    return true;
  };

  const handleOpenDialog = (order?: ServiceOrderWithRelations) => {
    if (!order && !checkCanAddOrder()) {
      return;
    }

    if (clients.length === 0 && !order) {
      toast({
        variant: "destructive",
        title: "Atenção",
        description: "Você precisa cadastrar pelo menos um cliente antes de criar ordens de serviço.",
      });
      return;
    }

    setEditingOrder(order || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOrder(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase.from("service_orders").delete().eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Ordem de serviço excluída com sucesso.",
      });

      await loadOrders();
    } catch (error: any) {
      console.error("Erro ao excluir ordem:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir a ordem de serviço.",
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("service_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Status atualizado!",
        description: `Status alterado para ${statusConfig[newStatus as keyof typeof statusConfig].label}.`,
      });

      await loadOrders();
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status.",
      });
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle?.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mostrar alerta de limite próximo
  const showLimitWarning = workshop?.plan_type === "free" && ordersThisMonth >= 25;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ordens de Serviço"
        description={`Gerencie as ordens de serviço da oficina${
          workshop?.plan_type === "free" ? ` (${ordersThisMonth}/30 OS este mês)` : ""
        }`}
        action={
          <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg shadow-blue-600/30">
            <Plus className="mr-2 h-4 w-4" />
            Nova OS
          </Button>
        }
      />

      {/* Alerta de limite próximo */}
      {showLimitWarning && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              Limite próximo
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Você está próximo do limite de 30 OS por mês do plano FREE.
              Faça upgrade para o plano PRO e tenha OS ilimitadas!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" className="bg-yellow-600 hover:bg-yellow-700">
              <Crown className="mr-2 h-4 w-4" />
              Fazer Upgrade para PRO
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por número da OS, cliente ou placa..."
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
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {searchTerm
              ? "Nenhuma ordem de serviço encontrada"
              : "Nenhuma ordem de serviço cadastrada ainda"}
          </p>
          {!searchTerm && clients.length > 0 && (
            <Button
              onClick={() => handleOpenDialog()}
              variant="outline"
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira OS
            </Button>
          )}
          {!searchTerm && clients.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Cadastre um cliente e veículo primeiro
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.client?.name || "-"}</TableCell>
                  <TableCell>
                    {order.vehicle
                      ? `${order.vehicle.plate} - ${order.vehicle.brand} ${order.vehicle.model}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border cursor-pointer",
                        statusConfig[order.status as keyof typeof statusConfig].color
                      )}
                    >
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <option key={value} value={value}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="font-semibold">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(order)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
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
      <ServiceOrderDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        order={editingOrder}
        clients={clients}
        workshopId={workshop?.id || null}
        onSuccess={loadOrders}
      />
    </div>
  );
}

function ServiceOrderDialog({
  open,
  onClose,
  order,
  clients,
  workshopId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  order: ServiceOrderWithRelations | null;
  clients: ClientOption[];
  workshopId: string | null;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    client_id: "",
    vehicle_id: "",
    status: "pending",
    services: "",
    labor_cost: "",
    parts_cost: "",
    notes: "",
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (order) {
      setFormData({
        client_id: order.client_id || "",
        vehicle_id: order.vehicle_id || "",
        status: order.status,
        services: order.services,
        labor_cost: order.labor_cost.toString(),
        parts_cost: order.parts_cost.toString(),
        notes: order.notes || "",
      });
      if (order.client_id) {
        loadVehicles(order.client_id);
      }
    } else {
      setFormData({
        client_id: "",
        vehicle_id: "",
        status: "pending",
        services: "",
        labor_cost: "",
        parts_cost: "",
        notes: "",
      });
      setVehicles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, open]);

  const loadVehicles = async (clientId: string) => {
    try {
      setLoadingVehicles(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("client_id", clientId)
        .order("plate");

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData({ ...formData, client_id: clientId, vehicle_id: "" });
    if (clientId) {
      loadVehicles(clientId);
    } else {
      setVehicles([]);
    }
  };

  const generateOrderNumber = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from("service_orders")
      .select("*", { count: "exact", head: true })
      .eq("workshop_id", workshopId)
      .gte("created_at", `${year}-01-01`);

    return `OS-${year}-${String((count || 0) + 1).padStart(4, "0")}`;
  };

  const calculateTotal = () => {
    const labor = parseFloat(formData.labor_cost) || 0;
    const parts = parseFloat(formData.parts_cost) || 0;
    return labor + parts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopId) return;

    setLoading(true);

    try {
      const total = calculateTotal();
      const orderData = {
        workshop_id: workshopId,
        client_id: formData.client_id || null,
        vehicle_id: formData.vehicle_id || null,
        status: formData.status,
        services: formData.services,
        labor_cost: parseFloat(formData.labor_cost) || 0,
        parts_cost: parseFloat(formData.parts_cost) || 0,
        total,
        notes: formData.notes || null,
      };

      if (order) {
        // Update
        const { error } = await supabase
          .from("service_orders")
          .update(orderData)
          .eq("id", order.id);

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Ordem de serviço atualizada com sucesso.",
        });
      } else {
        // Create
        const orderNumber = await generateOrderNumber();
        const { error } = await supabase
          .from("service_orders")
          .insert({ ...orderData, order_number: orderNumber });

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: `Ordem de serviço ${orderNumber} criada com sucesso.`,
        });
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar ordem:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar a ordem de serviço.",
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
            {order ? `Editar OS ${order.order_number}` : "Nova Ordem de Serviço"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da ordem de serviço abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Cliente */}
              <div className="space-y-2">
                <Label htmlFor="client_id">Cliente *</Label>
                <select
                  id="client_id"
                  value={formData.client_id}
                  onChange={(e) => handleClientChange(e.target.value)}
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

              {/* Veículo */}
              <div className="space-y-2">
                <Label htmlFor="vehicle_id">Veículo *</Label>
                <select
                  id="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_id: e.target.value })
                  }
                  required
                  disabled={loading || !formData.client_id || loadingVehicles}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">
                    {loadingVehicles
                      ? "Carregando..."
                      : !formData.client_id
                      ? "Selecione um cliente primeiro"
                      : vehicles.length === 0
                      ? "Cliente sem veículos"
                      : "Selecione um veículo"}
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {Object.entries(statusConfig).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Serviços */}
              <div className="space-y-2 col-span-2">
                <Label htmlFor="services">Serviços *</Label>
                <Textarea
                  id="services"
                  value={formData.services}
                  onChange={(e) =>
                    setFormData({ ...formData, services: e.target.value })
                  }
                  required
                  disabled={loading}
                  placeholder="Descreva os serviços a serem realizados..."
                  rows={3}
                />
              </div>

              {/* Mão de Obra */}
              <div className="space-y-2">
                <Label htmlFor="labor_cost">Mão de Obra (R$)</Label>
                <Input
                  id="labor_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.labor_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, labor_cost: e.target.value })
                  }
                  disabled={loading}
                  placeholder="0,00"
                />
              </div>

              {/* Peças */}
              <div className="space-y-2">
                <Label htmlFor="parts_cost">Peças (R$)</Label>
                <Input
                  id="parts_cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.parts_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, parts_cost: e.target.value })
                  }
                  disabled={loading}
                  placeholder="0,00"
                />
              </div>

              {/* Total */}
              <div className="space-y-2 col-span-2">
                <Label>Total</Label>
                <div className="text-2xl font-bold text-green-600">
                  R$ {calculateTotal().toFixed(2).replace(".", ",")}
                </div>
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
                  placeholder="Informações adicionais sobre a ordem de serviço..."
                  rows={2}
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

