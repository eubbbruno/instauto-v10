"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { StarRating } from "@/components/ui/StarRating";
import { Star, MessageSquare, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Review {
  id: string;
  workshop_id: string;
  motorist_id: string;
  rating: number;
  comment: string | null;
  workshop_response: string | null;
  created_at: string;
  profile?: {
    name: string | null;
    email: string;
  };
}

export default function AvaliacoesPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [workshop, setWorkshop] = useState<any>(null);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    
    if (!profile) {
      router.push("/login");
      return;
    }

    loadReviews();
  }, [profile, authLoading]);

  const loadReviews = async () => {
    try {
      setLoading(true);

      // Buscar workshop
      const { data: workshopData } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (!workshopData) {
        console.error("Workshop não encontrado");
        setLoading(false);
        return;
      }

      setWorkshop(workshopData);
      console.log("🔍 [Avaliações] Workshop ID:", workshopData.id);

      // Buscar avaliações com dados do motorista
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          motorist:motorists(profile_id),
          profile:profiles(name, email)
        `)
        .eq("workshop_id", workshopData.id)
        .order("created_at", { ascending: false });

      console.log("🔍 [Avaliações] Resultado:", { count: data?.length, error });

      if (error) throw error;

      setReviews(data || []);
    } catch (error: any) {
      console.error("❌ [Avaliações] Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as avaliações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast({
        title: "Atenção",
        description: "Digite uma resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .update({ workshop_response: responseText.trim() })
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Resposta enviada!",
        description: "Sua resposta foi publicada com sucesso.",
      });

      setRespondingTo(null);
      setResponseText("");
      loadReviews();
    } catch (error: any) {
      console.error("❌ [Avaliações] Erro ao responder:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
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

  const avgRating = getAverageRating();
  const distribution = getRatingDistribution();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Avaliações</p>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Avaliações dos Clientes</h1>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:border-r border-gray-200">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {avgRating.toFixed(1)}
            </div>
            <StarRating rating={avgRating} size="lg" />
            <p className="text-gray-600 mt-2">
              Baseado em {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as keyof typeof distribution];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
          <p className="text-gray-500">
            Suas avaliações aparecerão aqui quando os clientes avaliarem seus serviços.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {review.profile?.name?.charAt(0) || review.profile?.email?.charAt(0) || <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.profile?.name || review.profile?.email?.split("@")[0] || "Cliente"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(review.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="md" />
              </div>

              {/* Review Comment */}
              {review.comment && (
                <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
              )}

              {/* Workshop Response */}
              {review.workshop_response ? (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Resposta da oficina</span>
                  </div>
                  <p className="text-sm text-blue-800">{review.workshop_response}</p>
                </div>
              ) : (
                <div className="mt-4">
                  {respondingTo === review.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Digite sua resposta..."
                        rows={3}
                        className="resize-none"
                        disabled={submitting}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleRespond(review.id)}
                          disabled={submitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Enviar Resposta
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setRespondingTo(null);
                            setResponseText("");
                          }}
                          disabled={submitting}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRespondingTo(review.id)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Responder
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
