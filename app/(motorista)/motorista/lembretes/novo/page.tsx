"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Bell, Loader2, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { MotoristVehicle } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function NovoLembretePage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<MotoristVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    vehicle_id: "",
    type: "ipva",
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    amount: "",
    notes: "",
    reminder_days: "30,15,7,1",
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

  useEffect(() => {
    // Auto-preencher título baseado no tipo
    if (formData.type) {
      const titles: Record<string, string> = {
        ipva: "Pagamento IPVA",
        insurance: "Renovação de Seguro",
        revision: "Revisão Programada",
        licensing: "Licenciamento Anual",
        tire_rotation: "Rodízio de Pneus",
        oil_change: "Troca de Óleo",
        inspection: "Vistoria Veicular",
        other: "",
      };
      if (!formData.title || Object.values(titles).includes(formData.title)) {
        setFormData((prev) => ({ ...prev, title: titles[formData.type] || "" }));
      }
    }
  }, [formData.type]);

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
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!motoristId) {
      toast.error("Erro ao identificar motorista");
      return;
    }

    if (!formData.title || !formData.due_date) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setSaving(true);

    const reminderDaysArray = formData.reminder_days
      .split(",")
      .map((d) => parseInt(d.trim()))
      .filter((d) => !isNaN(d));

    const { error } = await supabase.from("motorist_reminders").insert({
      motorist_id: motoristId,
      vehicle_id: formData.vehicle_id || null,
      type: formData.type,
      title: formData.title,
      description: formData.description || null,
      due_date: formData.due_date,
      priority: formData.priority,
      amount: formData.amount ? parseFloat(formData.amount) : null,
      notes: formData.notes || null,
      reminder_days_before: reminderDaysArray,
    });

    if (error) {
      console.error("Erro ao salvar lembrete:", error);
      toast.error("Erro ao salvar lembrete");
      setSaving(false);
      return;
    }

    toast.success("Lembrete criado com sucesso!");
    router.push("/motorista/lembretes");
  };

  const getDaysUntilDue = () => {
    if (!formData.due_date) return null;
    const days = Math.ceil(
      (new Date(formData.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  const daysUntilDue = getDaysUntilDue();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/motorista/lembretes"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-800 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Voltar
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Lembrete</h1>
              <p className="text-gray-600">Crie um lembrete para não esquecer obrigações importantes</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Lembrete */}
            <div>
              <Label htmlFor="type">
                Tipo de Lembrete <span className="text-red-500">*</span>
              </Label>
              <select
                id="type"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="ipva">📄 IPVA</option>
                <option value="insurance">🛡️ Seguro</option>
                <option value="revision">🔧 Revisão</option>
                <option value="licensing">📋 Licenciamento</option>
                <option value="tire_rotation">🔄 Rodízio de Pneus</option>
                <option value="oil_change">🛢️ Troca de Óleo</option>
                <option value="inspection">🔍 Vistoria</option>
                <option value="other">📦 Outro</option>
              </select>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Ex: Pagamento IPVA 2025"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Veículo (opcional) */}
            <div>
              <Label htmlFor="vehicle_id">Veículo (opcional)</Label>
              <select
                id="vehicle_id"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.vehicle_id}
                onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
              >
                <option value="">Geral (todos os veículos)</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.plate}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Deixe em branco para lembretes gerais (ex: CNH, cartão de crédito)
              </p>
            </div>

            {/* Data de Vencimento */}
            <div>
              <Label htmlFor="due_date">
                Data de Vencimento <span className="text-red-500">*</span>
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
              />
              {daysUntilDue !== null && (
                <div
                  className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    daysUntilDue < 0
                      ? "bg-red-100 text-red-800"
                      : daysUntilDue <= 7
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {daysUntilDue < 0 ? (
                    <>
                      <AlertTriangle className="w-4 h-4" /> Atrasado {Math.abs(daysUntilDue)} dias
                    </>
                  ) : daysUntilDue === 0 ? (
                    <>Vence hoje</>
                  ) : daysUntilDue === 1 ? (
                    <>Vence amanhã</>
                  ) : (
                    <>Faltam {daysUntilDue} dias</>
                  )}
                </div>
              )}
            </div>

            {/* Prioridade */}
            <div>
              <Label htmlFor="priority">
                Prioridade <span className="text-red-500">*</span>
              </Label>
              <select
                id="priority"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                required
              >
                <option value="low">🟢 Baixa</option>
                <option value="medium">🟡 Média</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>

            {/* Valor Estimado */}
            <div>
              <Label htmlFor="amount">Valor Estimado (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="500.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Opcional: informe o valor para controle financeiro
              </p>
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Adicione detalhes sobre este lembrete..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Dias de Lembrete */}
            <div>
              <Label htmlFor="reminder_days">Notificar com Antecedência (dias)</Label>
              <Input
                id="reminder_days"
                type="text"
                placeholder="30,15,7,1"
                value={formData.reminder_days}
                onChange={(e) => setFormData({ ...formData, reminder_days: e.target.value })}
              />
              <p className="text-sm text-gray-500 mt-1">
                Separe os dias por vírgula. Ex: 30,15,7,1 (notifica 30, 15, 7 e 1 dia antes)
              </p>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Observações adicionais..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Info sobre Notificações */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">Notificações Automáticas</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Você receberá notificações automáticas nos dias configurados antes do vencimento!
                  </p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex items-center gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" /> Criar Lembrete
                  </>
                )}
              </Button>
              <Link href="/motorista/lembretes">
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

