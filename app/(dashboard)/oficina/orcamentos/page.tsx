"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Quote } from "@/types/database";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Calendar,
  Car,
  User,
  Phone,
  Mail
} from "lucide-react";
import PlanGuard from "@/components/auth/PlanGuard";

export default function OrcamentosPage() {
  const { workshop } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "quoted" | "accepted">("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseData, setResponseData] = useState({
    workshop_response: "",
    estimated_price: "",
    estimated_days: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (workshop) {
      loadQuotes();
    }
  }, [workshop]);

  const loadQuotes = async () => {
    if (!workshop) return;

    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
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

  const handleRespond = async () => {
    if (!selectedQuote) return;

    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          status: "quoted",
          workshop_response: responseData.workshop_response,
          estimated_price: responseData.estimated_price ? parseFloat(responseData.estimated_price) : null,
          estimated_days: responseData.estimated_days ? parseInt(responseData.estimated_days) : null,
          responded_at: new Date().toISOString(),
        })
        .eq("id", selectedQuote.id);

      if (error) throw error;

      setShowResponseDialog(false);
      setSelectedQuote(null);
      setResponseData({ workshop_response: "", estimated_price: "", estimated_days: "" });
      loadQuotes();
    } catch (error) {
      console.error("Erro ao responder orçamento:", error);
      alert("Erro ao enviar resposta. Tente novamente.");
    }
  };

  const handleStatusChange = async (quoteId: string, newStatus: "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("quotes")
        .update({ status: newStatus })
        .eq("id", quoteId);

      if (error) throw error;
      loadQuotes();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    if (filter === "all") return true;
    return q.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      quoted: "bg-blue-100 text-blue-800 border-blue-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      expired: "bg-gray-100 text-gray-800 border-gray-200",
    };

    const labels = {
      pending: "Pendente",
      quoted: "Respondido",
      accepted: "Aceito",
      rejected: "Recusado",
      expired: "Expirado",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    const styles = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };

    const labels = {
      low: "Baixa",
      medium: "Média",
      high: "Alta",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[urgency as keyof typeof styles]}`}>
        {labels[urgency as keyof typeof labels]}
      </span>
    );
  };

  return (
    <PlanGuard feature="quotes">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orçamentos</h1>
          <p className="text-gray-600">Gerencie solicitações de orçamento dos clientes</p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Todos ({quotes.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Pendentes ({quotes.filter((q) => q.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("quoted")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "quoted"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Respondidos ({quotes.filter((q) => q.status === "quoted").length})
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "accepted"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border hover:bg-gray-50"
            }`}
          >
            Aceitos ({quotes.filter((q) => q.status === "accepted").length})
          </button>
        </div>

        {/* Lista de Orçamentos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum orçamento encontrado
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "Você ainda não recebeu solicitações de orçamento."
                : `Nenhum orçamento com status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {quote.vehicle_brand} {quote.vehicle_model} ({quote.vehicle_year})
                        </h3>
                        {getUrgencyBadge(quote.urgency)}
                      </div>
                      <p className="text-gray-600 text-sm">
                        Solicitado em {new Date(quote.created_at).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(quote.created_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {getStatusBadge(quote.status)}
                  </div>

                  {/* Informações do Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Cliente</p>
                        <p className="font-medium text-gray-900">{quote.motorist_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">Telefone</p>
                        <p className="font-medium text-gray-900">{quote.motorist_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-gray-400" size={18} />
                      <div>
                        <p className="text-xs text-gray-500">E-mail</p>
                        <p className="font-medium text-gray-900 truncate">{quote.motorist_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Descrição do Serviço:</h4>
                    <p className="text-gray-700">{quote.description}</p>
                  </div>

                  {/* Resposta da Oficina */}
                  {quote.workshop_response && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Sua Resposta:</h4>
                      <p className="text-blue-800 mb-2">{quote.workshop_response}</p>
                      {quote.estimated_price && (
                        <p className="text-sm text-blue-700">
                          <strong>Valor estimado:</strong> R$ {quote.estimated_price.toFixed(2)}
                        </p>
                      )}
                      {quote.estimated_days && (
                        <p className="text-sm text-blue-700">
                          <strong>Prazo estimado:</strong> {quote.estimated_days} dia(s)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-3">
                    {quote.status === "pending" && (
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setShowResponseDialog(true);
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Responder Orçamento
                      </button>
                    )}
                    {quote.status === "quoted" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(quote.id, "accepted")}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Marcar como Aceito
                        </button>
                        <button
                          onClick={() => handleStatusChange(quote.id, "rejected")}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          Marcar como Recusado
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog de Resposta */}
        {showResponseDialog && selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Responder Orçamento
                </h2>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Cliente:</strong> {selectedQuote.motorist_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Veículo:</strong> {selectedQuote.vehicle_brand} {selectedQuote.vehicle_model}{" "}
                    ({selectedQuote.vehicle_year})
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Solicitação:</strong> {selectedQuote.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sua Resposta *
                    </label>
                    <textarea
                      rows={5}
                      value={responseData.workshop_response}
                      onChange={(e) =>
                        setResponseData({ ...responseData, workshop_response: e.target.value })
                      }
                      placeholder="Descreva o serviço, peças necessárias, etc..."
                      className="w-full border rounded-lg px-4 py-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Estimado (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={responseData.estimated_price}
                        onChange={(e) =>
                          setResponseData({ ...responseData, estimated_price: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prazo (dias)
                      </label>
                      <input
                        type="number"
                        value={responseData.estimated_days}
                        onChange={(e) =>
                          setResponseData({ ...responseData, estimated_days: e.target.value })
                        }
                        placeholder="Ex: 3"
                        className="w-full border rounded-lg px-4 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowResponseDialog(false);
                      setSelectedQuote(null);
                      setResponseData({ workshop_response: "", estimated_price: "", estimated_days: "" });
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleRespond}
                    disabled={!responseData.workshop_response}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar Resposta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlanGuard>
  );
}

