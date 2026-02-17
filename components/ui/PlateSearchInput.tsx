"use client";

import { useState } from "react";
import { Search, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VehicleData {
  marca: string;
  modelo: string;
  ano: number;
  anoModelo: number;
  cor: string;
  combustivel: string;
}

interface PlateSearchInputProps {
  onVehicleFound: (data: VehicleData) => void;
  onPlateChange?: (plate: string) => void;
}

export function PlateSearchInput({ onVehicleFound, onPlateChange }: PlateSearchInputProps) {
  const [plate, setPlate] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [error, setError] = useState("");

  const formatPlate = (value: string) => {
    // Formato: ABC-1234 ou ABC1D23 (Mercosul)
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length <= 3) return clean;
    if (clean.length <= 7) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlate(e.target.value);
    setPlate(formatted);
    setFound(false);
    setError("");
    onPlateChange?.(formatted);
  };

  const handleSearch = async () => {
    if (plate.length < 7) {
      setError("Digite a placa completa");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/vehicle/plate?plate=${plate}`);
      
      if (response.ok) {
        const data = await response.json();
        setFound(true);
        onVehicleFound(data);
      } else {
        setError("Veículo não encontrado");
      }
    } catch (err) {
      setError("Erro ao buscar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Placa do Veículo</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={plate}
            onChange={handleChange}
            placeholder="ABC-1234"
            maxLength={8}
            className="uppercase text-lg font-mono tracking-wider"
          />
          {found && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={loading || plate.length < 7}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {found && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Veículo encontrado! Dados preenchidos automaticamente.
        </p>
      )}
    </div>
  );
}
