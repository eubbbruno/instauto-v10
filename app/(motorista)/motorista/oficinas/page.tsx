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
    if (!authLoading) {
      loadWorkshops();
    }
  }, [authLoading, selectedState, selectedCity]);

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("workshops")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (selectedState) {
        query = query.eq("state", selectedState);
      }

      if (selectedCity) {
        query = query.ilike("city", `%${selectedCity}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setWorkshops(data || []);
    } catch (error) {
      console.error("Erro ao carregar oficinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkshops = workshops.filter((workshop) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      workshop.name.toLowerCase().includes(term) ||
      workshop.city?.toLowerCase().includes(term) ||
      workshop.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buscar Oficinas</h1>
          <p className="text-gray-600">Encontre oficinas próximas e solicite orçamentos</p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Busca por nome */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
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
              </div>

              {/* Cidade */}
              <div>
                <Input
                  placeholder="Cidade"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Oficinas */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : filteredWorkshops.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma oficina encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros de busca ou remover alguns critérios.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedState("");
                  setSelectedCity("");
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{workshop.name}</CardTitle>
                      {workshop.city && workshop.state && (
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {workshop.city}, {workshop.state}
                        </CardDescription>
                      )}
                    </div>
                    {workshop.plan_type === "pro" && (
                      <Badge className="bg-yellow-500">PRO</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Descrição */}
                  {workshop.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {workshop.description}
                    </p>
                  )}

                  {/* Avaliação */}
                  {workshop.average_rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="ml-1 font-semibold">
                          {workshop.average_rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({workshop.total_reviews} avaliações)
                      </span>
                    </div>
                  )}

                  {/* Contato */}
                  <div className="space-y-2 text-sm">
                    {workshop.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{workshop.phone}</span>
                      </div>
                    )}
                    {workshop.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{workshop.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Especialidades */}
                  {workshop.specialties && workshop.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {workshop.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {workshop.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{workshop.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/motorista/oficinas/${workshop.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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

