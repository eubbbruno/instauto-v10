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
import { Plus, Pencil, Trash2, Loader2, Search, FileText, AlertCircle, Crown, Wrench, FileDown, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { downloadOSPdf, printOSPdf } from "@/lib/services/pdf-generator";

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

  const handleOpenDialog = (order?: ServiceOrderWithRelations) => {

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

  // Função para preparar dados da OS para PDF
  const prepareOSData = (order: ServiceOrderWithRelations) => {
    // Parse dos serviços (assumindo que está em JSON string)
    let services: any[] = [];
    let parts: any[] = [];
    
    try {
      if (order.services) {
        const parsed = JSON.parse(order.services);
        if (Array.isArray(parsed)) {
          services = parsed.map((s: any) => ({
            description: s.description || s.name || "Serviço",
            quantity: s.quantity || 1,
            unitPrice: s.price || s.unitPrice || 0,
            total: (s.quantity || 1) * (s.price || s.unitPrice || 0)
          }));
        }
      }
    } catch (e) {
      // Se não for JSON, criar um serviço genérico
      services = [{
        description: order.services || "Serviço",
        quantity: 1,
        unitPrice: order.labor_cost || 0,
        total: order.labor_cost || 0
      }];
    }

    return {
      // Oficina
      workshopName: workshop?.name || "Oficina",
      workshopAddress: workshop?.address,
      workshopCity: workshop?.city,
      workshopState: workshop?.state,
      workshopPhone: workshop?.phone,
      workshopEmail: workshop?.email,
      workshopCNPJ: workshop?.cnpj,
      
      // OS
      osNumber: order.order_number,
      osDate: new Date(order.created_at).toLocaleDateString('pt-BR'),
      osStatus: statusConfig[order.status as keyof typeof statusConfig]?.label || order.status,
      
      // Cliente
      clientName: order.client?.name || "Cliente",
      clientPhone: undefined,
      clientEmail: undefined,
      clientCPF: undefined,
      
      // Veículo
      vehicleBrand: order.vehicle?.brand || "",
      vehicleModel: order.vehicle?.model || "",
      vehicleYear: 0,
      vehiclePlate: order.vehicle?.plate || "",
      vehicleColor: undefined,
      vehicleMileage: undefined,
      
      // Serviços e Peças
      services: services,
      parts: parts,
      
      // Valores
      laborTotal: order.labor_cost || 0,
      partsTotal: order.parts_cost || 0,
      discount: 0,
      total: order.total || 0,
      
      // Observações
      observations: order.notes,
      warranty: "90 dias para serviços realizados"
    };
  };

  const handleDownloadPdf = (order: ServiceOrderWithRelations) => {
    const osData = prepareOSData(order);
    downloadOSPdf(osData);
  };

  const handlePrintPdf = (order: ServiceOrderWithRelations) => {
    const osData = prepareOSData(order);
    printOSPdf(osData);
  };

  // Mostrar alerta de limite próximo
  const showLimitWarning = workshop?.plan_type === "free" && ordersThisMonth >= 25;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Premium */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Dashboard / Ordens de Serviço</p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ordens de Serviço</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-600">Gerencie as ordens de serviço da oficina</p>
                {workshop?.plan_type === "free" && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
                    {ordersThisMonth}/30 OS este mês
                  </Badge>
                )}
                <Badge className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  {orders.length} total
                </Badge>
              </div>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 shadow-lg shadow-yellow-400/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Nova OS
            </button>
          </div>
        </div>

        {/* Alerta de limite próximo */}
        {showLimitWarning && (
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900 font-bold text-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                Limite Próximo - Ação Necessária
              </CardTitle>
              <CardDescription className="text-yellow-800 font-medium">
                Você está próximo do limite de 30 OS por mês do plano FREE.
                Faça upgrade para o plano PRO e tenha OS ilimitadas!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold shadow-lg shadow-yellow-500/40 hover:scale-105 transition-transform">
                <Crown className="mr-2 h-5 w-5" />
                Fazer Upgrade para PRO
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search Card */}
        <Card className="border-2 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar por número da OS, cliente ou placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 text-base focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <Card className="border-2 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-600 font-medium">Carregando ordens de serviço...</p>
            </CardContent>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <FileText className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm
                  ? "Nenhuma ordem de serviço encontrada"
                  : "Nenhuma ordem de serviço cadastrada ainda"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Tente ajustar sua busca ou limpar os filtros"
                  : clients.length > 0 
                    ? "Comece criando sua primeira ordem de serviço"
                    : "Cadastre um cliente e veículo primeiro"}
              </p>
              {!searchTerm && clients.length > 0 && (
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 font-bold shadow-lg shadow-purple-600/30 hover:scale-105 transition-transform"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Criar Primeira OS
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-purple-100 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 overflow-hidden">
            <CardHeader className="border-b-2 border-purple-100 bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50/50 py-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-gray-900">Lista de Ordens de Serviço</span>
                <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white border-0 text-base px-4 py-2 shadow-lg">
                  {filteredOrders.length} OS
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-purple-50/30 border-b-2 border-purple-100">
                    <TableHead className="font-bold text-gray-900 text-base py-4">Número</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Cliente</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Veículo</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Status</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Total</TableHead>
                    <TableHead className="font-bold text-gray-900 text-base py-4">Data</TableHead>
                    <TableHead className="text-right font-bold text-gray-900 text-base py-4">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order, index) => (
                    <TableRow 
                      key={order.id} 
                      className="group hover:bg-gradient-to-r hover:from-purple-50 hover:to-fuchsia-50/30 transition-all duration-300 border-b border-gray-100 hover:border-purple-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell className="font-black text-purple-700 py-4 text-base group-hover:text-purple-900 transition-colors">
                        {order.order_number}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 py-4 group-hover:text-purple-700 transition-colors">
                        {order.client?.name || "-"}
                      </TableCell>
                      <TableCell className="text-gray-600 py-4 font-medium group-hover:text-gray-900 transition-colors">
                        {order.vehicle
                          ? `${order.vehicle.plate} - ${order.vehicle.brand} ${order.vehicle.model}`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-sm font-bold border-2 cursor-pointer shadow-md hover:shadow-lg transition-all",
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
                      <TableCell className="font-bold text-green-600 py-4 text-base">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="text-gray-600 py-4 font-medium">
                        {new Date(order.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPdf(order)}
                            className="hover:bg-green-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                            title="Baixar PDF"
                          >
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePrintPdf(order)}
                            className="hover:bg-purple-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                            title="Imprimir"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(order)}
                            className="hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(order.id)}
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
        <ServiceOrderDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          order={editingOrder}
          clients={clients}
          workshopId={workshop?.id || null}
          onSuccess={loadOrders}
        />
      </div>
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

