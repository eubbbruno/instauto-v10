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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <PageHeader
          title="Clientes"
          description={
            <div className="flex items-center gap-3">
              <span className="text-gray-600">
                Gerencie sua base de clientes
              </span>
              {workshop?.plan_type === "free" && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-bold">
                  {clients.length}/10 clientes
                </Badge>
              )}
            </div>
          }
          action={
            <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-bold shadow-lg shadow-green-600/30 hover:scale-105 transition-transform">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          }
        />

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
          <Card className="border-2 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-16 w-16 animate-spin text-green-600 mb-4" />
              <p className="text-gray-600 font-medium">Carregando clientes...</p>
            </CardContent>
          </Card>
        ) : filteredClients.length === 0 ? (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm
                  ? "Nenhum cliente encontrado"
                  : "Nenhum cliente cadastrado ainda"}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchTerm
                  ? "Tente ajustar sua busca ou limpar os filtros"
                  : "Comece adicionando seu primeiro cliente para gerenciar melhor sua oficina"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-bold shadow-lg shadow-green-600/30 hover:scale-105 transition-transform"
                  size="lg"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Adicionar Primeiro Cliente
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-green-50/30">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Lista de Clientes
                <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                  {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-bold text-gray-900">Nome</TableHead>
                    <TableHead className="font-bold text-gray-900 hidden md:table-cell">Email</TableHead>
                    <TableHead className="font-bold text-gray-900">Telefone</TableHead>
                    <TableHead className="font-bold text-gray-900 hidden lg:table-cell">CPF</TableHead>
                    <TableHead className="text-right font-bold text-gray-900">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-green-50/30 transition-colors">
                      <TableCell className="font-semibold text-gray-900">{client.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600">{client.email || "-"}</TableCell>
                      <TableCell className="text-gray-600">{client.phone || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">{client.cpf || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(client)}
                            className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(client.id)}
                            className="hover:bg-red-100 hover:text-red-700 transition-colors"
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
