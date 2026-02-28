"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { StarRating } from "@/components/ui/StarRating";
import { Workshop } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Star, Loader2, Wrench, Heart, MessageSquare, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const ESPECIALIDADES = [
  "Freios",
  "Motor",
  "Suspensão",
  "Elétrica",
  "Ar Condicionado",
  "Alinhamento",
  "Balanceamento",
  "Troca de Óleo",
  "Revisão",
  "Funilaria",
  "Pintura",
  "Injeção Eletrônica"
];

export default function BuscarOficinasPage() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [onlyWithReviews, setOnlyWithReviews] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    checkAuth();
    loadWorkshops();
  }, []);

  useEffect(() => {
    loadWorkshops();
  }, [selectedState]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadWorkshops = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from("workshops")
        .select("*")
        .eq("is_public", true);

      if (selectedState) {
        query = query.eq("state", selectedState);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      
      setWorkshops(data || []);
    } catch (error: any) {
      console.error("❌ [Oficinas] Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkshops = workshops
    .filter((workshop) => {
      // Filtro de busca por texto
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          workshop.name.toLowerCase().includes(term) ||
          workshop.city?.toLowerCase().includes(term) ||
          workshop.description?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }

      // Filtro de especialidade
      if (selectedSpecialty && workshop.specialties) {
        const hasSpecialty = workshop.specialties.some(
          (spec: string) => spec.toLowerCase() === selectedSpecialty.toLowerCase()
        );
        if (!hasSpecialty) return false;
      }

      // Filtro de "só com avaliações"
      if (onlyWithReviews && (!workshop.rating || workshop.rating === 0)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Ordenação
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.reviews_count || 0) - (a.reviews_count || 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedSpecialty("");
    setOnlyWithReviews(false);
    setSortBy("rating");
  };

  const handleRequestQuote = (workshopId: string) => {
    if (user) {
      // Logado - vai para solicitar
      router.push(`/solicitar-orcamento?workshop=${workshopId}`);
    } else {
      // Não logado - vai para login com redirect
      router.push(`/login?redirect=/solicitar-orcamento?workshop=${workshopId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Search className="h-4 w-4" />
              Marketplace de Oficinas
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Encontre a <span className="text-yellow-400">Oficina Ideal</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Compare preços, veja avaliações reais e solicite orçamentos grátis
            </p>

            {/* Barra de Busca Principal */}
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
              <div className="flex items-center gap-4">
                <Search className="text-gray-400 flex-shrink-0" size={28} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-gray-900 outline-none text-lg placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white border-b shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Primeira linha: Busca, Estado, Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Estado */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Todos os estados</option>
              {ESTADOS_BRASILEIROS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
            
            {/* Especialidade */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Todas especialidades</option>
              {ESPECIALIDADES.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>

            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="rating">Mais avaliadas</option>
              <option value="reviews">Mais reviews</option>
              <option value="name">Nome A-Z</option>
            </select>
          </div>
          
          {/* Segunda linha: Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={onlyWithReviews}
                onChange={(e) => setOnlyWithReviews(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                Só oficinas com avaliações
              </span>
            </label>
            
            {(searchTerm || selectedState || selectedSpecialty || onlyWithReviews) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Contador de resultados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">{filteredWorkshops.length}</span>{" "}
          {filteredWorkshops.length === 1 ? "oficina encontrada" : "oficinas encontradas"}
        </p>
      </section>

      {/* Grid de Oficinas */}
      <section className="flex-1 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    <div className="h-10 bg-gray-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma oficina encontrada</h3>
              <p className="text-gray-500 mb-6">Tente ajustar os filtros de busca</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Imagem/Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
                    {workshop.logo_url ? (
                      <Image
                        src={workshop.logo_url}
                        alt={workshop.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench className="w-16 h-16 text-blue-300 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    
                    {/* Badge PRO */}
                    {workshop.plan_type === "pro" && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg">
                        ⭐ PRO
                      </span>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4">
                    {/* Header: Nome + Estrelas */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {workshop.name}
                      </h3>
                      {workshop.rating && workshop.rating > 0 ? (
                        <div className="flex items-center gap-1 text-sm flex-shrink-0">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{workshop.rating.toFixed(1)}</span>
                          <span className="text-gray-400">({workshop.reviews_count || 0})</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 flex-shrink-0">Novo</span>
                      )}
                    </div>

                    {/* Localização */}
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {workshop.city}, {workshop.state}
                      </span>
                    </p>

                    {/* Especialidades (badges) */}
                    {workshop.specialties && workshop.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                        {workshop.specialties.slice(0, 3).map((spec: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                        {workshop.specialties.length > 3 && (
                          <span className="text-xs text-gray-400 self-center">
                            +{workshop.specialties.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Botões */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleRequestQuote(workshop.id)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all group-hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Solicitar Orçamento
                      </button>
                      <Link
                        href={`/oficina-detalhes/${workshop.id}`}
                        className="w-full py-2.5 border-2 border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
