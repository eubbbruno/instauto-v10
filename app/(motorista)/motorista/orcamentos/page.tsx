"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { FileText, Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Quote {
  id: string;
  workshop_id: string;
  motorist_id: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  service_type: string;
  description: string;
  status: string;
  response_message: string | null;
  estimated_price: number | null;
  created_at: string;
  workshop: {
    name: string;
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
      router.push("/login-motorista");
      return;
    }

    const abortController = new AbortController();
    let mounted = true;

    const loadQuotes = async () => {
      try {
        setLoading(true);

        // Buscar orçamentos usando email do profile
        let query = supabase
          .from("quotes")
          .select(`
            *,
            workshop:workshops(name, city, state)
          `)
          .eq("motorist_email", profile.email);

        if (abortController.signal) query = query.abortSignal(abortController.signal);

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(100);

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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/40">
            <Clock className="h-4 w-4" />
            Aguardando
          </span>
        );
      case "responded":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/40">
            <CheckCircle2 className="h-4 w-4" />
            Respondido
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/40">
            <XCircle className="h-4 w-4" />
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header Premium */}
        <div className="mb-10">
          <Link href="/motorista">
            <button className="flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 font-medium hover:gap-3 transition-all">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Dashboard
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight mb-3">
            Meus Orçamentos 📋
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe todos os orçamentos solicitados
          </p>
        </div>

        {/* Lista de Orçamentos */}
        {quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum orçamento ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece buscando oficinas e solicitando orçamentos
            </p>
            <Link href="/buscar-oficinas">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Buscar Oficinas
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {quote.workshop.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {quote.workshop.city}, {quote.workshop.state}
                    </p>
                  </div>
                  {getStatusBadge(quote.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Veículo</p>
                    <p className="font-semibold text-gray-900">
                      {quote.vehicle_brand} {quote.vehicle_model} ({quote.vehicle_year})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Serviço</p>
                    <p className="font-semibold text-gray-900">
                      {getServiceTypeLabel(quote.service_type)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Descrição</p>
                  <p className="text-gray-900">{quote.description}</p>
                </div>

                {quote.status === "responded" && quote.response_message && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      Resposta da Oficina:
                    </p>
                    <p className="text-green-800">{quote.response_message}</p>
                    {quote.estimated_price && (
                      <p className="text-lg font-bold text-green-900 mt-3">
                        Valor Estimado: R$ {quote.estimated_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                {quote.status === "rejected" && quote.response_message && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-red-900 mb-2">
                      Motivo da Recusa:
                    </p>
                    <p className="text-red-800">{quote.response_message}</p>
                  </div>
                )}

                <p className="text-xs text-gray-500">
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

