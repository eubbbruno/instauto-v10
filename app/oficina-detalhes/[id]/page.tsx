"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Workshop, Review } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Star, CheckCircle2 } from "lucide-react";
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
      // Carregar dados da oficina
      const { data: workshopData, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", workshopId)
        .eq("is_public", true)
        .single();

      if (workshopError) throw workshopError;
      setWorkshop(workshopData);

      // Carregar avaliações
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("workshop_id", workshopId)
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      // NÃO redirecionar - apenas mostrar erro
      setWorkshop(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl text-gray-600">Oficina não encontrada</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Oficina */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {workshop.name}
                </h1>

                {/* Rating */}
                {workshop.total_reviews && workshop.total_reviews > 0 ? (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`${
                            star <= (workshop.average_rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          size={24}
                        />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {workshop.average_rating?.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({workshop.total_reviews} avaliações)
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-4">Sem avaliações ainda</p>
                )}

                {/* Descrição */}
                {workshop.description && (
                  <p className="text-gray-700 text-lg mb-6">
                    {workshop.description}
                  </p>
                )}

                {/* Informações de Contato */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="text-blue-600" size={20} />
                    <span>
                      {workshop.address && `${workshop.address}, `}
                      {workshop.city}, {workshop.state}
                      {workshop.zip_code && ` - ${workshop.zip_code}`}
                    </span>
                  </div>
                  {workshop.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="text-blue-600" size={20} />
                      <span>{workshop.phone}</span>
                    </div>
                  )}
                  {workshop.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="text-blue-600" size={20} />
                      <span>{workshop.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="w-full md:w-auto">
                <Link
                  href={`/solicitar-orcamento?workshop=${workshop.id}`}
                  className="block bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-bold text-lg shadow-lg"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Serviços */}
              {workshop.services && workshop.services.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Serviços Oferecidos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {workshop.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Especialidades */}
              {workshop.specialties && workshop.specialties.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Especialidades
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {workshop.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Avaliações */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Avaliações dos Clientes
                </h2>

                {reviews.length === 0 ? (
                  <p className="text-gray-500">
                    Nenhuma avaliação ainda. Seja o primeiro a avaliar!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
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
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>

                        {review.comment && (
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                        )}

                        {review.service_type && (
                          <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                            {review.service_type}
                          </span>
                        )}

                        {review.response && (
                          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Resposta da oficina:
                            </p>
                            <p className="text-sm text-blue-800">{review.response}</p>
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
              {/* CTA Adicional */}
              <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  Precisa de um orçamento?
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Solicite gratuitamente e receba uma resposta em até 48 horas.
                </p>
                <Link
                  href={`/solicitar-orcamento?workshop=${workshop.id}`}
                  className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-bold"
                >
                  Solicitar Agora
                </Link>
              </div>

              {/* Avaliar */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Já foi cliente?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Compartilhe sua experiência e ajude outros motoristas.
                </p>
                <Link
                  href={`/avaliar-oficina?workshop=${workshop.id}`}
                  className="block border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center font-bold"
                >
                  Deixar Avaliação
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

