"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Building2, CheckCircle, Phone, MapPin, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CompletarCadastroOficinaPage() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [workshopName, setWorkshopName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    checkIfNeedsCompletion();
  }, [profile, authLoading]);

  const checkIfNeedsCompletion = async () => {
    // ⚠️ AGUARDAR authLoading terminar antes de verificar profile
    if (authLoading) {
      console.log("⏳ Aguardando auth carregar...");
      return;
    }

    if (!profile) {
      console.log("❌ Sem profile após auth carregar, redirecionando para login");
      router.push("/login-oficina");
      return;
    }

    console.log("✅ Profile carregado:", profile.id, profile.type);

    try {
      // Verificar se já tem oficina cadastrada
      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (workshop) {
        // Já tem oficina, redirecionar para dashboard
        router.push("/oficina");
        return;
      }

      // Verificar se é motorista (não deveria estar aqui)
      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (motorist) {
        // É motorista, redirecionar
        router.push("/motorista");
        return;
      }

      // Precisa completar cadastro da oficina
      setLoading(false);
    } catch (error) {
      console.error("Erro ao verificar cadastro:", error);
      setLoading(false);
    }
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!profile?.id) {
        throw new Error("Usuário não autenticado");
      }

      // Validações
      if (!workshopName.trim()) {
        setError("Por favor, informe o nome da oficina.");
        setSubmitting(false);
        return;
      }

      if (!phone.trim()) {
        setError("Por favor, informe o telefone.");
        setSubmitting(false);
        return;
      }

      if (!cnpj.trim()) {
        setError("Por favor, informe o CNPJ ou CPF.");
        setSubmitting(false);
        return;
      }

      if (!address.trim() || !city.trim() || !state.trim()) {
        setError("Por favor, preencha o endereço completo.");
        setSubmitting(false);
        return;
      }

      // Atualizar profile para tipo oficina (se ainda não for)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          type: "oficina",
        })
        .eq("id", profile.id);

      if (profileError) {
        console.error("Erro ao atualizar profile:", profileError);
      }

      // Criar oficina
      const { error: workshopError } = await supabase
        .from("workshops")
        .insert({
          profile_id: profile.id,
          name: workshopName,
          cnpj: cnpj.replace(/\D/g, ""),
          phone: phone.replace(/\D/g, ""),
          address: address,
          city: city,
          state: state.toUpperCase(),
          description: description || null,
          plan_type: "free",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          is_public: true,
          accepts_quotes: true,
        });

      if (workshopError) {
        console.error("Erro ao criar workshop:", workshopError);
        throw workshopError;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/oficina?welcome=true");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao completar cadastro:", err);
      setError(err.message || "Erro ao completar cadastro. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-3xl w-full">
          <Card className="border-2 shadow-2xl">
            <CardHeader className="space-y-1 pb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-heading font-bold">
                    Complete o Cadastro da sua Oficina
                  </CardTitle>
                  <CardDescription className="text-yellow-50 text-base mt-1">
                    Preencha os dados para começar a usar o sistema e aparecer no marketplace
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-2 border-green-200 text-green-800 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      🎉 Cadastro concluído! Redirecionando para o dashboard...
                    </span>
                  </div>
                )}

                {/* Dados Básicos */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-yellow-600" />
                    Dados da Oficina
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="workshopName" className="text-sm font-semibold text-gray-700">
                        Nome da Oficina *
                      </Label>
                      <Input
                        id="workshopName"
                        type="text"
                        placeholder="Ex: Auto Center Silva"
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        required
                        disabled={submitting || success}
                        className="h-11 border-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cnpj" className="text-sm font-semibold text-gray-700">
                        CNPJ ou CPF *
                      </Label>
                      <Input
                        id="cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00 ou 000.000.000-00"
                        value={cnpj}
                        onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                        maxLength={18}
                        required
                        disabled={submitting || success}
                        className="h-11 border-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        Telefone *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={phone}
                          onChange={(e) => setPhone(formatPhone(e.target.value))}
                          maxLength={15}
                          required
                          disabled={submitting || success}
                          className="h-11 border-2 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                      Descrição (opcional)
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Conte um pouco sobre sua oficina, especialidades, diferenciais..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={submitting || success}
                      className="border-2 min-h-[100px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500">{description.length}/500 caracteres</p>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                    Endereço *
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                        Rua/Avenida, Número *
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Rua, número, complemento"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        disabled={submitting || success}
                        className="h-11 border-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                        Cidade *
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Sua cidade"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={submitting || success}
                        className="h-11 border-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
                        Estado (UF) *
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="Ex: SP"
                        value={state}
                        onChange={(e) => setState(e.target.value.toUpperCase())}
                        maxLength={2}
                        required
                        disabled={submitting || success}
                        className="h-11 border-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Informação sobre o plano */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">🎁 Teste Grátis por 14 dias!</p>
                      <p>
                        Você terá acesso completo ao sistema por 14 dias. Após o período de teste,
                        você pode continuar no plano FREE (grátis) ou fazer upgrade para o plano PRO.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 shadow-lg hover:shadow-xl transition-all"
                  disabled={submitting || success}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Criando sua oficina...
                    </>
                  ) : (
                    <>
                      <Building2 className="mr-2 h-6 w-6" />
                      Começar a usar o Instauto
                    </>
                  )}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
