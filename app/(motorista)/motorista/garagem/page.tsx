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
    if (authLoading || !profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadVehicles = async () => {
      console.log("🔄 Garagem: Carregando veículos para profile:", profile.id);

      try {
        setLoading(true);

        // Buscar motorista
        let query1 = supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id);

        if (abortController.signal) query1 = query1.abortSignal(abortController.signal);

        const { data: motorist, error: motoristError } = await query1.single();

        if (motoristError) {
          console.error("❌ Erro ao buscar motorista:", motoristError);
          if (mounted) {
            toast({
              title: "Erro",
              description: "Não foi possível carregar seus dados. Tente novamente.",
              variant: "destructive",
            });
          }
          return;
        }

        if (!mounted) return;

        console.log("✅ Motorista encontrado:", motorist.id);
        setMotoristId(motorist.id);

        // Buscar veículos
        let query2 = supabase
          .from("motorist_vehicles")
          .select("*")
          .eq("motorist_id", motorist.id)
          .eq("is_active", true);

        if (abortController.signal) query2 = query2.abortSignal(abortController.signal);

        const { data, error } = await query2.order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erro ao buscar veículos:", error);
          throw error;
        }

        if (mounted) {
          console.log("✅ Veículos carregados:", data?.length || 0);
          setVehicles(data || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("❌ Erro ao carregar veículos:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar seus veículos. Tente novamente.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          console.log("✅ Garagem: Loading finalizado");
          setLoading(false);
        }
      }
    };

    loadVehicles();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id, authLoading]);

  const reloadVehicles = async () => {
    if (!profile?.id || !motoristId) return;

    try {
      let query = supabase
        .from("motorist_vehicles")
        .select("*")
        .eq("motorist_id", motoristId)
        .eq("is_active", true);

      const { data } = await query.order("created_at", { ascending: false });
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao recarregar veículos:", error);
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

      reloadVehicles();
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

      reloadVehicles();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center pt-16">
        <Card className="border-2 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 font-medium">Carregando garagem...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header Premium */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent leading-tight">
              Minha Garagem 🚗
            </h1>
            <p className="text-gray-600 text-lg">Gerencie seus veículos e histórico de manutenções</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold shadow-xl shadow-blue-600/40 hover:scale-105 transition-all duration-300 text-lg px-6 py-6"
            size="lg"
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
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <Car className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum veículo cadastrado
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Adicione seu primeiro veículo para começar a gerenciar manutenções e solicitar orçamentos
              </p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg shadow-blue-600/30 hover:scale-105 transition-transform"
                size="lg"
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

