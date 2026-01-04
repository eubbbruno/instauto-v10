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
    if (authLoading) {
      return;
    }
    
    if (!authLoading && !profile) {
      router.push("/login-motorista");
      return;
    }
    
    if (profile) {
      loadQuotes();
    }
  }, [profile, authLoading, router]);

  const loadQuotes = async () => {
    try {
      // Buscar motorista
      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile?.id)
        .single();

      if (!motorist) {
        setLoading(false);
        return;
      }

      // Buscar orçamentos com dados da oficina
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          workshop:workshops(name, city, state)
        `)
        .eq("motorist_id", motorist.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
            <Clock className="h-4 w-4" />
            Aguardando
          </span>
        );
      case "responded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
            <CheckCircle2 className="h-4 w-4" />
            Respondido
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/motorista">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-5 w-5" />
              Voltar ao Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Orçamentos
          </h1>
          <p className="text-gray-600">
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

