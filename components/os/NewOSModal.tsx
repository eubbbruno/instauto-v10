"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, X, Search } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { FadeIn } from "@/components/ui/motion";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
}

interface NewOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
}

export default function NewOSModal({ isOpen, onClose, workshopId }: NewOSModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchingClients, setSearchingClients] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    client_name: "",
    vehicle_id: "",
    description: "",
    km_entry: "",
    estimated_completion: "",
  });

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (clientSearch.length >= 2) {
      searchClients();
    } else {
      setClients([]);
      setShowClientDropdown(false);
    }
  }, [clientSearch]);

  useEffect(() => {
    if (formData.client_id) {
      loadClientVehicles(formData.client_id);
    } else {
      setVehicles([]);
    }
  }, [formData.client_id]);

  const searchClients = async () => {
    setSearchingClients(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, name, email, phone")
        .eq("workshop_id", workshopId)
        .ilike("name", `%${clientSearch}%`)
        .limit(5);

      if (error) throw error;

      setClients(data || []);
      setShowClientDropdown(true);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setSearchingClients(false);
    }
  };

  const loadClientVehicles = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, brand, model, year, plate")
        .eq("client_id", clientId);

      if (error) throw error;

      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      toast.error("Erro ao carregar veículos do cliente");
    }
  };

  const selectClient = (client: Client) => {
    setFormData({
      ...formData,
      client_id: client.id,
      client_name: client.name,
    });
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client_id || !formData.vehicle_id || !formData.description.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const { data: order, error } = await supabase
        .from("service_orders")
        .insert({
          workshop_id: workshopId,
          client_id: formData.client_id,
          vehicle_id: formData.vehicle_id,
          description: formData.description.trim(),
          km_entry: formData.km_entry ? parseInt(formData.km_entry) : null,
          estimated_completion: formData.estimated_completion || null,
          status: "pending",
          total: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("OS criada com sucesso!");
      onClose();
      router.push(`/oficina/ordens-servico/${order.id}`);
    } catch (error) {
      console.error("Erro ao criar OS:", error);
      toast.error("Erro ao criar OS");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <FadeIn>
        <GlassCard className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Nova Ordem de Serviço</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Buscar Cliente */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Digite o nome do cliente..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchingClients && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-600" />
                )}
              </div>

              {/* Dropdown de clientes */}
              {showClientDropdown && clients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => selectClient(client)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      {client.phone && (
                        <p className="text-xs text-gray-500 mt-0.5">{client.phone}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {clientSearch.length >= 2 && clients.length === 0 && !searchingClients && (
                <p className="text-xs text-gray-500 mt-1">Nenhum cliente encontrado</p>
              )}
            </div>

            {/* Selecionar Veículo */}
            {formData.client_id && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veículo *
                </label>
                <select
                  value={formData.vehicle_id}
                  onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um veículo</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} {vehicle.year} - {vehicle.plate}
                    </option>
                  ))}
                </select>
                {vehicles.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Este cliente não possui veículos cadastrados
                  </p>
                )}
              </div>
            )}

            {/* Descrição do Problema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Problema *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o problema relatado pelo cliente..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* KM Entrada e Previsão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM de Entrada
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.km_entry}
                  onChange={(e) => setFormData({ ...formData, km_entry: e.target.value })}
                  placeholder="Ex: 45000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previsão de Conclusão
                </label>
                <input
                  type="date"
                  value={formData.estimated_completion}
                  onChange={(e) => setFormData({ ...formData, estimated_completion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !formData.client_id || !formData.vehicle_id}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar OS"
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
