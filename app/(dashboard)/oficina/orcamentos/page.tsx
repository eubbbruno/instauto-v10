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
  motorist_name: string;
  motorist_email: string;
  motorist_phone: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string | null;
  vehicle_id: string | null;
  service_type: string;
  description: string;
  urgency: string;
  status: string;
  workshop_response: string | null;
  estimated_price: number | null;
  estimated_days: number | null;
  responded_at: string | null;
  created_at: string;
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
      router.push("/login");
      return;
    }

    if (user) {
      loadWorkshopAndQuotes();
    }
  }, [user, authLoading, router]);

  const loadWorkshopAndQuotes = async () => {
    if (!profile) {
      console.log("🔍 [Orçamentos] Profile não encontrado");
      return;
    }

    console.log("🔍 [Orçamentos] Iniciando busca...");
    console.log("🔍 [Orçamentos] Profile ID:", profile.id);

    setLoading(true);
    try {
      // Buscar oficina
      const { data: workshop, error: workshopError } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      console.log("🔍 [Orçamentos] Workshop:", { workshop, workshopError });

      if (workshopError) throw workshopError;
      if (!workshop) {
        console.error("🔍 [Orçamentos] Workshop não encontrado!");
        router.push("/completar-cadastro");
        return;
      }

      setWorkshopId(workshop.id);
      console.log("🔍 [Orçamentos] Workshop ID:", workshop.id);

      // Buscar orçamentos
      // NOTA: quotes usa motorist_email (text), não motorist_id (FK)
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          vehicle:motorist_vehicles(make, model, year, plate)
        `)
        .eq("workshop_id", workshop.id)
        .order("created_at", { ascending: false });

      console.log("🔍 [Orçamentos] Resultado da query:", { 
        count: data?.length || 0, 
        data, 
        error 
      });

      if (error) throw error;
      
      // Dados do motorista já vêm nos campos motorist_name, motorist_email, motorist_phone
      setQuotes(data || []);
      console.log("✅ [Orçamentos] Orçamentos carregados:", data?.length || 0);
    } catch (error) {
      console.error("❌ [Orçamentos] Erro ao carregar:", error);
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
      pending: { icon: Clock, label: "Aguardando", className: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg shadow-yellow-500/40" },
      responded: { icon: CheckCircle2, label: "Respondido", className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/40" },
      accepted: { icon: CheckCircle2, label: "Aceito", className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40" },
      rejected: { icon: XCircle, label: "Recusado", className: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/40" },
      cancelled: { icon: XCircle, label: "Cancelado", className: "bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/40" },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;

    return (
      <Badge className={`${badge.className} border-0 px-4 py-2 text-sm font-bold`}>
        <Icon className="h-4 w-4 mr-2" />
        {badge.label}
      </Badge>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const badges = {
      low: { label: "🟢 Baixa", className: "bg-gray-100 text-gray-800 border-2 border-gray-300 font-bold" },
      normal: { label: "🔵 Normal", className: "bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold" },
      high: { label: "🔴 Alta", className: "bg-red-100 text-red-800 border-2 border-red-300 font-bold animate-pulse" },
    };

    const badge = badges[urgency as keyof typeof badges] || badges.normal;

    return (
      <Badge className={`${badge.className} px-3 py-1.5 text-sm`}>
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
      const motoristName = quote.motorist_name?.toLowerCase() || "";
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header Premium */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Orçamentos</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Orçamentos Recebidos</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-gray-600">Gerencie as solicitações de orçamento</p>
                {pendingCount > 0 && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
                    {pendingCount} {pendingCount === 1 ? "novo" : "novos"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-blue-50/30">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca */}
                <div className="md:col-span-2 relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por cliente, serviço ou descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 border-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status */}
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-11 border-2">
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
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {quotes.length === 0 
                  ? "Nenhum orçamento recebido ainda"
                  : "Nenhum orçamento encontrado"
                }
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {quotes.length === 0
                  ? "Quando clientes solicitarem orçamentos, eles aparecerão aqui."
                  : "Tente ajustar os filtros de busca."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map((quote, index) => (
              <Card 
                key={quote.id} 
                className="border-2 border-blue-100 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-400 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50/50 to-blue-50/30 border-b-2 border-blue-100 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusBadge(quote.status)}
                        {getUrgencyBadge(quote.urgency)}
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                        {quote.service_type}
                      </CardTitle>
                      <CardDescription className="flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {quote.motorist_name}
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
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto font-bold shadow-xl shadow-blue-600/40 hover:scale-105 transition-all duration-300 text-lg px-6 py-6"
                        size="lg"
                      >
                        <FileText className="mr-2 h-5 w-5" />
                        Responder Agora
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  {/* Veículo */}
                  {quote.vehicle && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                          <Car className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg">Veículo</span>
                      </div>
                      <p className="text-gray-900 font-semibold text-base">
                        {quote.vehicle.make} {quote.vehicle.model} - {quote.vehicle.year}
                        {quote.vehicle.plate && ` • Placa: ${quote.vehicle.plate}`}
                      </p>
                    </div>
                  )}

                  {/* Descrição */}
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                    <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Descrição do Problema:</p>
                    <p className="text-gray-900 whitespace-pre-line leading-relaxed">{quote.description}</p>
                  </div>

                  {/* Resposta */}
                  {quote.workshop_response && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-lg">
                      <p className="text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">✅ Sua Resposta:</p>
                      <p className="text-green-900 mb-3 font-medium leading-relaxed">{quote.workshop_response}</p>
                      {quote.estimated_price && (
                        <div className="bg-white rounded-lg p-4 border-2 border-green-200 mt-3">
                          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Valor Estimado: R$ {quote.estimated_price.toFixed(2)}
                          </p>
                        </div>
                      )}
                      {quote.responded_at && (
                        <p className="text-xs text-green-700 mt-3 font-medium">
                          📅 Respondido em {new Date(quote.responded_at).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Contato do Cliente */}
                  <div className="flex flex-wrap gap-4 pt-5 border-t-2 border-gray-200">
                    {quote.motorist_email && (
                      <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                        <span className="text-blue-600 font-medium">📧</span>
                        <span className="text-gray-900 font-medium">{quote.motorist_email}</span>
                      </div>
                    )}
                    {quote.motorist_phone && (
                      <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                        <span className="text-green-600 font-medium">📱</span>
                        <span className="text-gray-900 font-medium">{quote.motorist_phone}</span>
                      </div>
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
