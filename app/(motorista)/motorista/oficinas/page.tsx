"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Phone, Mail, Clock, Loader2, Building2 } from "lucide-react";
import { Workshop } from "@/types/database";
import Link from "next/link";

const ESTADOS_BRASILEIROS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function OficinasPage() {
  const { profile, loading: authLoading } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadWorkshops = async () => {
      try {
        setLoading(true);

        let query = supabase
          .from("workshops")
          .select("*")
          .eq("is_public", true);

        query = query.abortSignal(abortController.signal);

        if (selectedState) {
          query = query.eq("state", selectedState);
        }

        if (selectedCity) {
          query = query.ilike("city", `%${selectedCity}%`);
        }

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        
        if (mounted) {
          setWorkshops(data || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("❌ [Oficinas] Erro ao carregar:", error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    console.log("🚀 [Oficinas] Iniciando fetch...");
    loadWorkshops();

    return () => {
      console.log("🛑 [Oficinas] Cleanup - abortando fetch");
      mounted = false;
      abortController.abort();
    };
  }, [authLoading, selectedState, selectedCity]);

  const filteredWorkshops = workshops.filter((workshop) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      workshop.name.toLowerCase().includes(term) ||
      workshop.city?.toLowerCase().includes(term) ||
      workshop.description?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="p-8">
        {/* Header padrão */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Dashboard / Buscar Oficinas</p>
          <h1 className="text-3xl font-bold text-gray-900">Buscar Oficinas</h1>
        </div>

        {/* Campo de Busca Premium */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-100 mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-400" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade ou serviço..."
              className="w-full h-14 pl-16 pr-6 text-lg border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="h-12 border-2 border-orange-200 focus:border-orange-500 font-medium">
                <SelectValue placeholder="Selecione o Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {ESTADOS_BRASILEIROS.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Digite a cidade..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="h-12 border-2 border-orange-200 focus:border-orange-500 font-medium"
            />
          </div>
        </div>

        {/* Lista de Oficinas Premium */}
        {filteredWorkshops.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-100 p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
              Nenhuma oficina encontrada
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Tente ajustar os filtros de busca ou remover alguns critérios.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedState("");
                setSelectedCity("");
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold shadow-lg"
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop, index) => (
              <div
                key={workshop.id}
                className="bg-white rounded-2xl shadow-2xl border-2 border-orange-100 hover:shadow-orange-200/50 hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{workshop.name}</h3>
                      {workshop.city && workshop.state && (
                        <div className="flex items-center gap-2 text-orange-50">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">{workshop.city}, {workshop.state}</span>
                        </div>
                      )}
                    </div>
                    {workshop.plan_type === "pro" && (
                      <Badge className="bg-yellow-400 text-yellow-900 font-bold border-0">
                        ⭐ PRO
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="p-6 space-y-4">
                  {/* Descrição */}
                  {workshop.description && (
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {workshop.description}
                    </p>
                  )}

                  {/* Avaliação */}
                  {workshop.average_rating && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-200">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(workshop.average_rating || 0)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">
                        {workshop.average_rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({workshop.total_reviews} avaliações)
                      </span>
                    </div>
                  )}

                  {/* Contato */}
                  <div className="space-y-3">
                    {workshop.phone && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-700">{workshop.phone}</span>
                      </div>
                    )}
                    {workshop.email && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-700 truncate">{workshop.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Especialidades */}
                  {workshop.specialties && workshop.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {workshop.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold border-0">
                          {specialty}
                        </Badge>
                      ))}
                      {workshop.specialties.length > 3 && (
                        <Badge className="bg-gray-600 text-white font-bold border-0">
                          +{workshop.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Botões Premium */}
                  {/* Botões Premium */}
                  <div className="flex gap-3 pt-4">
                    <Link href={`/motorista/oficinas/${workshop.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold shadow-lg" size="lg">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && filteredWorkshops.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Mostrando {filteredWorkshops.length} oficina(s)
          </div>
        )}
      </div>
    </div>
  );
}

