"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle } from "lucide-react";
import { MotoristVehicle, Workshop } from "@/types/database";
import { createClient } from "@/lib/supabase";

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: Workshop;
  motoristId: string;
  onSuccess: () => void;
}

const TIPOS_SERVICO = [
  { value: "Revisão", label: "Revisão Periódica" },
  { value: "Troca de óleo", label: "Troca de Óleo" },
  { value: "Freios", label: "Freios" },
  { value: "Suspensão", label: "Suspensão" },
  { value: "Motor", label: "Motor" },
  { value: "Elétrica", label: "Elétrica" },
  { value: "Ar condicionado", label: "Ar Condicionado" },
  { value: "Alinhamento", label: "Alinhamento e Balanceamento" },
  { value: "Pneus", label: "Pneus" },
  { value: "Funilaria", label: "Funilaria" },
  { value: "Pintura", label: "Pintura" },
  { value: "Outro", label: "Outro" },
];

export function QuoteRequestDialog({ open, onOpenChange, workshop, motoristId, onSuccess }: QuoteRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    service_type: "",
    description: "",
    urgency: "normal" as "low" | "normal" | "high",
  });

  useEffect(() => {
    if (open && motoristId) {
      loadVehicles();
    }
  }, [open, motoristId]);

  const loadVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const { data, error } = await supabase
        .from("motorist_vehicles")
        .select("*")
        .eq("motorist_id", motoristId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar dados do motorista
      const { data: motorist, error: motoristError } = await supabase
        .from("motorists")
        .select("profile_id, profiles(name, email, phone)")
        .eq("id", motoristId)
        .single();

      if (motoristError) throw motoristError;

      const profile = motorist?.profiles as any;
      
      // Buscar dados do veículo se selecionado
      let vehicleData = null;
      if (formData.vehicle_id) {
        const { data: vehicle, error: vehicleError } = await supabase
          .from("motorist_vehicles")
          .select("make, model, year, plate")
          .eq("id", formData.vehicle_id)
          .single();

        if (vehicleError) throw vehicleError;
        vehicleData = vehicle;
      }

      // Inserir orçamento com os dados corretos
      const { error } = await supabase.from("quotes").insert({
        workshop_id: workshop.id,
        motorist_name: profile?.name || "Motorista",
        motorist_email: profile?.email || "",
        motorist_phone: profile?.phone || "",
        vehicle_brand: vehicleData?.make || "Não informado",
        vehicle_model: vehicleData?.model || "Não informado",
        vehicle_year: vehicleData?.year || new Date().getFullYear(),
        vehicle_plate: vehicleData?.plate || null,
        vehicle_id: formData.vehicle_id || null,
        service_type: formData.service_type,
        description: formData.description,
        urgency: formData.urgency,
        status: "pending",
      });

      if (error) throw error;

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        vehicle_id: "",
        service_type: "",
        description: "",
        urgency: "normal",
      });
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      alert("Erro ao enviar orçamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Solicitar Orçamento</DialogTitle>
          <DialogDescription>
            Envie uma solicitação de orçamento para <strong>{workshop.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Veículo */}
          <div>
            <Label htmlFor="vehicle_id">Veículo *</Label>
            {loadingVehicles ? (
              <div className="flex items-center gap-2 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Carregando veículos...</span>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Nenhum veículo cadastrado</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Cadastre um veículo na sua garagem antes de solicitar orçamentos.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <Select
                value={formData.vehicle_id}
                onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.nickname || `${vehicle.make} ${vehicle.model}`} - {vehicle.year}
                      {vehicle.plate && ` (${vehicle.plate})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tipo de Serviço */}
          <div>
            <Label htmlFor="service_type">Tipo de Serviço *</Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) => setFormData({ ...formData, service_type: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de serviço" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_SERVICO.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Urgência */}
          <div>
            <Label>Urgência *</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value: "low" | "normal" | "high") =>
                setFormData({ ...formData, urgency: value })
              }
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal cursor-pointer">
                  Baixa
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="font-normal cursor-pointer">
                  Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal cursor-pointer">
                  Alta
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description">Descrição do Problema *</Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente o problema ou serviço necessário..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Quanto mais detalhes você fornecer, mais preciso será o orçamento.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || vehicles.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Solicitação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

