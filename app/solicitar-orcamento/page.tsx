"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import { PlateSearchInput } from "@/components/ui/PlateSearchInput";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, AlertCircle, Loader2, Upload, X, Car } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

function SolicitarOrcamentoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workshopId = searchParams.get("workshop");

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [motorist, setMotorist] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; preview: string }>>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_id: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_plate: "",
    service_type: "maintenance" as "maintenance" | "repair" | "diagnostic" | "other",
    description: "",
    urgency: "medium" as "low" | "medium" | "high",
  });

  const supabase = createClient();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (workshopId && user) {
      loadWorkshop();
    }
  }, [workshopId, user]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Não logado - redireciona para login com redirect
        console.log("❌ [Orçamento] Usuário não autenticado");
        router.push(`/login?redirect=/solicitar-orcamento?workshop=${workshopId}`);
        return;
      }

      setUser(session.user);
      console.log("✅ [Orçamento] Usuário autenticado:", session.user.email);

      // Buscar profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      console.log("✅ [Orçamento] Profile:", profileData);

      // Buscar motorist
      const { data: motoristData } = await supabase
        .from("motorists")
        .select("*")
        .eq("profile_id", session.user.id)
        .single();

      setMotorist(motoristData);
      console.log("✅ [Orçamento] Motorist:", motoristData);

      // Buscar veículos do motorista
      if (motoristData) {
        const { data: vehiclesData } = await supabase
          .from("motorist_vehicles")
          .select("*")
          .eq("motorist_id", motoristData.id)
          .eq("is_active", true);

        setVehicles(vehiclesData || []);
        console.log("✅ [Orçamento] Veículos:", vehiclesData?.length || 0);
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ [Orçamento] Erro ao verificar autenticação:", error);
      setLoading(false);
    }
  };

  const loadWorkshop = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", workshopId)
        .single();

      if (error) throw error;
      setWorkshop(data);
      console.log("✅ [Orçamento] Oficina carregada:", data.name);
    } catch (error) {
      console.error("❌ [Orçamento] Erro ao carregar oficina:", error);
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setFormData(prev => ({
        ...prev,
        vehicle_id: vehicle.id,
        vehicle_brand: vehicle.make,
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        vehicle_plate: vehicle.plate || "",
      }));
    }
  };

  const handlePlateFound = (data: any) => {
    setFormData(prev => ({
      ...prev,
      vehicle_brand: data.marca || prev.vehicle_brand,
      vehicle_model: data.modelo || prev.vehicle_model,
      vehicle_year: data.ano || prev.vehicle_year,
    }));
    toast.success("Dados do veículo preenchidos automaticamente!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > 3) {
      toast.error("Máximo de 3 imagens permitidas");
      return;
    }

    setUploadingImages(true);

    try {
      const uploadedImages: Array<{ url: string; preview: string }> = [];

      for (const file of files) {
        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Imagem ${file.name} muito grande (máx 5MB)`);
          continue;
        }

        const fileName = `quotes/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file);
        
        if (error) {
          console.error("Erro ao fazer upload:", error);
          toast.error(`Erro ao enviar ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);

        uploadedImages.push({
          url: publicUrl,
          preview: URL.createObjectURL(file)
        });
      }

      setImages(prev => [...prev, ...uploadedImages]);
      toast.success(`${uploadedImages.length} imagem(ns) enviada(s)`);
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      toast.error("Erro ao enviar imagens");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!workshopId) {
        throw new Error("Oficina não selecionada");
      }

      if (!motorist) {
        throw new Error("Dados do motorista não encontrados");
      }

      console.log("📤 [Orçamento] Enviando orçamento...");

      // Inserir orçamento
      const { data: quoteData, error: quoteError } = await supabase
        .from("quotes")
        .insert([
          {
            workshop_id: workshopId,
            motorist_name: profile?.name || user?.email?.split("@")[0] || "Motorista",
            motorist_email: profile?.email || user?.email,
            motorist_phone: profile?.phone || motorist?.phone || "",
            vehicle_brand: formData.vehicle_brand,
            vehicle_model: formData.vehicle_model,
            vehicle_year: formData.vehicle_year,
            vehicle_plate: formData.vehicle_plate,
            service_type: formData.service_type,
            description: formData.description,
            urgency: formData.urgency,
            status: "pending",
            images: images.map(img => img.url),
          },
        ])
        .select()
        .single();

      if (quoteError) {
        console.error("❌ [Orçamento] Erro ao criar:", quoteError);
        throw quoteError;
      }

      console.log("✅ [Orçamento] Orçamento criado:", quoteData.id);

      // Criar notificação para a oficina
      if (workshop) {
        const { data: workshopData } = await supabase
          .from("workshops")
          .select("profile_id, name")
          .eq("id", workshopId)
          .single();

        if (workshopData) {
          await supabase.from("notifications").insert({
            user_id: workshopData.profile_id,
            type: "quote_received",
            title: "Novo orçamento recebido!",
            message: `${profile?.name || "Um motorista"} solicitou orçamento para ${formData.service_type}`,
            is_read: false,
            data: {
              quote_id: quoteData.id,
              motorist_name: profile?.name,
              vehicle: `${formData.vehicle_brand} ${formData.vehicle_model}`,
              service_type: formData.service_type,
            },
          });

          console.log("✅ [Orçamento] Notificação criada");
        }
      }

      setSuccess(true);
      toast.success("Orçamento enviado com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/motorista/orcamentos");
      }, 2000);
    } catch (error: any) {
      console.error("❌ [Orçamento] Erro:", error);
      toast.error(error.message || "Erro ao enviar orçamento");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Orçamento Enviado!
            </h2>
            <p className="text-gray-600 mb-6">
              A oficina {workshop?.name} receberá sua solicitação e entrará em contato em breve.
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando para seus orçamentos...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solicitar Orçamento
            </h1>
            {workshop && (
              <p className="text-gray-600">
                Para: <span className="font-semibold">{workshop.name}</span>
              </p>
            )}
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            {/* Dados do Motorista (readonly) */}
            <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Seus Dados</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-blue-700">Nome:</span> <span className="font-medium">{profile?.name || user?.email}</span></p>
                <p><span className="text-blue-700">Email:</span> <span className="font-medium">{profile?.email || user?.email}</span></p>
                {(profile?.phone || motorist?.phone) && (
                  <p><span className="text-blue-700">Telefone:</span> <span className="font-medium">{profile?.phone || motorist?.phone}</span></p>
                )}
              </div>
            </div>

            {/* Selecionar Veículo */}
            {vehicles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar Veículo da Garagem
                </label>
                <select
                  value={formData.vehicle_id}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione um veículo ou preencha manualmente</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} {vehicle.year} {vehicle.plate ? `- ${vehicle.plate}` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Busca por Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por Placa
              </label>
              <PlateSearchInput
                onVehicleFound={handlePlateFound}
                onPlateChange={(plate) => setFormData(prev => ({ ...prev, vehicle_plate: plate }))}
              />
            </div>

            {/* Dados do Veículo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_brand: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Volkswagen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_model}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_model: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Gol"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano *
                </label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.vehicle_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_year: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placa
                </label>
                <input
                  type="text"
                  value={formData.vehicle_plate}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_plate: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>
            </div>

            {/* Tipo de Serviço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Serviço *
              </label>
              <select
                required
                value={formData.service_type}
                onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="maintenance">Manutenção Preventiva</option>
                <option value="repair">Reparo</option>
                <option value="diagnostic">Diagnóstico</option>
                <option value="other">Outro</option>
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Problema *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Descreva o problema ou serviço necessário..."
              />
            </div>

            {/* Urgência */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgência *
              </label>
              <select
                required
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Baixa - Posso esperar</option>
                <option value="medium">Média - Alguns dias</option>
                <option value="high">Alta - Urgente</option>
              </select>
            </div>

            {/* Upload de Imagens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anexar Fotos (opcional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Ajuda a oficina entender melhor o problema (máx 3 imagens, 5MB cada)
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploadingImages || images.length >= 3}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${uploadingImages || images.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? "Enviando..." : images.length >= 3 ? "Máximo atingido" : "Clique para selecionar imagens"}
                  </p>
                </label>
              </div>

              {/* Preview das imagens */}
              {images.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-24 h-24 group">
                      <Image
                        src={img.preview}
                        alt={`Imagem ${i + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={submitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Orçamento"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function SolicitarOrcamentoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <SolicitarOrcamentoContent />
    </Suspense>
  );
}
