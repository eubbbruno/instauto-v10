"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Plus, Pencil, Trash2, Loader2, Wrench, AlertCircle } from "lucide-react";
import { VehicleDialog } from "@/components/motorista/VehicleDialog";
import { MotoristVehicle } from "@/types/database";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function GaragemPage() {
  const { profile, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<MotoristVehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<MotoristVehicle | null>(null);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && profile) {
      loadVehicles();
    } else if (!authLoading && !profile) {
      setLoading(false);
    }
  }, [profile, authLoading]);

  const loadVehicles = async () => {
    if (!profile) return;

    try {
      // Buscar motorista
      const { data: motorist, error: motoristError } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (motoristError) {
        console.error("Erro ao buscar motorista:", motoristError);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus dados. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      setMotoristId(motorist.id);

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
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus veículos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVehicle = async (data: Partial<MotoristVehicle>) => {
    if (!motoristId) return;

    try {
      if (selectedVehicle) {
        // Atualizar veículo existente
        const { error } = await supabase
          .from("motorist_vehicles")
          .update(data)
          .eq("id", selectedVehicle.id);

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Veículo atualizado com sucesso.",
        });
      } else {
        // Criar novo veículo
        const { error } = await supabase
          .from("motorist_vehicles")
          .insert({
            ...data,
            motorist_id: motoristId,
            is_active: true,
          });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Veículo adicionado com sucesso.",
        });
      }

      loadVehicles();
      setSelectedVehicle(null);
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o veículo. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditVehicle = (vehicle: MotoristVehicle) => {
    setSelectedVehicle(vehicle);
    setDialogOpen(true);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;

    try {
      // Soft delete - marcar como inativo
      const { error } = await supabase
        .from("motorist_vehicles")
        .update({ is_active: false })
        .eq("id", vehicleToDelete.id);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Veículo removido com sucesso.",
      });

      loadVehicles();
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o veículo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (vehicle: MotoristVehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minha Garagem</h1>
          <p className="text-gray-600">Gerencie seus veículos e histórico de manutenções</p>
        </div>

        {/* Botão Adicionar */}
        <div className="mb-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setSelectedVehicle(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Veículo
          </Button>
        </div>

        {/* Lista de Veículos */}
        {vehicles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum veículo cadastrado
              </h3>
              <p className="text-gray-600 mb-6">
                Adicione seu primeiro veículo para começar a gerenciar manutenções
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setSelectedVehicle(null);
                  setDialogOpen(true);
                }}
              >
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
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
                      </CardTitle>
                      <CardDescription>
                        {vehicle.year} • {vehicle.plate || "Sem placa"}
                      </CardDescription>
                    </div>
                    <Car className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Marca/Modelo:</span>
                      <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                    </div>
                    {vehicle.color && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cor:</span>
                        <span className="font-medium">{vehicle.color}</span>
                      </div>
                    )}
                    {vehicle.mileage !== null && vehicle.mileage !== undefined && vehicle.mileage > 0 && (
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDeleteDialog(vehicle)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Adicionar/Editar */}
      <VehicleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Remover Veículo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover{" "}
              <strong>
                {vehicleToDelete?.nickname || `${vehicleToDelete?.make} ${vehicleToDelete?.model}`}
              </strong>
              ? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-red-600 hover:bg-red-700"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

