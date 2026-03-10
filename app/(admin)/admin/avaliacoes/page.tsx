"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Star, Search, Eye, Calendar, Building2, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Review {
  id: string;
  workshop_id: string;
  workshop_name: string;
  motorist_name: string;
  rating: number;
  comment: string;
  workshop_response: string | null;
  created_at: string;
}

export default function AdminAvaliacoesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [searchTerm, filterRating, reviews]);

  const loadReviews = async () => {
    try {
      console.log("📊 [Admin Avaliações] Carregando avaliações...");
      
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          workshops!inner(name),
          profiles!inner(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviewsWithNames = data.map(r => ({
        ...r,
        workshop_name: r.workshops.name,
        motorist_name: r.profiles.name
      }));

      setReviews(reviewsWithNames);
      setFilteredReviews(reviewsWithNames);
      console.log("✅ [Admin Avaliações] Carregadas:", reviewsWithNames.length);
    } catch (error) {
      console.error("❌ [Admin Avaliações] Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.motorist_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.workshop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRating !== null) {
      filtered = filtered.filter(r => r.rating === filterRating);
    }

    setFilteredReviews(filtered);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
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
          Todas as Avaliações
        </h1>
        <p className="text-gray-600">
          {filteredReviews.length} avaliação{filteredReviews.length !== 1 ? "ões" : ""} encontrada{filteredReviews.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por motorista, oficina ou comentário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterRating || ""}
            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as estrelas</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 estrelas)</option>
            <option value="4">⭐⭐⭐⭐ (4 estrelas)</option>
            <option value="3">⭐⭐⭐ (3 estrelas)</option>
            <option value="2">⭐⭐ (2 estrelas)</option>
            <option value="1">⭐ (1 estrela)</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <p className="font-semibold text-gray-900">{review.workshop_name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{review.motorist_name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {renderStars(review.rating)}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>

            {/* Comentário */}
            <div className="mb-4">
              <p className="text-gray-700 line-clamp-3">{review.comment}</p>
            </div>

            {/* Resposta da Oficina */}
            {review.workshop_response && (
              <div className="p-3 bg-blue-50 rounded-xl mb-4">
                <p className="text-xs font-semibold text-blue-600 mb-1">Resposta da oficina:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{review.workshop_response}</p>
              </div>
            )}

            {/* Botão Ver Mais */}
            <button
              onClick={() => {
                setSelectedReview(review);
                setViewDialogOpen(true);
              }}
              className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Ver detalhes completos
            </button>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma avaliação encontrada</p>
        </div>
      )}

      {/* Dialog Ver Detalhes */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Avaliação</DialogTitle>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              {/* Oficina */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Oficina avaliada</p>
                <p className="text-lg font-semibold text-gray-900">{selectedReview.workshop_name}</p>
              </div>

              {/* Motorista */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Avaliado por</p>
                <p className="font-medium text-gray-900">{selectedReview.motorist_name}</p>
              </div>

              {/* Avaliação */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Avaliação</p>
                <div className="flex items-center gap-3">
                  {renderStars(selectedReview.rating)}
                  <span className="text-2xl font-bold text-gray-900">{selectedReview.rating}.0</span>
                </div>
              </div>

              {/* Comentário */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Comentário</p>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedReview.comment}
                </p>
              </div>

              {/* Resposta */}
              {selectedReview.workshop_response && (
                <div className="p-4 bg-blue-50 rounded-xl space-y-2">
                  <p className="text-sm font-semibold text-blue-600">Resposta da oficina</p>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedReview.workshop_response}
                  </p>
                </div>
              )}

              {/* Data */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Avaliação feita em {new Date(selectedReview.created_at).toLocaleDateString("pt-BR", {
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
