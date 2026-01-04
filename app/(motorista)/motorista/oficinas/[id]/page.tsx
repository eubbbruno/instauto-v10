"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, MapPin, Phone, Mail, Clock, Star, 
  CheckCircle, Loader2, Building2, Calendar 
} from "lucide-react";
import { Workshop } from "@/types/database";
import Link from "next/link";
import { QuoteRequestDialog } from "@/components/motorista/QuoteRequestDialog";
import { useToast } from "@/components/ui/use-toast";

export default function OficinaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [motoristId, setMotoristId] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      loadWorkshop();
      loadMotoristId();
    }
  }, [params.id, authLoading]);

  const loadMotoristId = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (data) {
        setMotoristId(data.id);
      }
    } catch (error) {
      console.error("Erro ao carregar motorista:", error);
    }
  };

  const loadWorkshop = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", params.id)
        .eq("is_public", true)
        .single();

      if (error) throw error;
      setWorkshop(data);
    } catch (error) {
      console.error("Erro ao carregar oficina:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados da oficina.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSuccess = () => {
    toast({
      title: "Sucesso!",
      description: "Seu orçamento foi enviado. A oficina responderá em breve.",
    });
    router.push("/motorista/orcamentos");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Oficina não encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                A oficina que você procura não existe ou não está mais disponível.
              </p>
              <Link href="/motorista/oficinas">
                <Button>Voltar para Buscar Oficinas</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Botão Voltar */}
        <Link href="/motorista/oficinas">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Buscar Oficinas
          </Button>
        </Link>

        {/* Header da Oficina */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <Building2 className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-2xl md:text-3xl mb-2">{workshop.name}</CardTitle>
                    {workshop.city && workshop.state && (
                      <CardDescription className="flex items-center gap-1 text-base">
                        <MapPin className="h-4 w-4" />
                        {workshop.city}, {workshop.state}
                      </CardDescription>
                    )}
                  </div>
                </div>
                {workshop.plan_type === "pro" && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    ⭐ Oficina PRO
                  </Badge>
                )}
              </div>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                onClick={() => setQuoteDialogOpen(true)}
                disabled={!motoristId}
              >
                Solicitar Orçamento
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sobre */}
            {workshop.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre a Oficina</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-line">{workshop.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Especialidades */}
            {workshop.specialties && workshop.specialties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {workshop.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Serviços */}
            {workshop.services && workshop.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Serviços Oferecidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workshop.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workshop.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Telefone</p>
                      <a
                        href={`tel:${workshop.phone}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {workshop.phone}
                      </a>
                    </div>
                  </div>
                )}
                {workshop.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <a
                        href={`mailto:${workshop.email}`}
                        className="font-medium text-blue-600 hover:underline break-all"
                      >
                        {workshop.email}
                      </a>
                    </div>
                  </div>
                )}
                {workshop.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Endereço</p>
                      <p className="font-medium text-gray-900">{workshop.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Avaliação */}
            {workshop.average_rating && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold">{workshop.average_rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Baseado em {workshop.total_reviews} avaliações
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Horário de Funcionamento */}
            {workshop.working_hours && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(workshop.working_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 capitalize">{day}:</span>
                        <span className="font-medium">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de Solicitar Orçamento */}
      {motoristId && (
        <QuoteRequestDialog
          open={quoteDialogOpen}
          onOpenChange={setQuoteDialogOpen}
          workshop={workshop}
          motoristId={motoristId}
          onSuccess={handleQuoteSuccess}
        />
      )}
    </div>
  );
}

