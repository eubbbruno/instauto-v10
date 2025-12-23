"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Workshop } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";

function AvaliarOficinaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workshopId = searchParams.get("workshop");

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [formData, setFormData] = useState({
    motorist_name: "",
    motorist_email: "",
    comment: "",
    service_type: "",
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
    
    if (rating === 0) {
      setError("Por favor, selecione uma avaliação de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (!workshopId) {
        throw new Error("Oficina não selecionada");
      }

      const { error } = await supabase.from("reviews").insert([
        {
          workshop_id: workshopId,
          rating,
          ...formData,
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/oficina-detalhes/${workshopId}`);
      }, 3000);
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      setError(error.message || "Erro ao enviar avaliação. Tente novamente.");
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
                Avaliação Enviada!
              </h2>
              <p className="text-gray-600 mb-4">
                Obrigado por avaliar {workshop?.name}.
              </p>
              <p className="text-sm text-gray-500">
                Sua avaliação ajuda outros motoristas a fazerem melhores escolhas.
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Avaliar Oficina
            </h1>
            {workshop && (
              <p className="text-gray-600 mb-6">
                Avaliando: <span className="font-semibold">{workshop.name}</span>
              </p>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avaliação com Estrelas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sua Avaliação *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`${
                          star <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-4 text-lg font-semibold text-gray-700">
                      {rating === 1 && "Muito Ruim"}
                      {rating === 2 && "Ruim"}
                      {rating === 3 && "Regular"}
                      {rating === 4 && "Bom"}
                      {rating === 5 && "Excelente"}
                    </span>
                  )}
                </div>
              </div>

              {/* Dados do Avaliador */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seus Dados
                </h3>
                <div className="space-y-4">
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
                    <p className="text-xs text-gray-500 mt-1">
                      Seu e-mail não será exibido publicamente
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Serviço (opcional)
                    </label>
                    <select
                      value={formData.service_type}
                      onChange={(e) =>
                        setFormData({ ...formData, service_type: e.target.value })
                      }
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="">Selecione...</option>
                      <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                      <option value="Troca de Óleo">Troca de Óleo</option>
                      <option value="Freios">Freios</option>
                      <option value="Suspensão">Suspensão</option>
                      <option value="Elétrica">Elétrica</option>
                      <option value="Ar Condicionado">Ar Condicionado</option>
                      <option value="Alinhamento">Alinhamento e Balanceamento</option>
                      <option value="Diagnóstico">Diagnóstico</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu Comentário (opcional)
                </label>
                <textarea
                  rows={5}
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Conte sobre sua experiência com esta oficina..."
                  className="w-full border rounded-lg px-4 py-2"
                />
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
                  disabled={loading || rating === 0}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Enviar Avaliação"}
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

export default function AvaliarOficinaPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AvaliarOficinaContent />
    </Suspense>
  );
}

