"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { FileText, Clock, CheckCircle2, XCircle, MessageSquare, DollarSign, Calendar, Loader2, Plus } from "lucide-react";
import Link from "next/link";

interface Quote {
  id: string;
  workshop_id: string;
  motorist_name: string;
  motorist_email: string;
  motorist_phone: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string | null;
  service_type: string;
  description: string;
  urgency: string;
  status: string;
  workshop_response: string | null;
  estimated_price: number | null;
  estimated_days: number | null;
  responded_at: string | null;
  created_at: string;
  workshop: {
    name: string;
    phone: string | null;
    city: string;
    state: string;
  };
}

export default function OrcamentosMotoristPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;
    
    if (!profile) {
      router.push("/login");
      return;
    }

    const abortController = new AbortController();
    let mounted = true;

    const loadQuotes = async () => {
      try {
        setLoading(true);

        console.log("🔍 [Orçamentos Motorista] Buscando orçamentos para:", profile.email);

        // Buscar orçamentos usando email do profile
        let query = supabase
          .from("quotes")
          .select(`
            *,
            workshop:workshops(name, phone, city, state)
          `)
          .eq("motorist_email", profile.email);

        if (abortController.signal) query = query.abortSignal(abortController.signal);

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(100);

        console.log("🔍 [Orçamentos Motorista] Resultado:", { count: data?.length, error });

        if (error) throw error;
        
        if (mounted) {
          setQuotes(data || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("❌ [Orçamentos] Erro ao carregar:", error);
          // Em caso de erro, mostrar lista vazia ao invés de travar
          setQuotes([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadQuotes();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile, authLoading, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full">
            Aguardando
          </span>
        );
      case "responded":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            Respondido
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
            Recusado
          </span>
        );
      default:
        return null;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      maintenance: "Manutenção",
      repair: "Reparo",
      diagnostic: "Diagnóstico",
      other: "Outro",
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header padrão */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Orçamentos</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Meus Orçamentos</h1>
            <Link
              href="/motorista/oficinas"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-5 h-5" />
              Solicitar Novo
            </Link>
          </div>
        </div>

        {/* Lista de Orçamentos */}
        {quotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum orçamento ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece buscando oficinas e solicitando orçamentos
            </p>
            <Link href="/motorista/oficinas">
              <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-lg transition-all">
                Buscar Oficinas
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {quote.workshop.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {quote.workshop.city}, {quote.workshop.state}
                    </p>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Veículo</p>
                    <p className="font-semibold text-gray-900">
                      {quote.vehicle_brand} {quote.vehicle_model} ({quote.vehicle_year})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tipo de Serviço</p>
                    <p className="font-semibold text-gray-900">
                      {getServiceTypeLabel(quote.service_type)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2">Descrição</p>
                  <p className="text-gray-900">{quote.description}</p>
                </div>

                {quote.status === "responded" && quote.workshop_response && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-semibold text-green-900">
                        Resposta da Oficina
                      </p>
                    </div>
                    <p className="text-green-800 mb-3">{quote.workshop_response}</p>
                    
                    <div className="flex flex-wrap gap-4 mb-3">
                      {quote.estimated_price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <span className="text-lg font-bold text-green-900">
                            R$ {quote.estimated_price.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {quote.estimated_days && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700">
                            {quote.estimated_days} {quote.estimated_days === 1 ? "dia" : "dias"}
                          </span>
                        </div>
                      )}
                    </div>

                    {quote.responded_at && (
                      <p className="text-xs text-green-600 mb-3">
                        Respondido em {new Date(quote.responded_at).toLocaleDateString("pt-BR")}
                      </p>
                    )}

                    {quote.workshop?.phone && (
                      <a
                        href={`https://wa.me/55${quote.workshop.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Falar no WhatsApp
                      </a>
                    )}
                  </div>
                )}

                {quote.status === "rejected" && quote.workshop_response && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm font-semibold text-red-900">
                        Orçamento Recusado
                      </p>
                    </div>
                    <p className="text-red-800">{quote.workshop_response}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
                  Solicitado em {new Date(quote.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

