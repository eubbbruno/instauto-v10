"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gift, Tag, Star, Clock, ExternalLink, Filter, Search, TrendingUp, Sparkles, Users, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase";

interface Promotion {
  id: string;
  partner: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  valid_until: string;
  color: string;
  icon: string;
  terms: string;
  featured: boolean;
}

export default function PromocoesPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const abortController = new AbortController();
    let mounted = true;

    const loadPromotions = async () => {
      try {
        let query = supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true)
          .gte("valid_until", new Date().toISOString().split("T")[0]);

        query = query.abortSignal(abortController.signal);

        const { data, error } = await query
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        if (mounted) {
          setPromotions(data || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("❌ [Promoções] Erro ao carregar:", error);
        }
      } finally {
        if (mounted) {
          setPromotionsLoading(false);
        }
      }
    };

    console.log("🚀 [Promoções] Iniciando fetch...");
    loadPromotions();

    return () => {
      console.log("🛑 [Promoções] Cleanup - abortando fetch");
      mounted = false;
      abortController.abort();
    };
  }, []);

  if (loading || promotionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  // Extrair categorias únicas das promoções
  const categories = ["all", ...Array.from(new Set(promotions.map(p => p.category)))];

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || promo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPromotions = filteredPromotions.filter(p => p.featured);
  const regularPromotions = filteredPromotions.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="p-8">
        {/* Header padrão */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Dashboard / Promoções</p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Promoções Exclusivas</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {filteredPromotions.length} ofertas ativas
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 text-sm">Total de Promoções</p>
              <Gift className="w-5 h-5 text-blue-100" />
            </div>
            <p className="text-3xl font-bold">{promotions.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm">Economia Média</p>
              <TrendingUp className="w-5 h-5 text-green-100" />
            </div>
            <p className="text-3xl font-bold">16%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm">Parceiros</p>
              <Users className="w-5 h-5 text-purple-100" />
            </div>
            <p className="text-3xl font-bold">8</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-orange-100 text-sm">Categorias</p>
              <Package className="w-5 h-5 text-orange-100" />
            </div>
            <p className="text-3xl font-bold">{categories.length - 1}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar promoções..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category === "all" ? "Todas" : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Promotions */}
        {featuredPromotions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Promoções em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className={`bg-gradient-to-br ${promo.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-bl-xl">
                    <span className="text-xs font-bold">DESTAQUE</span>
                  </div>
                  <div className="flex items-start justify-between mb-4 mt-2">
                    <div className="text-5xl">{promo.icon}</div>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                      {promo.discount} OFF
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-sm opacity-90 mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between text-xs opacity-75 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Válido até {new Date(promo.valid_until).toLocaleDateString("pt-BR")}
                    </span>
                    <span className="font-medium">{promo.partner}</span>
                  </div>
                  <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    Usar Promoção
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-xs opacity-75 mt-3 pt-3 border-t border-white/20">
                    {promo.terms}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Promotions */}
        {regularPromotions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-6 h-6 text-blue-500" />
              Todas as Promoções
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{promo.icon}</div>
                    <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                      {promo.discount} OFF
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Até {new Date(promo.valid_until).toLocaleDateString("pt-BR")}
                    </span>
                    <Badge className="bg-gray-100 text-gray-700">{promo.category}</Badge>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    Usar Promoção
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                    {promo.terms}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma promoção encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros de busca ou categoria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

