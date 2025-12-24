"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Workshop } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Lock, Loader2, Zap, TrendingUp, Shield } from "lucide-react";

interface PlanGuardProps {
  children: React.ReactNode;
  feature?: string;
}

export default function PlanGuard({ children, feature = "Gestão Completa" }: PlanGuardProps) {
  const { profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      checkAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const checkAccess = async () => {
    try {
      setLoading(true);

      // Buscar dados da oficina
      const { data: workshopData, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;

      setWorkshop(workshopData);

      // Verificar acesso
      const isPro = workshopData.plan_type === "pro";
      const subscriptionActive = workshopData.subscription_status === "active";
      const trialEndsAt = new Date(workshopData.trial_ends_at || 0);
      const isTrialActive = trialEndsAt > new Date();

      // Tem acesso se: é PRO com assinatura ativa OU está no trial
      const access = (isPro && subscriptionActive) || isTrialActive;
      setHasAccess(access);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!hasAccess) {
    const trialEndsAt = new Date(workshop?.trial_ends_at || 0);
    const daysAgo = Math.floor(
      (new Date().getTime() - trialEndsAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-2 border-purple-200 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 rounded-full">
                <Lock className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Recurso Exclusivo PRO
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              {daysAgo > 0
                ? `Seu período de teste expirou há ${daysAgo} ${daysAgo === 1 ? "dia" : "dias"}`
                : "Este recurso requer o plano PRO"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recurso Bloqueado */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-center text-red-800 font-medium">
                🔒 <strong>{feature}</strong> está bloqueado no plano FREE
              </p>
            </div>

            {/* Benefícios do PRO */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 text-center mb-4">
                Com o Plano PRO você terá:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BenefitCard
                  icon={<Zap className="h-6 w-6 text-purple-600" />}
                  title="Clientes Ilimitados"
                  description="Cadastre quantos clientes precisar"
                />
                <BenefitCard
                  icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
                  title="OS Ilimitadas"
                  description="Crie ordens de serviço sem limite"
                />
                <BenefitCard
                  icon={<Shield className="h-6 w-6 text-purple-600" />}
                  title="Suporte Prioritário"
                  description="Atendimento rápido e dedicado"
                />
              </div>
            </div>

            {/* Preço */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 text-center border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Apenas</p>
              <p className="text-4xl font-bold text-purple-600 mb-1">R$ 97</p>
              <p className="text-gray-600">/mês</p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/oficina/planos")}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                Fazer Upgrade Agora
              </Button>
              <Button
                onClick={() => router.push("/oficina")}
                variant="outline"
                size="lg"
              >
                Voltar ao Dashboard
              </Button>
            </div>

            {/* Garantia */}
            <p className="text-center text-sm text-gray-500">
              ✓ Cancele quando quiser • ✓ Sem multas • ✓ Suporte incluído
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
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
    <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <h4 className="font-semibold text-sm text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
}

