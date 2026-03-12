"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Workshop, Review } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Star, CheckCircle2, MessageCircle, Clock, Award, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function OficinaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const workshopId = params.id as string;

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    loadWorkshopData();
  }, [workshopId]);

  const loadWorkshopData = async () => {
    try {
      console.log("🔍 [Detalhes] Buscando oficina ID:", workshopId);
      
      if (!workshopId) {
        console.error("❌ [Detalhes] ID da oficina não fornecido");
        setWorkshop(null);
        setLoading(false);
        return;
      }

      // Carregar dados da oficina
      const { data: workshopData, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", workshopId)
        .eq("is_public", true)
        .single();

      console.log("🔍 [Detalhes] Resultado workshop:", { workshopData, workshopError });

      if (workshopError) {
        console.error("❌ [Detalhes] Erro ao buscar oficina:", workshopError);
        throw workshopError;
      }
      
      if (!workshopData) {
        console.error("❌ [Detalhes] Oficina não encontrada ou não está pública");
        setWorkshop(null);
        setLoading(false);
        return;
      }

      setWorkshop(workshopData);
      console.log("✅ [Detalhes] Oficina carregada:", workshopData.name);

      // Carregar avaliações
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("workshop_id", workshopId)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(10);

      console.log("🔍 [Detalhes] Avaliações:", { count: reviewsData?.length, reviewsError });

      if (reviewsError) {
        console.error("⚠️ [Detalhes] Erro ao buscar avaliações:", reviewsError);
        // Não bloqueia - continua sem avaliações
      } else {
        setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error("❌ [Detalhes] Erro ao carregar dados:", error);
      setWorkshop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20 sm:pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20 sm:pt-24">
          <p className="text-xl text-gray-600">Oficina não encontrada</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Header com Gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 h-40 sm:h-56 pt-20 sm:pt-24" />
      
      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 pb-12">
        
        {/* Cards de Destaque (Stats) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Avaliação Média */}
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">Avaliação</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {workshop.rating?.toFixed(1) || "0.0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {workshop.reviews_count || 0} {workshop.reviews_count === 1 ? "review" : "reviews"}
            </p>
          </div>
          
          {/* Tempo de Resposta */}
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">Resposta</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">~24h</p>
            <p className="text-xs text-gray-500 mt-1">tempo médio</p>
          </div>
          
          {/* Orçamentos */}
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">Orçamentos</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">100+</p>
            <p className="text-xs text-gray-500 mt-1">realizados</p>
          </div>
          
          {/* Experiência */}
          <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-600 uppercase">Confiável</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">✓</p>
            <p className="text-xs text-gray-500 mt-1">verificado</p>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre a Oficina */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Sobre a Oficina
              </h2>
              {workshop.description ? (
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {workshop.description}
                </p>
              ) : (
                <p className="text-gray-500 text-sm sm:text-base">
                  Esta oficina ainda não adicionou uma descrição.
                </p>
              )}
            </div>

            {/* Serviços Oferecidos */}
            {workshop.services && workshop.services.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Serviços Oferecidos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workshop.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700 text-sm sm:text-base">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Avaliações dos Clientes */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Avaliações dos Clientes
                </h2>
                <Link
                  href={`/avaliar-oficina?workshop=${workshop.id}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base hidden sm:block"
                >
                  Deixar avaliação
                </Link>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2 text-sm sm:text-base">
                    Nenhuma avaliação ainda
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Seja o primeiro a avaliar esta oficina!
                  </p>
                  <Link
                    href={`/avaliar-oficina?workshop=${workshop.id}`}
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Avaliar Agora
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {review.motorist_name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                              {review.motorist_name}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">
                          {new Date(review.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed ml-0 sm:ml-15">
                          {review.comment}
                        </p>
                      )}

                      {review.service_type && (
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ml-0 sm:ml-15">
                          {review.service_type}
                        </span>
                      )}

                      {review.response && (
                        <div className="mt-4 bg-blue-50 p-4 rounded-lg ml-0 sm:ml-15">
                          <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
                            Resposta da oficina:
                          </p>
                          <p className="text-xs sm:text-sm text-blue-800">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Localização */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Localização
              </h3>
              <div className="space-y-2 text-sm sm:text-base">
                {workshop.address && (
                  <p className="text-gray-700">{workshop.address}</p>
                )}
                <p className="text-gray-700">
                  {workshop.city}, {workshop.state}
                </p>
                {workshop.zip_code && (
                  <p className="text-gray-600">CEP: {workshop.zip_code}</p>
                )}
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contato
              </h3>
              <div className="space-y-3">
                {workshop.phone && (
                  <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                    <Phone className="text-blue-600 flex-shrink-0" size={18} />
                    <span>{workshop.phone}</span>
                  </div>
                )}
                {workshop.email && (
                  <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                    <Mail className="text-blue-600 flex-shrink-0" size={18} />
                    <span className="break-all">{workshop.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Horário
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Segunda a Sexta</span>
                  <span className="text-gray-900 font-medium">8h às 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sábado</span>
                  <span className="text-gray-900 font-medium">8h às 12h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domingo</span>
                  <span className="text-gray-500">Fechado</span>
                </div>
              </div>
            </div>

            {/* CTA Avaliar */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl sm:rounded-2xl border-2 border-yellow-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Já foi cliente?
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                Compartilhe sua experiência e ajude outros motoristas.
              </p>
              <Link
                href={`/avaliar-oficina?workshop=${workshop.id}`}
                className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-bold"
              >
                ⭐ Deixar Avaliação
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

