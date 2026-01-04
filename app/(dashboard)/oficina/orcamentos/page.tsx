"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, FileText, Clock, CheckCircle2, XCircle, 
  AlertCircle, Car, User, Calendar, Filter 
} from "lucide-react";
import { RespondQuoteDialog } from "@/components/oficina/RespondQuoteDialog";

interface Quote {
  id: string;
  motorist_id: string;
  vehicle_id: string | null;
  service_type: string;
  description: string;
  urgency: string;
  status: string;
  workshop_response: string | null;
  estimated_price: number | null;
  responded_at: string | null;
  created_at: string;
  motorist: {
    profile_id: string;
    profiles: {
      name: string;
      email: string;
      phone: string | null;
    };
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string | null;
  } | null;
}

export default function OrcamentosOficinaPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-oficina");
      return;
    }

    if (user) {
      loadWorkshopAndQuotes();
    }
  }, [user, authLoading, router]);

  const loadWorkshopAndQuotes = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      // Buscar oficina
      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (workshopError) throw workshopError;
      if (!workshop) {
        router.push("/completar-cadastro");
        return;
      }

      setWorkshopId(workshop.id);

      // Buscar orçamentos
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          motorist:motorists!quotes_motorist_id_fkey(
            profile_id,
            profiles(name, email, phone)
          ),
          vehicle:motorist_vehicles(make, model, year, plate)
        `)
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondSuccess = () => {
    loadWorkshopAndQuotes();
    setRespondDialogOpen(false);
    setSelectedQuote(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, label: "Aguardando", className: "bg-yellow-100 text-yellow-800" },
      responded: { icon: CheckCircle2, label: "Respondido", className: "bg-green-100 text-green-800" },
      accepted: { icon: CheckCircle2, label: "Aceito", className: "bg-blue-100 text-blue-800" },
      rejected: { icon: XCircle, label: "Recusado", className: "bg-red-100 text-red-800" },
      cancelled: { icon: XCircle, label: "Cancelado", className: "bg-gray-100 text-gray-800" },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <Badge className={`${badge.className} border-0`}>
        <Icon className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      low: { label: "Baixa", className: "bg-gray-100 text-gray-700" },
      normal: { label: "Normal", className: "bg-blue-100 text-blue-700" },
      high: { label: "Alta", className: "bg-red-100 text-red-700" },
    };

    const badge = badges[urgency as keyof typeof badges] || badges.normal;

    return (
      <Badge variant="outline" className={badge.className}>
        {badge.label}
      </Badge>
    );
  };

  const filteredQuotes = quotes.filter((quote) => {
    // Filtro de status
    if (filterStatus !== "all" && quote.status !== filterStatus) {
      return false;
    }

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const motoristName = quote.motorist?.profiles?.name?.toLowerCase() || "";
      const serviceType = quote.service_type.toLowerCase();
      const description = quote.description.toLowerCase();
      
      return motoristName.includes(term) || 
             serviceType.includes(term) || 
             description.includes(term);
    }

    return true;
  });

  const pendingCount = quotes.filter(q => q.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamentos Recebidos</h1>
              <p className="text-gray-600">Gerencie as solicitações de orçamento dos clientes</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2 w-fit">
                {pendingCount} {pendingCount === 1 ? "novo" : "novos"}
              </Badge>
            )}
          </div>

          {/* Filtros */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca */}
                <div className="md:col-span-2">
                  <Input
                    placeholder="Buscar por cliente, serviço ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Status */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Aguardando</SelectItem>
                    <SelectItem value="responded">Respondido</SelectItem>
                    <SelectItem value="accepted">Aceito</SelectItem>
                    <SelectItem value="rejected">Recusado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Orçamentos */}
        {filteredQuotes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {quotes.length === 0 
                  ? "Nenhum orçamento recebido ainda"
                  : "Nenhum orçamento encontrado"
                }
              </h3>
              <p className="text-gray-600">
                {quotes.length === 0
                  ? "Quando clientes solicitarem orçamentos, eles aparecerão aqui."
                  : "Tente ajustar os filtros de busca."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <Card key={quote.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(quote.status)}
                        {getUrgencyBadge(quote.urgency)}
                      </div>
                      <CardTitle className="text-xl mb-1">
                        {quote.service_type}
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {quote.motorist?.profiles?.name || "Cliente"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(quote.created_at).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(quote.created_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    {quote.status === "pending" && (
                      <Button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setRespondDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                      >
                        Responder
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Veículo */}
                  {quote.vehicle && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold text-gray-900">Veículo</span>
                      </div>
                      <p className="text-gray-700">
                        {quote.vehicle.make} {quote.vehicle.model} - {quote.vehicle.year}
                        {quote.vehicle.plate && ` • Placa: ${quote.vehicle.plate}`}
                      </p>
                    </div>
                  )}

                  {/* Descrição */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Descrição do Problema:</p>
                    <p className="text-gray-900 whitespace-pre-line">{quote.description}</p>
                  </div>

                  {/* Resposta */}
                  {quote.workshop_response && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">Sua Resposta:</p>
                      <p className="text-blue-800 mb-2">{quote.workshop_response}</p>
                      {quote.estimated_price && (
                        <p className="text-lg font-bold text-blue-900">
                          Valor Estimado: R$ {quote.estimated_price.toFixed(2)}
                        </p>
                      )}
                      {quote.responded_at && (
                        <p className="text-xs text-blue-700 mt-2">
                          Respondido em {new Date(quote.responded_at).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Contato do Cliente */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-4 border-t">
                    {quote.motorist?.profiles?.email && (
                      <span>📧 {quote.motorist.profiles.email}</span>
                    )}
                    {quote.motorist?.profiles?.phone && (
                      <span>📱 {quote.motorist.profiles.phone}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contador */}
        {filteredQuotes.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Mostrando {filteredQuotes.length} de {quotes.length} orçamento(s)
          </div>
        )}
      </div>

      {/* Dialog de Responder */}
      {selectedQuote && workshopId && (
        <RespondQuoteDialog
          open={respondDialogOpen}
          onOpenChange={setRespondDialogOpen}
          quote={selectedQuote}
          workshopId={workshopId}
          onSuccess={handleRespondSuccess}
        />
      )}
    </div>
  );
}
