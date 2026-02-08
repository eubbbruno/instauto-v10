"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, XCircle, DollarSign, Car, Calendar, Trash2, Eye } from "lucide-react";
import { Workshop, Client, Vehicle, Diagnostic } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DiagnosticoPage() {
  return (
    <PlanGuard feature="Diagnóstico com IA">
      <DiagnosticoContent />
    </PlanGuard>
  );
}

function DiagnosticoContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  
  const [symptoms, setSymptoms] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  
  const [viewingDiagnostic, setViewingDiagnostic] = useState<Diagnostic | null>(null);

  useEffect(() => {
    if (profile) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const loadData = async () => {
    try {
      // Buscar workshop
      const { data: workshopData } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (workshopData) {
        setWorkshop(workshopData);

        // Buscar clientes
        const { data: clientsData } = await supabase
          .from("clients")
          .select("*")
          .eq("workshop_id", workshopData.id)
          .order("name");

        setClients(clientsData || []);

        // Buscar histórico de diagnósticos
        const { data: diagnosticsData } = await supabase
          .from("diagnostics")
          .select("*")
          .eq("workshop_id", workshopData.id)
          .order("created_at", { ascending: false });

        setDiagnostics(diagnosticsData || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadVehicles = async (clientId: string) => {
    try {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("client_id", clientId)
        .order("model");

      setVehicles(data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  };

  const handleClientChange = (clientId: string) => {
    setSelectedClient(clientId);
    setSelectedVehicle("");
    setVehicles([]);
    if (clientId) {
      loadVehicles(clientId);
    }
  };

  const handleDiagnose = async () => {
    if (!symptoms.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, descreva os sintomas do veículo.",
      });
      return;
    }

    setLoading(true);
    setDiagnosisResult(null);

    try {
      // Buscar informações do veículo se selecionado
      let vehicleInfo = null;
      if (selectedVehicle) {
        const vehicle = vehicles.find(v => v.id === selectedVehicle);
        if (vehicle) {
          vehicleInfo = {
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            km: vehicle.km,
          };
        }
      }

      // Chamar API de diagnóstico
      const response = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms,
          vehicleInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar diagnóstico");
      }

      setDiagnosisResult(data);

      // Salvar no banco de dados
      const { error: saveError } = await supabase
        .from("diagnostics")
        .insert({
          workshop_id: workshop?.id,
          client_id: selectedClient || null,
          vehicle_id: selectedVehicle || null,
          symptoms,
          diagnosis: data.diagnosis,
          severity: data.metadata.severity,
          estimated_cost: data.metadata.estimatedCost,
          safe_to_drive: data.metadata.safeToDrive,
          ai_model: data.metadata.model,
        });

      if (saveError) {
        console.error("Erro ao salvar diagnóstico:", saveError);
      } else {
        // Recarregar histórico
        loadData();
      }

      toast({
        title: "Diagnóstico gerado!",
        description: "O diagnóstico foi gerado com sucesso pela IA.",
      });
    } catch (error: any) {
      console.error("Erro:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Erro ao gerar diagnóstico. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este diagnóstico?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("diagnostics")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setDiagnostics(diagnostics.filter(d => d.id !== id));

      toast({
        title: "Diagnóstico excluído",
        description: "O diagnóstico foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir diagnóstico.",
      });
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "low": return "text-green-600 bg-green-100 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "high": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getSeverityLabel = (severity?: string) => {
    switch (severity) {
      case "low": return "Baixa";
      case "medium": return "Média";
      case "high": return "Alta";
      default: return "Não especificada";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-violet-50/20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-purple-800 bg-clip-text text-transparent leading-tight mb-3">
            Diagnóstico com IA 🤖
          </h1>
          <p className="text-gray-600 text-lg">Use inteligência artificial para diagnosticar problemas em veículos</p>
        </div>

      {/* Formulário de Diagnóstico */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-6 w-6 text-purple-600" />
            Novo Diagnóstico
          </CardTitle>
          <CardDescription>
            Descreva os sintomas do veículo e a IA irá fornecer um diagnóstico detalhado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de Cliente e Veículo (Opcional) */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente (Opcional)</Label>
              <Select value={selectedClient} onValueChange={handleClientChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Veículo (Opcional)</Label>
              <Select 
                value={selectedVehicle} 
                onValueChange={setSelectedVehicle}
                disabled={!selectedClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sintomas */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">Sintomas do Veículo *</Label>
            <Textarea
              id="symptoms"
              placeholder="Descreva detalhadamente os sintomas, ruídos, comportamentos anormais, quando ocorrem, etc. Quanto mais detalhes, melhor será o diagnóstico.

Exemplo: 'O carro está fazendo um barulho de rangido ao frear, principalmente em baixa velocidade. O barulho vem da parte dianteira esquerda. Também percebi que o pedal do freio está mais duro que o normal.'"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-gray-500">
              {symptoms.length} caracteres
            </p>
          </div>

          {/* Botão */}
          <Button
            onClick={handleDiagnose}
            disabled={loading || !symptoms.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold h-12 text-lg shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Gerar Diagnóstico
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado do Diagnóstico */}
      {diagnosisResult && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-purple-900">
              <Sparkles className="h-6 w-6" />
              Diagnóstico Gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-6 border-2 border-purple-200 shadow-lg">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {diagnosisResult.diagnosis}
                </div>
              </div>

              {/* Metadados */}
              <div className="mt-6 pt-6 border-t border-purple-200 flex flex-wrap gap-4">
                {diagnosisResult.metadata.severity && (
                  <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getSeverityColor(diagnosisResult.metadata.severity)}`}>
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Gravidade: {getSeverityLabel(diagnosisResult.metadata.severity)}
                  </div>
                )}

                {diagnosisResult.metadata.safeToDrive !== null && (
                  <div className={`px-4 py-2 rounded-lg border-2 font-bold ${
                    diagnosisResult.metadata.safeToDrive 
                      ? "text-green-600 bg-green-100 border-green-200"
                      : "text-red-600 bg-red-100 border-red-200"
                  }`}>
                    {diagnosisResult.metadata.safeToDrive ? (
                      <><CheckCircle2 className="h-4 w-4 inline mr-2" />Seguro dirigir</>
                    ) : (
                      <><XCircle className="h-4 w-4 inline mr-2" />Não seguro dirigir</>
                    )}
                  </div>
                )}

                {diagnosisResult.metadata.estimatedCost && (
                  <div className="px-4 py-2 rounded-lg border-2 font-bold text-blue-600 bg-blue-100 border-blue-200">
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    {diagnosisResult.metadata.estimatedCost}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Diagnósticos */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Histórico de Diagnósticos</CardTitle>
          <CardDescription>
            {diagnostics.length} diagnóstico{diagnostics.length !== 1 ? "s" : ""} realizado{diagnostics.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Carregando histórico...</p>
            </div>
          ) : diagnostics.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Nenhum diagnóstico realizado ainda</p>
              <p className="text-sm text-gray-400 mt-2">
                Faça seu primeiro diagnóstico com IA acima
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {diagnostics.map((diagnostic) => (
                <div
                  key={diagnostic.id}
                  className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">
                          {format(new Date(diagnostic.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </span>
                        {diagnostic.severity && (
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(diagnostic.severity)}`}>
                            {getSeverityLabel(diagnostic.severity)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        <strong>Sintomas:</strong> {diagnostic.symptoms}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingDiagnostic(diagnostic)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(diagnostic.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para visualizar diagnóstico */}
      <Dialog open={!!viewingDiagnostic} onOpenChange={() => setViewingDiagnostic(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Diagnóstico Completo
            </DialogTitle>
            <DialogDescription>
              {viewingDiagnostic && format(new Date(viewingDiagnostic.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          {viewingDiagnostic && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Sintomas:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">
                  {viewingDiagnostic.symptoms}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Diagnóstico:</h4>
                <div className="prose max-w-none bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {viewingDiagnostic.diagnosis}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {viewingDiagnostic.severity && (
                  <div className={`px-4 py-2 rounded-lg border-2 font-bold ${getSeverityColor(viewingDiagnostic.severity)}`}>
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Gravidade: {getSeverityLabel(viewingDiagnostic.severity)}
                  </div>
                )}

                {viewingDiagnostic.safe_to_drive !== null && (
                  <div className={`px-4 py-2 rounded-lg border-2 font-bold ${
                    viewingDiagnostic.safe_to_drive 
                      ? "text-green-600 bg-green-100 border-green-200"
                      : "text-red-600 bg-red-100 border-red-200"
                  }`}>
                    {viewingDiagnostic.safe_to_drive ? (
                      <><CheckCircle2 className="h-4 w-4 inline mr-2" />Seguro dirigir</>
                    ) : (
                      <><XCircle className="h-4 w-4 inline mr-2" />Não seguro dirigir</>
                    )}
                  </div>
                )}

                {viewingDiagnostic.estimated_cost && (
                  <div className="px-4 py-2 rounded-lg border-2 font-bold text-blue-600 bg-blue-100 border-blue-200">
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    {viewingDiagnostic.estimated_cost}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
