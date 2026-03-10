"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { FileText, Search, Eye, Calendar, Building2, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Quote {
  id: string;
  motorist_name: string;
  motorist_email: string;
  workshop_id: string;
  workshop_name: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  service_type: string;
  description: string;
  status: string;
  estimated_price: string | null;
  estimated_days: string | null;
  workshop_response: string | null;
  created_at: string;
}

export default function AdminOrcamentosPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadQuotes();
  }, []);

  useEffect(() => {
    filterQuotes();
  }, [searchTerm, filterStatus, quotes]);

  const loadQuotes = async () => {
    try {
      console.log("📊 [Admin Orçamentos] Carregando orçamentos...");
      
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          workshops!inner(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const quotesWithWorkshop = data.map(q => ({
        ...q,
        workshop_name: q.workshops.name
      }));

      setQuotes(quotesWithWorkshop);
      setFilteredQuotes(quotesWithWorkshop);
      console.log("✅ [Admin Orçamentos] Carregados:", quotesWithWorkshop.length);
    } catch (error) {
      console.error("❌ [Admin Orçamentos] Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterQuotes = () => {
    let filtered = [...quotes];

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.motorist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.workshop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.vehicle_brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(q => q.status === filterStatus);
    }

    setFilteredQuotes(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
      responded: { label: "Respondido", color: "bg-blue-100 text-blue-700" },
      accepted: { label: "Aceito", color: "bg-green-100 text-green-700" },
      rejected: { label: "Rejeitado", color: "bg-red-100 text-red-700" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Todos os Orçamentos
        </h1>
        <p className="text-gray-600">
          {filteredQuotes.length} orçamento{filteredQuotes.length !== 1 ? "s" : ""} encontrado{filteredQuotes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por motorista, oficina ou veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="responded">Respondido</option>
            <option value="accepted">Aceito</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Motorista
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Oficina
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Veículo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Serviço
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{quote.motorist_name}</p>
                      <p className="text-sm text-gray-500">{quote.motorist_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{quote.workshop_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">
                      {quote.vehicle_brand} {quote.vehicle_model}
                    </p>
                    <p className="text-sm text-gray-500">{quote.vehicle_year}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{quote.service_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(quote.status)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(quote.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedQuote(quote);
                          setViewDialogOpen(true);
                        }}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum orçamento encontrado</p>
          </div>
        )}
      </div>

      {/* Dialog Ver Detalhes */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Orçamento</DialogTitle>
          </DialogHeader>
          
          {selectedQuote && (
            <div className="space-y-6">
              {/* Motorista */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Motorista
                </h3>
                <div>
                  <p className="font-semibold text-gray-900">{selectedQuote.motorist_name}</p>
                  <p className="text-sm text-gray-600">{selectedQuote.motorist_email}</p>
                </div>
              </div>

              {/* Oficina */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-yellow-600" />
                  Oficina
                </h3>
                <p className="font-semibold text-gray-900">{selectedQuote.workshop_name}</p>
              </div>

              {/* Veículo */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Veículo</h3>
                <p className="text-gray-900">
                  {selectedQuote.vehicle_brand} {selectedQuote.vehicle_model} ({selectedQuote.vehicle_year})
                </p>
              </div>

              {/* Serviço */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Serviço Solicitado</h3>
                <p className="font-medium text-gray-900">{selectedQuote.service_type}</p>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedQuote.description}</p>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Status</h3>
                {getStatusBadge(selectedQuote.status)}
              </div>

              {/* Resposta da Oficina */}
              {selectedQuote.status === "responded" && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900">Resposta da Oficina</h3>
                  
                  {selectedQuote.estimated_price && (
                    <div>
                      <p className="text-sm text-gray-600">Valor Estimado</p>
                      <p className="text-lg font-bold text-blue-600">
                        R$ {selectedQuote.estimated_price}
                      </p>
                    </div>
                  )}

                  {selectedQuote.estimated_days && (
                    <div>
                      <p className="text-sm text-gray-600">Prazo Estimado</p>
                      <p className="font-medium text-gray-900">{selectedQuote.estimated_days} dias</p>
                    </div>
                  )}

                  {selectedQuote.workshop_response && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mensagem</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedQuote.workshop_response}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Data */}
              <div>
                <p className="text-sm text-gray-500">
                  Criado em {new Date(selectedQuote.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
