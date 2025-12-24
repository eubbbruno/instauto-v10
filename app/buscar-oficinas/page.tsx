"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Star, Phone, Mail, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function BuscarOficinasPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const supabase = createClient();

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    filterWorkshops();
  }, [searchTerm, cityFilter, stateFilter, serviceFilter, workshops]);

  const loadWorkshops = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("is_public", true)
        .order("average_rating", { ascending: false });

      if (error) throw error;
      setWorkshops(data || []);
      setFilteredWorkshops(data || []);
    } catch (error) {
      console.error("Erro ao carregar oficinas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkshops = () => {
    let filtered = workshops;

    if (searchTerm) {
      filtered = filtered.filter(
        (w) =>
          w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cityFilter) {
      filtered = filtered.filter((w) =>
        w.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    if (stateFilter) {
      filtered = filtered.filter((w) => w.state === stateFilter);
    }

    if (serviceFilter) {
      filtered = filtered.filter((w) =>
        w.services?.includes(serviceFilter)
      );
    }

    setFilteredWorkshops(filtered);
  };

  const uniqueCities = Array.from(new Set(workshops.map((w) => w.city).filter(Boolean))).sort();
  const uniqueStates = Array.from(new Set(workshops.map((w) => w.state).filter(Boolean))).sort();

  const serviceTypes = [
    "Manutenção Preventiva",
    "Troca de Óleo",
    "Freios",
    "Suspensão",
    "Elétrica",
    "Ar Condicionado",
    "Alinhamento e Balanceamento",
    "Diagnóstico",
    "Mecânica Geral",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre a Oficina Ideal
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Compare preços, veja avaliações e solicite orçamentos online
            </p>

            {/* Barra de Busca Principal */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-4">
              <div className="flex items-center gap-2">
                <Search className="text-gray-400" size={24} />
                <input
                  type="text"
                  placeholder="Buscar por nome, cidade ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 text-gray-900 outline-none text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700"
            >
              <option value="">Todas as Cidades</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700"
            >
              <option value="">Todos os Estados</option>
              {uniqueStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700"
            >
              <option value="">Todos os Serviços</option>
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Lista de Oficinas */}
      <section className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando oficinas...</p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">
                Nenhuma oficina encontrada com os filtros selecionados.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-gray-600">
                {filteredWorkshops.length} oficina(s) encontrada(s)
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
                  >
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {workshop.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-gray-600">
                            {workshop.city}, {workshop.state}
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      {workshop.total_reviews && workshop.total_reviews > 0 ? (
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 fill-yellow-400" size={20} />
                            <span className="text-xl font-bold text-gray-900">
                              {workshop.average_rating?.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {workshop.total_reviews} avaliações
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">Sem avaliações</div>
                      )}
                    </div>

                    {/* Descrição */}
                    {workshop.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {workshop.description}
                      </p>
                    )}

                    {/* Serviços */}
                    {workshop.services && workshop.services.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {workshop.services.slice(0, 4).map((service, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {service}
                            </span>
                          ))}
                          {workshop.services.length > 4 && (
                            <span className="text-sm text-gray-500">
                              +{workshop.services.length - 4} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contato */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {workshop.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>{workshop.phone}</span>
                        </div>
                      )}
                      {workshop.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span>{workshop.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Link
                        href={`/solicitar-orcamento?workshop=${workshop.id}`}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                      >
                        Solicitar Orçamento
                      </Link>
                      <Link
                        href={`/oficina-detalhes/${workshop.id}`}
                        className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-center font-medium"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

