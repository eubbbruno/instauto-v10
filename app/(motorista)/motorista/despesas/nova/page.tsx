"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { DollarSign, Loader2, ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function NovaDespesaPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    category: "maintenance",
    amount: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
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

    if (!formData.amount || !formData.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("motorist_expenses").insert({
      motorist_id: motoristId,
      vehicle_id: formData.vehicle_id,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      notes: formData.notes || null,
      date: formData.date,
    });

    if (error) {
      console.error("Erro ao salvar despesa:", error);
      toast.error("Erro ao salvar despesa");
      setSaving(false);
      return;
    }

    toast.success("Despesa registrada com sucesso!");
    router.push("/motorista/despesas");
  };

  const getCategoryInfo = (category: string) => {
    const info: Record<string, { label: string; icon: string; color: string }> = {
      fuel: { label: "Combustível", icon: "⛽", color: "bg-blue-100 text-blue-800" },
      maintenance: { label: "Manutenção", icon: "🔧", color: "bg-yellow-100 text-yellow-800" },
      insurance: { label: "Seguro", icon: "🛡️", color: "bg-green-100 text-green-800" },
      ipva: { label: "IPVA", icon: "📄", color: "bg-purple-100 text-purple-800" },
      fine: { label: "Multa", icon: "🚨", color: "bg-red-100 text-red-800" },
      parking: { label: "Estacionamento", icon: "🅿️", color: "bg-gray-100 text-gray-800" },
      toll: { label: "Pedágio", icon: "🛣️", color: "bg-indigo-100 text-indigo-800" },
      wash: { label: "Lavagem", icon: "💧", color: "bg-cyan-100 text-cyan-800" },
      other: { label: "Outro", icon: "📦", color: "bg-gray-100 text-gray-800" },
    };
    return info[category] || info.other;
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
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum veículo cadastrado</h2>
            <p className="text-gray-600 mb-6">
              Você precisa cadastrar um veículo antes de registrar despesas.
            </p>
            <Link href="/motorista/garagem">
              <Button className="bg-blue-600 hover:bg-blue-700">Cadastrar Veículo</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(formData.category);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/motorista/despesas"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nova Despesa</h1>
              <p className="text-gray-600">Registre uma nova despesa do veículo</p>
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

            {/* Categoria */}
            <div>
              <Label htmlFor="category">
                Categoria <span className="text-red-500">*</span>
              </Label>
              <select
                id="category"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="fuel">⛽ Combustível</option>
                <option value="maintenance">🔧 Manutenção</option>
                <option value="insurance">🛡️ Seguro</option>
                <option value="ipva">📄 IPVA</option>
                <option value="fine">🚨 Multa</option>
                <option value="parking">🅿️ Estacionamento</option>
                <option value="toll">🛣️ Pedágio</option>
                <option value="wash">💧 Lavagem</option>
                <option value="other">📦 Outro</option>
              </select>
              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                <span>{categoryInfo.icon}</span>
                <span>{categoryInfo.label}</span>
              </div>
            </div>

            {/* Valor */}
            <div>
              <Label htmlFor="amount">
                Valor (R$) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              {formData.amount && (
                <p className="text-sm text-gray-500 mt-1">
                  Valor formatado: R$ {parseFloat(formData.amount).toFixed(2)}
                </p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">
                Descrição <span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Troca de óleo e filtros"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre esta despesa..."
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Upload de Nota Fiscal (futuro) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Upload de Nota Fiscal</p>
                  <p className="text-xs text-blue-700">Em breve você poderá anexar comprovantes!</p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Salvar Despesa
                  </>
                )}
              </Button>
              <Link href="/motorista/despesas">
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

