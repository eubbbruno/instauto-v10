"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, AlertCircle } from "lucide-react";

function SolicitarOrcamentoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workshopId = searchParams.get("workshop");

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    motorist_name: "",
    motorist_email: "",
    motorist_phone: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_plate: "",
    service_type: "maintenance" as "maintenance" | "repair" | "diagnostic" | "other",
    description: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const supabase = createClient();

  useEffect(() => {
    if (workshopId) {
      loadWorkshop();
    }
  }, [workshopId]);

  const loadWorkshop = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", workshopId)
        .single();

      if (error) throw error;
      setWorkshop(data);
    } catch (error) {
      console.error("Erro ao carregar oficina:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!workshopId) {
        throw new Error("Oficina não selecionada");
      }

      const { error } = await supabase.from("quotes").insert([
        {
          workshop_id: workshopId,
          ...formData,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push("/buscar-oficinas");
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao enviar orçamento:", error);
      setError(error.message || "Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Orçamento Enviado!
              </h2>
              <p className="text-gray-600 mb-4">
                Sua solicitação foi enviada para {workshop?.name}.
              </p>
              <p className="text-sm text-gray-500">
                Você receberá a resposta por e-mail em até 48 horas.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solicitar Orçamento
            </h1>
            {workshop && (
              <p className="text-gray-600 mb-6">
                Enviando para: <span className="font-semibold">{workshop.name}</span>
              </p>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Motorista */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seus Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.motorist_name}
                      onChange={(e) =>
                        setFormData({ ...formData, motorist_name: e.target.value })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.motorist_phone}
                      onChange={(e) =>
                        setFormData({ ...formData, motorist_phone: e.target.value })
                      }
                      placeholder="(00) 00000-0000"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.motorist_email}
                      onChange={(e) =>
                        setFormData({ ...formData, motorist_email: e.target.value })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Veículo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados do Veículo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicle_brand}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_brand: e.target.value })
                      }
                      placeholder="Ex: Volkswagen"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vehicle_model}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_model: e.target.value })
                      }
                      placeholder="Ex: Gol"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ano *
                    </label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.vehicle_year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vehicle_year: parseInt(e.target.value),
                        })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.vehicle_plate}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicle_plate: e.target.value })
                      }
                      placeholder="ABC-1234"
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Detalhes do Serviço */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalhes do Serviço
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Serviço *
                    </label>
                    <select
                      required
                      value={formData.service_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          service_type: e.target.value as any,
                        })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="maintenance">Manutenção Preventiva</option>
                      <option value="repair">Reparo</option>
                      <option value="diagnostic">Diagnóstico</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Urgência *
                    </label>
                    <select
                      required
                      value={formData.urgency}
                      onChange={(e) =>
                        setFormData({ ...formData, urgency: e.target.value as any })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="low">Baixa (pode esperar)</option>
                      <option value="medium">Média (alguns dias)</option>
                      <option value="high">Alta (urgente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição do Problema *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Descreva o problema ou serviço necessário com o máximo de detalhes possível..."
                      className="w-full border rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Solicitação"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SolicitarOrcamentoPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SolicitarOrcamentoContent />
    </Suspense>
  );
}

