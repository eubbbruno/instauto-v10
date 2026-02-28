"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { MotoristVehicle } from "@/types/database";
import { PlateSearchInput } from "@/components/ui/PlateSearchInput";

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: MotoristVehicle | null;
  onSave: (data: Partial<MotoristVehicle>) => Promise<void>;
}

const MARCAS = [
  "Volkswagen", "Fiat", "Chevrolet", "Ford", "Renault", "Toyota", 
  "Honda", "Hyundai", "Nissan", "Jeep", "Peugeot", "Citroën",
  "BMW", "Mercedes-Benz", "Audi", "Mitsubishi", "Kia", "Volvo", "Outro"
];

const COMBUSTIVEIS = [
  { value: "flex", label: "Flex" },
  { value: "gasoline", label: "Gasolina" },
  { value: "ethanol", label: "Etanol" },
  { value: "diesel", label: "Diesel" },
  { value: "gnv", label: "GNV" },
  { value: "electric", label: "Elétrico" },
  { value: "hybrid", label: "Híbrido" },
];

const CORES = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", 
  "Verde", "Amarelo", "Laranja", "Marrom", "Bege", "Outro"
];

export function VehicleDialog({ open, onOpenChange, vehicle, onSave }: VehicleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nickname: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    plate: "",
    color: "",
    mileage: 0,
    fuel_type: "flex",
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        nickname: vehicle.nickname || "",
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate || "",
        color: vehicle.color || "",
        mileage: vehicle.mileage || 0,
        fuel_type: vehicle.fuel_type || "flex",
      });
    } else {
      setFormData({
        nickname: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        plate: "",
        color: "",
        mileage: 0,
        fuel_type: "flex",
      });
    }
  }, [vehicle, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vehicle ? "Editar Veículo" : "Adicionar Veículo"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu veículo para facilitar a gestão de manutenções.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Busca por Placa */}
          {!vehicle && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <PlateSearchInput 
                onVehicleFound={(data) => {
                  // Preencher campos automaticamente
                  if (data.marca) setFormData(prev => ({ ...prev, make: data.marca }));
                  if (data.modelo) setFormData(prev => ({ ...prev, model: data.modelo }));
                  if (data.anoModelo) setFormData(prev => ({ ...prev, year: data.anoModelo }));
                  if (data.cor) setFormData(prev => ({ ...prev, color: data.cor }));
                  
                  // Mapear combustível
                  if (data.combustivel) {
                    const fuelMap: Record<string, string> = {
                      'GASOLINA': 'Gasolina',
                      'ETANOL': 'Etanol', 
                      'FLEX': 'Flex',
                      'DIESEL': 'Diesel',
                      'GNV': 'Gasolina',
                      'ELETRICO': 'Elétrico',
                      'HIBRIDO': 'Híbrido'
                    };
                    const fuelType = fuelMap[data.combustivel.toUpperCase()] || 'Gasolina';
                    setFormData(prev => ({ ...prev, fuel_type: fuelType }));
                  }
                }}
                onPlateChange={(plate) => setFormData(prev => ({ ...prev, plate }))}
              />
              <p className="text-xs text-gray-600 mt-2">
                💡 Digite a placa para preencher os dados automaticamente, ou preencha manualmente abaixo.
              </p>
            </div>
          )}

          {/* Apelido (opcional) */}
          <div>
            <Label htmlFor="nickname">Apelido (opcional)</Label>
            <Input
              id="nickname"
              placeholder="Ex: Meu Fusca, Carrão"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            />
          </div>

          {/* Marca e Modelo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make">Marca *</Label>
              <Select
                value={formData.make}
                onValueChange={(value) => setFormData({ ...formData, make: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  {MARCAS.map((marca) => (
                    <SelectItem key={marca} value={marca}>
                      {marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                placeholder="Ex: Gol, Uno, Civic"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Ano e Placa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Ano *</Label>
              <Select
                value={formData.year.toString()}
                onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                placeholder="ABC-1234 ou ABC1D23"
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                maxLength={8}
              />
            </div>
          </div>

          {/* Cor e Combustível */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="color">Cor</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cor" />
                </SelectTrigger>
                <SelectContent>
                  {CORES.map((cor) => (
                    <SelectItem key={cor} value={cor}>
                      {cor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fuel_type">Combustível</Label>
              <Select
                value={formData.fuel_type}
                onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o combustível" />
                </SelectTrigger>
                <SelectContent>
                  {COMBUSTIVEIS.map((combustivel) => (
                    <SelectItem key={combustivel.value} value={combustivel.value}>
                      {combustivel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quilometragem */}
          <div>
            <Label htmlFor="mileage">Quilometragem Atual (km)</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Ex: 50000"
              value={formData.mileage || ""}
              onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
              min={0}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {vehicle ? "Salvar Alterações" : "Adicionar Veículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

