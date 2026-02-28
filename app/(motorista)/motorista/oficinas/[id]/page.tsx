"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { StarRating } from "@/components/ui/StarRating";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  MessageSquare,
  ArrowLeft,
  Wrench,
  CheckCircle,
  Loader2,
  Calendar,
  Award,
} from "lucide-react";
import { Workshop } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  workshop_response: string | null;
  profile?: {
    name: string | null;
    email: string;
  };
}

export default function WorkshopDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    loadWorkshopDetails();
  }, [authLoading, params.id]);

  const loadWorkshopDetails = async () => {
    try {
      setLoading(true);

      // Buscar oficina
      const { data: workshopData, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", params.id)
        .single();

      if (workshopError) throw workshopError;

      setWorkshop(workshopData);

      // Buscar avaliações
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(`
          *,
          motorist:motorists(profile_id),
          profile:profiles(name, email)
        `)
        .eq("workshop_id", params.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setLoading(false);
    }
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

  if (!workshop) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oficina não encontrada</h3>
          <Link
            href="/motorista/oficinas"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Voltar para busca
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Botão Voltar */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Voltar</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-4">
              {/* Logo */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center flex-shrink-0">
                {workshop.logo_url ? (
                  <Image
                    src={workshop.logo_url}
                    alt={workshop.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover"
                  />
                ) : (
                  <Wrench className="w-10 h-10 text-blue-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {workshop.name}
                  </h1>
                  {workshop.plan_type === "pro" && (
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full flex-shrink-0">
                      ⭐ PRO
                    </span>
                  )}
                </div>

                {/* Avaliação */}
                {workshop.rating && workshop.rating > 0 ? (
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={workshop.rating} size="md" />
                    <span className="text-lg font-semibold text-gray-900">
                      {workshop.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({workshop.reviews_count || 0}{" "}
                      {workshop.reviews_count === 1 ? "avaliação" : "avaliações"})
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-3">Ainda sem avaliações</p>
                )}

                {/* Localização */}
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {workshop.city}, {workshop.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            {workshop.description && (
              <p className="text-gray-700 leading-relaxed">{workshop.description}</p>
            )}
          </div>

          {/* Especialidades */}
          {workshop.specialties && workshop.specialties.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-blue-600" />
                Especialidades
              </h2>
              <div className="flex flex-wrap gap-2">
                {workshop.specialties.map((spec: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl border border-blue-100"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Avaliações */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              Avaliações dos Clientes
            </h2>

            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Ainda não há avaliações para esta oficina.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.profile?.name?.charAt(0) ||
                            review.profile?.email?.charAt(0) ||
                            "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.profile?.name ||
                              review.profile?.email?.split("@")[0] ||
                              "Cliente"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(review.created_at), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>

                    {review.comment && (
                      <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                    )}

                    {review.workshop_response && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900 text-sm">
                            Resposta da oficina
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">{review.workshop_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Informações de Contato */}
        <div className="space-y-6">
          {/* Card de Contato */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações de Contato</h2>

            <div className="space-y-4 mb-6">
              {workshop.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Telefone</p>
                    <p className="font-medium text-gray-900">{workshop.phone}</p>
                  </div>
                </div>
              )}

              {workshop.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">E-mail</p>
                    <p className="font-medium text-gray-900 break-all">{workshop.email}</p>
                  </div>
                </div>
              )}

              {workshop.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Endereço</p>
                    <p className="font-medium text-gray-900">{workshop.address}</p>
                    <p className="text-sm text-gray-600">
                      {workshop.city}, {workshop.state} - {workshop.zip_code}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Link
                href={`/solicitar-orcamento?workshop=${workshop.id}`}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <MessageSquare className="w-5 h-5" />
                Solicitar Orçamento
              </Link>

              {workshop.phone && (
                <a
                  href={`https://wa.me/55${workshop.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Horário de Funcionamento (se houver) */}
          {workshop.working_hours && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Horário de Funcionamento
              </h3>
              <div className="space-y-2 text-sm">
                {Object.entries(workshop.working_hours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{day}</span>
                    <span className="font-medium text-gray-900">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
