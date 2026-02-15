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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 lg:pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Botão Voltar */}
        <Link href="/motorista/oficinas">
          <Button variant="ghost" className="mb-4 sm:mb-6 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>

        {/* Cover/Banner Premium */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 sm:px-8 py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar/Logo */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {workshop.name}
                  </h1>
                  {workshop.plan_type === "pro" && (
                    <Badge className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold">
                      ⭐ PRO
                    </Badge>
                  )}
                </div>
                
                {workshop.city && workshop.state && (
                  <div className="flex items-center gap-2 text-blue-100 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="text-base sm:text-lg">{workshop.city}, {workshop.state}</span>
                  </div>
                )}
                
                {/* Avaliação */}
                {workshop.average_rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(workshop.average_rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold text-lg">{workshop.average_rating.toFixed(1)}</span>
                    <span className="text-blue-200 text-sm">({workshop.total_reviews} avaliações)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Fixo Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-30">
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg min-h-[56px]"
            onClick={() => setQuoteDialogOpen(true)}
            disabled={!motoristId}
          >
            Solicitar Orçamento
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 pb-24 lg:pb-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Sobre */}
            {workshop.description && (
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-lg sm:text-xl">Sobre a Oficina</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{workshop.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Especialidades */}
            {workshop.specialties && workshop.specialties.length > 0 && (
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-lg sm:text-xl">Especialidades</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {workshop.specialties.map((specialty, index) => (
                      <Badge 
                        key={index} 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-3 py-1.5 text-sm"
                      >
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
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-lg sm:text-xl">Serviços Oferecidos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workshop.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition-colors">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Contato */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-lg">Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {workshop.phone && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Telefone</p>
                      <a
                        href={`tel:${workshop.phone}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {workshop.phone}
                      </a>
                    </div>
                  </div>
                )}
                {workshop.email && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">E-mail</p>
                      <a
                        href={`mailto:${workshop.email}`}
                        className="font-semibold text-blue-600 hover:underline break-all text-sm"
                      >
                        {workshop.email}
                      </a>
                    </div>
                  </div>
                )}
                {workshop.address && (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1">Endereço</p>
                      <p className="font-medium text-gray-900 text-sm">{workshop.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Horário de Funcionamento */}
            {workshop.working_hours && (
              <Card className="border-2 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Horário
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm">
                    {Object.entries(workshop.working_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 capitalize font-medium">{day}:</span>
                        <span className="font-semibold text-gray-900">{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA Desktop */}
            <div className="hidden lg:block sticky top-24">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 min-h-[56px] text-base font-bold"
                onClick={() => setQuoteDialogOpen(true)}
                disabled={!motoristId}
              >
                Solicitar Orçamento
              </Button>
            </div>
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

