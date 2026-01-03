"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Loader2, Building2, Car, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CompletarCadastroPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [userType, setUserType] = useState<"oficina" | "motorista">("oficina");
  const [workshopName, setWorkshopName] = useState("");
  const [phone, setPhone] = useState("");
  
  const supabase = createClient();

  useEffect(() => {
    checkIfNeedsCompletion();
  }, [profile]);

  const checkIfNeedsCompletion = async () => {
    if (!profile) {
      // Redirecionar para home, não para login
      router.push("/");
      return;
    }

    try {
      // Verificar se já tem oficina ou motorista cadastrado
      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (workshop) {
        // Já tem oficina, redirecionar
        router.push("/oficina");
        return;
      }

      if (motorist) {
        // Já tem motorista, redirecionar
        router.push("/motorista");
        return;
      }

      // Precisa completar cadastro
      setLoading(false);
    } catch (error) {
      console.error("Erro ao verificar cadastro:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!profile?.id) {
        throw new Error("Usuário não autenticado");
      }

      // 1. Primeiro, criar ou atualizar o profile com o tipo correto
      const { data: user } = await supabase.auth.getUser();
      
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: profile.id,
          email: user.user?.email || profile.email,
          name: user.user?.user_metadata?.name || profile.name || user.user?.email?.split("@")[0],
          type: userType,
          phone: phone || null,
        });

      if (profileError) throw profileError;

      // 2. Depois, criar oficina ou motorista
      if (userType === "oficina") {
        // Criar oficina
        if (!workshopName.trim()) {
          setError("Por favor, informe o nome da oficina.");
          setSubmitting(false);
          return;
        }

        const { error: workshopError } = await supabase
          .from("workshops")
          .insert({
            profile_id: profile.id,
            name: workshopName,
            phone: phone || null,
            plan_type: "free",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (workshopError) throw workshopError;

        setSuccess(true);
        setTimeout(() => {
          router.push("/oficina");
        }, 1500);
      } else {
        // Criar motorista
        const { error: motoristError } = await supabase
          .from("motorists")
          .insert({
            profile_id: profile.id,
            phone: phone || null,
          });

        if (motoristError) throw motoristError;

        setSuccess(true);
        setTimeout(() => {
          router.push("/motorista");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Erro ao completar cadastro:", err);
      setError(err.message || "Erro ao completar cadastro. Tente novamente.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-md w-full">
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-3xl font-heading font-bold">
                Complete seu Cadastro
              </CardTitle>
              <CardDescription className="text-base">
                Só mais algumas informações para começar
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
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
                      Cadastro concluído! Redirecionando...
                    </span>
                  </div>
                )}

                {/* Tipo de Usuário */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">
                    Você é:
                  </Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value) => setUserType(value as "oficina" | "motorista")}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 border-2 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="oficina" id="oficina" />
                      <Label
                        htmlFor="oficina"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Oficina</div>
                          <div className="text-sm text-gray-600">
                            Gerenciar minha oficina mecânica
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 border-2 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="motorista" id="motorista" />
                      <Label
                        htmlFor="motorista"
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Car className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Motorista</div>
                          <div className="text-sm text-gray-600">
                            Encontrar oficinas e gerenciar meus veículos
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Nome da Oficina (só se for oficina) */}
                {userType === "oficina" && (
                  <div className="space-y-2">
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
                      className="h-11 border-2"
                    />
                  </div>
                )}

                {/* Telefone (opcional) */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Telefone (opcional)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 border-2"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                  disabled={submitting || success}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    <>
                      {userType === "oficina" ? (
                        <Building2 className="mr-2 h-5 w-5" />
                      ) : (
                        <Car className="mr-2 h-5 w-5" />
                      )}
                      Começar a usar
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

