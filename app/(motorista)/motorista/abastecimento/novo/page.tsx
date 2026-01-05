"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Fuel, Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function NovoAbastecimentoPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    fuel_type: "gasoline",
    liters: "",
    price_per_liter: "",
    odometer: "",
    gas_station: "",
    city: "",
    state: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-motorista");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      fetchMotoristId();
    }
  }, [profile]);

  useEffect(() => {
    if (motoristId) {
      fetchVehicles();
    }
  }, [motoristId]);

  const fetchMotoristId = async () => {
    if (!profile) return;
    const { data, error } = await supabase
      .from("motorists")
      .select("id")
      .eq("profile_id", profile.id)
      .single();

    if (error) {
      console.error("Erro ao buscar ID do motorista:", error);
      toast.error("Erro ao carregar dados do motorista");
      setLoading(false);
      return;
    }
    setMotoristId(data.id);
  };

  const fetchVehicles = async () => {
    if (!motoristId) return;
    const { data, error } = await supabase
      .from("motorist_vehicles")
      .select("*")
      .eq("motorist_id", motoristId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar veículos:", error);
      toast.error("Erro ao carregar veículos");
    } else {
      setVehicles(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, vehicle_id: data[0].id }));
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!motoristId) {
      toast.error("Erro ao identificar motorista");
      return;
    }

    if (!formData.vehicle_id) {
      toast.error("Selecione um veículo");
      return;
    }

    if (!formData.liters || !formData.price_per_liter || !formData.odometer) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    const totalAmount = parseFloat(formData.liters) * parseFloat(formData.price_per_liter);

    const { error } = await supabase.from("motorist_fueling").insert({
      motorist_id: motoristId,
      vehicle_id: formData.vehicle_id,
      fuel_type: formData.fuel_type,
      liters: parseFloat(formData.liters),
      price_per_liter: parseFloat(formData.price_per_liter),
      total_amount: totalAmount,
      odometer: parseInt(formData.odometer),
      gas_station: formData.gas_station || null,
      city: formData.city || null,
      state: formData.state || null,
      notes: formData.notes || null,
      date: formData.date,
    });

    if (error) {
      console.error("Erro ao salvar abastecimento:", error);
      toast.error("Erro ao salvar abastecimento");
      setSaving(false);
      return;
    }

    toast.success("Abastecimento registrado com sucesso!");
    router.push("/motorista/abastecimento");
  };

  const calculateTotal = () => {
    const liters = parseFloat(formData.liters) || 0;
    const pricePerLiter = parseFloat(formData.price_per_liter) || 0;
    return (liters * pricePerLiter).toFixed(2);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  if (vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <Fuel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum veículo cadastrado</h2>
            <p className="text-gray-600 mb-6">
              Você precisa cadastrar um veículo antes de registrar abastecimentos.
            </p>
            <Link href="/motorista/garagem">
              <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar Veículo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/motorista/abastecimento"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Fuel className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Abastecimento</h1>
              <p className="text-gray-600">Registre um novo abastecimento</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Veículo */}
            <div>
              <Label htmlFor="vehicle_id">
                Veículo <span className="text-red-500">*</span>
              </Label>
              <select
                id="vehicle_id"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                required
              >
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.plate}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <Label htmlFor="date">
                Data <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            {/* Tipo de Combustível */}
            <div>
              <Label htmlFor="fuel_type">
                Tipo de Combustível <span className="text-red-500">*</span>
              </Label>
              <select
                id="fuel_type"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.fuel_type}
                onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
                required
              >
                <option value="gasoline">Gasolina</option>
                <option value="ethanol">Etanol</option>
                <option value="diesel">Diesel</option>
                <option value="gnv">GNV</option>
              </select>
            </div>

            {/* Litros e Preço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="liters">
                  Litros <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  placeholder="45.50"
                  value={formData.liters}
                  onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="price_per_liter">
                  Preço por Litro (R$) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price_per_liter"
                  type="number"
                  step="0.01"
                  placeholder="5.89"
                  value={formData.price_per_liter}
                  onChange={(e) => setFormData({ ...formData, price_per_liter: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Total Calculado */}
            {formData.liters && formData.price_per_liter && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-700 font-medium">Total a Pagar</p>
                <p className="text-3xl font-bold text-green-900">R$ {calculateTotal()}</p>
              </div>
            )}

            {/* Odômetro */}
            <div>
              <Label htmlFor="odometer">
                Quilometragem (KM) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="odometer"
                type="number"
                placeholder="15000"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Informe a quilometragem atual do veículo para calcular o consumo médio
              </p>
            </div>

            {/* Posto */}
            <div>
              <Label htmlFor="gas_station">Posto de Combustível</Label>
              <Input
                id="gas_station"
                type="text"
                placeholder="Ex: Posto Shell"
                value={formData.gas_station}
                onChange={(e) => setFormData({ ...formData, gas_station: e.target.value })}
              />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Ex: Londrina"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <select
                  id="state"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre este abastecimento..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Botões */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Salvar Abastecimento
                  </>
                )}
              </Button>
              <Link href="/motorista/abastecimento">
                <Button type="button" variant="outline" disabled={saving}>
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

