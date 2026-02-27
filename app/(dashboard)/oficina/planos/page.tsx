"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Crown, Zap, Shield, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function PlanosPage() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [stats, setStats] = useState({
    clients: 0,
    ordersThisMonth: 0,
  });
  const supabase = createClient();

  // DEBUG: Log inicial
  console.log("=== DEBUG PLANOS - RENDER ===");
  console.log("profile:", profile);
  console.log("user:", user);
  console.log("workshop:", workshop);
  console.log("loading:", loading);

  useEffect(() => {
    console.log("=== useEffect DISPAROU ===");
    console.log("profile?.id:", profile?.id);
    
    if (profile?.id) {
      console.log("✅ profile.id existe, chamando loadData()");
      loadData();
    } else {
      console.log("❌ profile.id NÃO existe ainda");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const loadData = async () => {
    console.log("=== loadData INICIOU ===");
    console.log("profile?.id na loadData:", profile?.id);
    
    try {
      setLoading(true);

      // Carregar dados da oficina
      console.log("🔍 Buscando workshop no Supabase...");
      const { data: workshopData, error: workshopError } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      console.log("📦 Resposta do Supabase:");
      console.log("  workshopData:", workshopData);
      console.log("  workshopError:", workshopError);

      if (workshopError) throw workshopError;
      
      setWorkshop(workshopData);
      console.log("✅ Workshop setado no state:", workshopData);

      // Carregar estatísticas de uso
      const { count: clientsCount } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshopData.id);

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const { count: ordersCount } = await supabase
        .from("service_orders")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshopData.id)
        .gte("created_at", firstDay.toISOString());

      setStats({
        clients: clientsCount || 0,
        ordersThisMonth: ordersCount || 0,
      });
      
      console.log("📊 Stats carregadas:", { clients: clientsCount, orders: ordersCount });
    } catch (error) {
      console.error("❌ ERRO ao carregar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados.",
      });
    } finally {
      setLoading(false);
      console.log("=== loadData FINALIZADA ===");
    }
  };

  const handleUpgrade = async () => {
    console.log("=== handleUpgrade CHAMADO ===");
    console.log("workshop no handleUpgrade:", workshop);
    console.log("workshop?.id:", workshop?.id);
    console.log("user no handleUpgrade:", user);
    console.log("profile no handleUpgrade:", profile);
    
    // Validações detalhadas
    if (!workshop?.id) {
      console.error("❌ ERRO: Workshop ID não encontrado!");
      console.error("  workshop completo:", workshop);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Dados da oficina não carregados. Tente recarregar a página.",
      });
      return;
    }

    const userEmail = user?.email || profile?.email;
    console.log("📧 Email detectado:", userEmail);
    console.log("  user?.email:", user?.email);
    console.log("  profile?.email:", profile?.email);
    
    if (!userEmail) {
      console.error("❌ ERRO: Email não encontrado!");
      console.error("  user completo:", user);
      console.error("  profile completo:", profile);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Email do usuário não encontrado. Faça login novamente.",
      });
      return;
    }

    setUpgradeLoading(true);
    try {
      const payload = {
        workshopId: workshop.id,
        userEmail: userEmail,
        userName: workshop.name,
      };
      
      console.log("📤 Enviando para API:");
      console.log("  URL: /api/payments/create-subscription");
      console.log("  Payload:", payload);

      const response = await fetch("/api/payments/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("📥 Resposta HTTP status:", response.status);
      
      const data = await response.json();

      console.log("📥 Resposta da API:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.initPoint) {
        // Redirecionar para o checkout do MercadoPago
        toast({
          title: "Redirecionando...",
          description: "Você será redirecionado para o checkout do MercadoPago.",
        });
        window.location.href = data.initPoint;
      } else {
        throw new Error("Link de pagamento não recebido");
      }
    } catch (error: any) {
      console.error("Erro ao iniciar pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description: error.message || "Não foi possível iniciar o pagamento. Tente novamente.",
      });
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleManageSubscription = () => {
    toast({
      title: "Em breve!",
      description: "O gerenciamento de assinatura estará disponível em breve.",
    });
  };

  if (loading || !workshop) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados da oficina...</p>
        </div>
      </div>
    );
  }

  const isPro = workshop?.plan_type === "pro";
  const daysUntilTrialEnd = workshop?.trial_ends_at
    ? Math.ceil(
        (new Date(workshop.trial_ends_at).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Planos</p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Planos e Assinatura 👑
          </h1>
          <p className="text-gray-600">Escolha o melhor plano para sua oficina</p>
        </div>

      {/* Plano Atual */}
      <Card className={cn(
        "border-2",
        isPro ? "bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300" : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isPro ? (
                  <>
                    <Crown className="h-6 w-6 text-purple-600" />
                    <span className="text-purple-600">Plano PRO Ativo</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-6 w-6 text-blue-600" />
                    <span className="text-blue-600">Plano FREE</span>
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-2">
                {isPro ? (
                  "Você tem acesso a todos os recursos premium"
                ) : (
                  <>
                    Trial gratuito - {daysUntilTrialEnd > 0 ? `${daysUntilTrialEnd} dias restantes` : "Expirado"}
                  </>
                )}
              </CardDescription>
            </div>
            {!isPro && (
              <Button 
                onClick={handleUpgrade} 
                size="lg" 
                disabled={upgradeLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {upgradeLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-5 w-5" />
                    Fazer Upgrade
                  </>
                )}
              </Button>
            )}
            {isPro && (
              <Button onClick={handleManageSubscription} variant="outline" size="lg">
                Gerenciar Assinatura
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Comparativo de Planos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Compare os Planos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plano FREE */}
          <Card className={cn(
            "border-2 transition-all",
            !isPro ? "border-blue-500 shadow-lg" : "border-gray-200"
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">FREE</CardTitle>
                {!isPro && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 0</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <CardDescription className="mt-2">
                Perfeito para começar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <FeatureItem included>Dashboard básico</FeatureItem>
                <FeatureItem included>Configurações da oficina</FeatureItem>
                <FeatureItem included>Marketplace de orçamentos</FeatureItem>
                <FeatureItem included>Perfil público</FeatureItem>
                <FeatureItem included>Suporte por email</FeatureItem>
                <FeatureItem included={false}>Sistema de gestão</FeatureItem>
                <FeatureItem included={false}>Clientes e veículos</FeatureItem>
                <FeatureItem included={false}>Ordens de serviço</FeatureItem>
              </ul>
              {isPro && (
                <Button variant="outline" className="w-full" disabled>
                  Plano Atual: PRO
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Plano PRO */}
          <Card className={cn(
            "border-2 transition-all relative overflow-hidden",
            isPro ? "border-purple-500 shadow-lg" : "border-gray-200"
          )}>
            {/* Badge Recomendado */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-xs font-semibold">
              RECOMENDADO
            </div>
            <CardHeader className="pt-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Crown className="h-6 w-6 text-purple-600" />
                  PRO
                </CardTitle>
                {isPro && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold">R$ 97</span>
                <span className="text-gray-600">/mês</span>
              </div>
              <CardDescription className="mt-2">
                Para oficinas que querem crescer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <FeatureItem included highlight>
                  <strong>Clientes ilimitados</strong>
                </FeatureItem>
                <FeatureItem included highlight>
                  <strong>OS ilimitadas</strong>
                </FeatureItem>
                <FeatureItem included>Gestão de veículos</FeatureItem>
                <FeatureItem included>Dashboard avançado</FeatureItem>
                <FeatureItem included>Relatórios completos</FeatureItem>
                <FeatureItem included>Suporte prioritário</FeatureItem>
                <FeatureItem included>Backup automático</FeatureItem>
                <FeatureItem included>Atualizações antecipadas</FeatureItem>
              </ul>
              {!isPro ? (
                <Button
                  onClick={handleUpgrade}
                  disabled={upgradeLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  size="lg"
                >
                  {upgradeLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Crown className="mr-2 h-5 w-5" />
                      Fazer Upgrade Agora
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Gerenciar Assinatura
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefícios do PRO */}
      {!isPro && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              Por que fazer upgrade para PRO?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <BenefitCard
                icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
                title="Cresça sem limites"
                description="Cadastre quantos clientes e OS precisar, sem restrições"
              />
              <BenefitCard
                icon={<Zap className="h-8 w-8 text-purple-600" />}
                title="Recursos avançados"
                description="Acesso a relatórios completos e dashboard avançado"
              />
              <BenefitCard
                icon={<Shield className="h-8 w-8 text-purple-600" />}
                title="Suporte prioritário"
                description="Atendimento rápido e backup automático dos seus dados"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FAQItem
            question="Posso cancelar a qualquer momento?"
            answer="Sim! Você pode cancelar sua assinatura PRO a qualquer momento, sem multas ou taxas de cancelamento."
          />
          <FAQItem
            question="Como funciona o trial gratuito?"
            answer="Você tem 14 dias de trial gratuito com todas as funcionalidades do plano FREE. Após esse período, você pode fazer upgrade para PRO ou continuar no plano FREE."
          />
          <FAQItem
            question="Meus dados estão seguros?"
            answer="Sim! Todos os dados são armazenados de forma segura no Supabase com criptografia e backup automático."
          />
          <FAQItem
            question="Posso mudar de plano depois?"
            answer="Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
          />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

function FeatureItem({
  included,
  highlight,
  children,
}: {
  included: boolean;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      {included ? (
        <Check className={cn(
          "h-5 w-5 flex-shrink-0 mt-0.5",
          highlight ? "text-purple-600" : "text-green-600"
        )} />
      ) : (
        <X className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
      )}
      <span className={cn(
        "text-sm",
        included ? "text-gray-900" : "text-gray-400"
      )}>
        {children}
      </span>
    </li>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
      <h4 className="font-semibold text-gray-900 mb-2">{question}</h4>
      <p className="text-sm text-gray-600">{answer}</p>
    </div>
  );
}

