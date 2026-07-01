"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Search, MapPin, Star, Wrench, MessageSquare, Eye, X, ArrowRight, SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

const ESPECIALIDADES = [
  "Freios","Motor","Suspensão","Elétrica","Ar Condicionado",
  "Alinhamento","Balanceamento","Troca de Óleo","Revisão","Funilaria","Pintura","Injeção Eletrônica",
];

export default function BuscarOficinasPage() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "name">("rating");
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.get("estado")) setSelectedState(p.get("estado")!);
      if (p.get("cidade")) setSearchTerm(p.get("cidade")!);
    }
  }, []);

  useEffect(() => {
    const init = async () => { await checkAuth(); await loadWorkshops(); };
    init();
  }, []);

  useEffect(() => { if (!loading) loadWorkshops(); }, [selectedState]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const loadWorkshops = async () => {
    try {
      setLoading(true);
      let query = supabase.from("workshops").select("*").eq("is_public", true);
      if (selectedState) query = query.eq("state", selectedState);
      query = query.order("rating", { ascending: false, nullsFirst: false }).limit(100);
      const { data, error } = await query;
      if (error) throw error;
      setWorkshops(data || []);
    } catch {
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = workshops
    .filter((w) => {
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        if (!w.name.toLowerCase().includes(t) && !w.city?.toLowerCase().includes(t) && !w.description?.toLowerCase().includes(t)) return false;
      }
      if (selectedSpecialty && w.specialties) {
        if (!w.specialties.some((s: string) => s.toLowerCase() === selectedSpecialty.toLowerCase())) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating")  return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviews") return (b.reviews_count || 0) - (a.reviews_count || 0);
      return a.name.localeCompare(b.name);
    });

  const hasFilters = searchTerm || selectedState || selectedSpecialty;

  const clearFilters = () => { setSearchTerm(""); setSelectedState(""); setSelectedSpecialty(""); setSortBy("rating"); };

  const handleRequestQuote = (workshopId: string) => {
    if (user) router.push(`/solicitar-orcamento?workshop=${workshopId}`);
    else router.push(`/login?redirect=/solicitar-orcamento?workshop=${workshopId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      <Header />

      {/* Hero */}
      <section className="band-dark pt-28 pb-14 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-blue/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 left-0 w-[400px] h-[300px] bg-brand-yellow/8 blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Marketplace de Oficinas</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Encontre a oficina <span className="text-brand-yellow">ideal</span><br className="hidden sm:block" /> perto de você
            </h1>
            <p className="text-white/55 text-lg mb-8">
              Compare preços, veja avaliações reais e peça orçamentos grátis
            </p>

            {/* Search bar */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 flex items-center gap-2 max-w-xl mx-auto">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-navy/35 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-navy placeholder:text-navy/35 text-[15px] bg-transparent py-2"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="text-navy/30 hover:text-navy/60 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button className="btn-epic px-5 py-3 rounded-xl text-sm font-bold flex-shrink-0 flex items-center gap-2">
                Buscar <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats pills */}
            <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
              {["+500 oficinas", "15 estados", "Orçamento grátis"].map(t => (
                <span key={t} className="text-[13px] text-white/45 font-sans flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-brand-yellow/60" />{t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Sticky filters */}
      <div className="bg-white border-b border-navy/6 sticky top-16 z-40 shadow-sm shadow-black/4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            <SlidersHorizontal className="w-4 h-4 text-navy/35 flex-shrink-0 hidden sm:block" />

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 rounded-xl border border-navy/10 bg-white text-navy/70 text-sm focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow/40 transition-all cursor-pointer"
            >
              <option value="">Todos os estados</option>
              {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 rounded-xl border border-navy/10 bg-white text-navy/70 text-sm focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow/40 transition-all cursor-pointer"
            >
              <option value="">Todas especialidades</option>
              {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-navy/10 bg-white text-navy/70 text-sm focus:ring-2 focus:ring-brand-yellow/40 focus:border-brand-yellow/40 transition-all cursor-pointer"
            >
              <option value="rating">Mais avaliadas</option>
              <option value="reviews">Mais reviews</option>
              <option value="name">Nome A-Z</option>
            </select>

            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-navy/45 font-sans">
                <span className="font-semibold text-navy">{filtered.length}</span> {filtered.length === 1 ? "oficina" : "oficinas"}
              </span>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-brand-blue font-semibold hover:text-navy transition-colors flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> Limpar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                  <div className="h-40 bg-gray-100 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-2/3" />
                    <div className="h-10 bg-gray-100 rounded-xl animate-pulse mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-heading font-bold text-navy mb-2">Nenhuma oficina encontrada</h3>
              <p className="text-navy/50 mb-6">Tente ajustar os filtros ou buscar por outra cidade.</p>
              <button onClick={clearFilters} className="btn-epic px-6 py-3 rounded-xl text-sm font-bold">
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((workshop) => (
                <div
                  key={workshop.id}
                  className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  {/* Imagem */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex-shrink-0">
                    {workshop.logo_url ? (
                      <Image
                        src={workshop.logo_url}
                        alt={workshop.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}
                    {workshop.plan_type === "pro" && (
                      <span className="absolute top-3 left-3 btn-epic text-[11px] font-bold px-2.5 py-1 rounded-full">
                        ⭐ PRO
                      </span>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-heading font-bold text-[15px] text-navy line-clamp-1 group-hover:text-brand-blue transition-colors">
                        {workshop.name}
                      </h3>
                      {workshop.rating && workshop.rating > 0 ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow" />
                          <span className="text-sm font-semibold text-navy">{workshop.rating.toFixed(1)}</span>
                          <span className="text-xs text-navy/35 hidden sm:inline">({workshop.reviews_count || 0})</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-navy/35 font-sans flex-shrink-0">Novo</span>
                      )}
                    </div>

                    <p className="text-[13px] text-navy/50 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="line-clamp-1">{workshop.city}, {workshop.state}</span>
                    </p>

                    {workshop.specialties && workshop.specialties.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1 mb-4">
                        {workshop.specialties.slice(0, 2).map((spec: string, i: number) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[11px] font-sans font-medium rounded-full">
                            {spec}
                          </span>
                        ))}
                        {workshop.specialties.length > 2 && (
                          <span className="text-[11px] text-navy/35 self-center font-sans">+{workshop.specialties.length - 2}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto space-y-2">
                      <button
                        onClick={() => handleRequestQuote(workshop.id)}
                        className="w-full btn-epic-blue py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Solicitar Orçamento
                      </button>
                      <Link
                        href={`/oficina-detalhes/${workshop.id}`}
                        className="w-full py-2.5 border border-navy/10 hover:border-navy/25 text-navy/60 hover:text-navy font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
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
