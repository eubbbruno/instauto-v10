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
    console.log("💾 [Garagem] Salvando veículo...");
    console.log("💾 [Garagem] motoristId:", motoristId);
    console.log("💾 [Garagem] data:", data);

    if (!motoristId) {
      console.error("❌ [Garagem] motoristId não encontrado!");
      toast({
        title: "Erro",
        description: "Dados do motorista não carregados. Recarregue a página.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedVehicle) {
        // Atualizar veículo existente
        console.log("📝 [Garagem] Atualizando veículo:", selectedVehicle.id);
        const { error } = await supabase
          .from("motorist_vehicles")
          .update(data)
          .eq("id", selectedVehicle.id);

        if (error) {
          console.error("❌ [Garagem] Erro ao atualizar:", error);
          throw error;
        }

        console.log("✅ [Garagem] Veículo atualizado!");
        toast({
          title: "Sucesso!",
          description: "Veículo atualizado com sucesso.",
        });
      } else {
        // Criar novo veículo
        console.log("➕ [Garagem] Criando novo veículo...");
        const insertData = {
          ...data,
          motorist_id: motoristId,
          is_active: true,
        };
        console.log("➕ [Garagem] Dados para inserir:", insertData);

        const { error, data: insertedData } = await supabase
          .from("motorist_vehicles")
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("❌ [Garagem] Erro ao inserir:", error);
          console.error("❌ [Garagem] Detalhes do erro:", JSON.stringify(error, null, 2));
          throw error;
        }

        console.log("✅ [Garagem] Veículo criado:", insertedData);
        toast({
          title: "Sucesso!",
          description: "Veículo adicionado com sucesso.",
        });
      }

      await reloadVehicles();
      setSelectedVehicle(null);
    } catch (error: any) {
      console.error("❌ [Garagem] Erro ao salvar veículo:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o veículo. Verifique os dados e tente novamente.",
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
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 font-medium">Carregando garagem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Header padrão */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Garagem</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-base sm:text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Minha Garagem</h1>
            <button 
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl shadow-lg shadow-yellow-400/30 flex items-center justify-center gap-2 transition-all"
              onClick={() => {
                setSelectedVehicle(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="w-5 h-5" />
              Adicionar Veículo
            </button>
          </div>
        </div>

        {/* Lista de Veículos */}
        {vehicles.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Car className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
              Nenhum veículo cadastrado
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Adicione seu primeiro veículo para começar a gerenciar manutenções e solicitar orçamentos
            </p>
            <button 
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              onClick={() => {
                setSelectedVehicle(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="h-5 w-5" />
              Adicionar Primeiro Veículo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 sm:p-6">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      {vehicle.nickname || `${vehicle.make} ${vehicle.model}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {vehicle.year} • {vehicle.plate || "Sem placa"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Marca/Modelo:</span>
                    <span className="font-medium text-gray-900">{vehicle.make} {vehicle.model}</span>
                  </div>
                  {vehicle.color && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cor:</span>
                      <span className="font-medium text-gray-900">{vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.mileage !== null && vehicle.mileage !== undefined && vehicle.mileage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quilometragem:</span>
                      <span className="font-medium text-gray-900">{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                  )}
                  {vehicle.fuel_type && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Combustível:</span>
                      <span className="font-medium text-gray-900">{vehicle.fuel_type}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button 
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    onClick={() => openDeleteDialog(vehicle)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
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

