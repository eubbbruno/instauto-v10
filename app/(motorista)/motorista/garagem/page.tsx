"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Plus, Pencil, Trash2, Loader2, Wrench, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Vehicle {
  id: string;
  nickname?: string;
  make: string;
  model: string;
  year: number;
  plate?: string;
  color?: string;
  mileage?: number;
  fuel_type?: string;
  is_active: boolean;
}

export default function GaragemPage() {
  const { profile } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadVehicles();
    }
  }, [profile]);

  const loadVehicles = async () => {
    if (!profile) return;

    try {
      // Buscar motorista
      const { data: motorist, error: motoristError } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (motoristError) throw motoristError;

      // Buscar veículos
      const { data, error } = await supabase
        .from("motorist_vehicles")
        .select("*")
        .eq("motorist_id", motorist.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Garagem</h1>
            <p className="text-gray-600">Gerencie seus veículos e histórico de manutenções</p>
          </div>

          {/* Botão Adicionar */}
          <div className="mb-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Veículo
            </Button>
          </div>

          {/* Lista de Veículos */}
          {vehicles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum veículo cadastrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Adicione seu primeiro veículo para começar a gerenciar manutenções
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-5 w-5 mr-2" />
                  Adicionar Primeiro Veículo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
                        </CardTitle>
                        <CardDescription>
                          {vehicle.year} • {vehicle.plate || "Sem placa"}
                        </CardDescription>
                      </div>
                      <Car className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      {vehicle.color && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cor:</span>
                          <span className="font-medium">{vehicle.color}</span>
                        </div>
                      )}
                      {vehicle.mileage && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quilometragem:</span>
                          <span className="font-medium">{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                      )}
                      {vehicle.fuel_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Combustível:</span>
                          <span className="font-medium">{vehicle.fuel_type}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Wrench className="h-4 w-4 mr-1" />
                        Manutenções
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

