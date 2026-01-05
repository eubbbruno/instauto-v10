"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Gift, Tag, Star, Clock, ExternalLink, Filter, Search, TrendingUp, Sparkles, Users, Package } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Promotion {
  id: number;
  partner: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  validUntil: string;
  color: string;
  icon: string;
  terms: string;
  featured: boolean;
}

export default function PromocoesPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login-motorista");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  // Promoções (depois conectar com banco)
  const promotions: Promotion[] = [
    {
      id: 1,
      partner: "Uber",
      title: "15% OFF em manutenções preventivas",
      description: "Parceiros Uber têm desconto especial em todos os serviços de manutenção preventiva",
      discount: "15%",
      category: "Manutenção",
      validUntil: "2025-03-31",
      color: "from-black to-gray-800",
      icon: "🚗",
      terms: "Válido para parceiros Uber ativos. Apresentar comprovante de parceria.",
      featured: true,
    },
    {
      id: 2,
      partner: "Mercado Livre",
      title: "10% OFF + Frete Grátis em peças",
      description: "Compre peças automotivas originais com desconto exclusivo e frete grátis",
      discount: "10%",
      category: "Peças",
      validUntil: "2025-02-28",
      color: "from-yellow-400 to-yellow-500",
      icon: "📦",
      terms: "Válido para compras acima de R$ 200. Código: INSTAUTO10",
      featured: true,
    },
    {
      id: 3,
      partner: "iFood",
      title: "20% OFF em revisões completas",
      description: "Entregadores parceiros economizam mais em revisões completas",
      discount: "20%",
      category: "Revisão",
      validUntil: "2025-04-30",
      color: "from-red-500 to-red-600",
      icon: "🍔",
      terms: "Válido para entregadores iFood com mais de 100 entregas/mês.",
      featured: true,
    },
    {
      id: 4,
      partner: "99",
      title: "12% OFF em troca de óleo",
      description: "Motoristas 99 têm desconto especial em troca de óleo e filtros",
      discount: "12%",
      category: "Manutenção",
      validUntil: "2025-03-15",
      color: "from-orange-500 to-orange-600",
      icon: "🚕",
      terms: "Válido para motoristas 99 ativos.",
      featured: false,
    },
    {
      id: 5,
      partner: "Rappi",
      title: "18% OFF em alinhamento e balanceamento",
      description: "Parceiros Rappi economizam em serviços de alinhamento",
      discount: "18%",
      category: "Manutenção",
      validUntil: "2025-02-20",
      color: "from-pink-500 to-pink-600",
      icon: "🛵",
      terms: "Válido para parceiros Rappi com cadastro ativo.",
      featured: false,
    },
    {
      id: 6,
      partner: "Loggi",
      title: "25% OFF em manutenção de freios",
      description: "Desconto especial para motoristas Loggi em serviços de freios",
      discount: "25%",
      category: "Manutenção",
      validUntil: "2025-03-25",
      color: "from-green-500 to-green-600",
      icon: "📦",
      terms: "Válido para motoristas Loggi com mais de 50 entregas/mês.",
      featured: false,
    },
    {
      id: 7,
      partner: "Lalamove",
      title: "15% OFF em diagnóstico completo",
      description: "Diagnóstico completo com desconto para parceiros Lalamove",
      discount: "15%",
      category: "Diagnóstico",
      validUntil: "2025-04-10",
      color: "from-blue-500 to-blue-600",
      icon: "🔧",
      terms: "Válido para parceiros Lalamove ativos.",
      featured: false,
    },
    {
      id: 8,
      partner: "Zé Delivery",
      title: "20% OFF em troca de pneus",
      description: "Parceiros Zé Delivery economizam na troca de pneus",
      discount: "20%",
      category: "Pneus",
      validUntil: "2025-03-31",
      color: "from-yellow-600 to-yellow-700",
      icon: "🍺",
      terms: "Válido para parceiros Zé Delivery com cadastro ativo.",
      featured: false,
    },
  ];

  const categories = ["all", "Manutenção", "Revisão", "Peças", "Pneus", "Diagnóstico"];

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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Promoções Exclusivas
            </h1>
            <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              {filteredPromotions.length} ofertas
            </Badge>
          </div>
          <p className="text-gray-600">
            Aproveite descontos exclusivos com nossos parceiros
          </p>
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
                      Válido até {new Date(promo.validUntil).toLocaleDateString("pt-BR")}
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
                      Até {new Date(promo.validUntil).toLocaleDateString("pt-BR")}
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

