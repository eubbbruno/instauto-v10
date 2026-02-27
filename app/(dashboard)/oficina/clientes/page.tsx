"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Client, Workshop } from "@/types/database";
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
import { Plus, Pencil, Trash2, Loader2, Search, AlertCircle, Crown, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function ClientesPage() {
  return (
    <PlanGuard feature="Gestão de Clientes">
      <ClientesContent />
    </PlanGuard>
  );
}

function ClientesContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
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
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("workshop_id", workshop?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (client?: Client) => {
    setEditingClient(client || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Cliente excluído com sucesso.",
      });

      await loadClients();
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível excluir o cliente.",
      });
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.cpf?.includes(searchTerm)
  );

  // Mostrar alerta de limite próximo
  const showLimitWarning = workshop?.plan_type === "free" && clients.length >= 8;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Premium */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Clientes</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Clientes</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-600">
                  Gerencie sua base de clientes
                </p>
                {workshop?.plan_type === "free" && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
                    {clients.length}/10 clientes
                  </Badge>
                )}
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-sm font-medium px-3 py-1">
                  {clients.length} total
                </Badge>
              </div>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Novo Cliente
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
                Você está próximo do limite de 10 clientes do plano FREE.
                Faça upgrade para o plano PRO e tenha clientes ilimitados!
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
                placeholder="Buscar por nome, email, telefone ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-2 text-base focus:ring-2 focus:ring-green-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Tente ajustar sua busca" : "Comece adicionando seu primeiro cliente"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenDialog()}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl inline-flex items-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" />
                Adicionar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs sm:text-sm text-gray-500">
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Nome</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden md:table-cell">Email</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium">Telefone</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium hidden lg:table-cell">CPF</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm text-gray-900">{client.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden md:table-cell">{client.email || "-"}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{client.phone || "-"}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 hidden lg:table-cell">{client.cpf || "-"}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(client)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
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
        <ClientDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          client={editingClient}
          workshopId={workshop?.id || null}
          onSuccess={loadClients}
        />
      </div>
    </div>
  );
}

function ClientDialog({
  open,
  onClose,
  client,
  workshopId,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  client: Client | null;
  workshopId: string | null;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email || "",
        phone: client.phone || "",
        cpf: client.cpf || "",
        notes: client.notes || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        cpf: "",
        notes: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopId) return;

    setLoading(true);

    try {
      if (client) {
        // Update
        const { error } = await supabase
          .from("clients")
          .update(formData)
          .eq("id", client.id);

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Cliente atualizado com sucesso.",
        });
      } else {
        // Create
        const { error } = await supabase
          .from("clients")
          .insert({ ...formData, workshop_id: workshopId });

        if (error) throw error;

        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Cliente criado com sucesso.",
        });
      }

      await onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar o cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {client ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do cliente abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
                placeholder="João da Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
                placeholder="joao@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={loading}
                placeholder="(11) 98765-4321"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData({ ...formData, cpf: e.target.value })
                }
                disabled={loading}
                placeholder="123.456.789-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                disabled={loading}
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
              />
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
