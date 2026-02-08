"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import PlanGuard from "@/components/auth/PlanGuard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Loader2, MessageSquare, Send, Phone, CheckCircle2, Clock, AlertCircle, Copy, Zap, Settings } from "lucide-react";
import { Workshop, Client } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
}

const messageTemplates: MessageTemplate[] = [
  {
    id: "os_created",
    name: "OS Criada",
    description: "Enviada quando uma nova OS é criada",
    template: "Olá {cliente}! 👋\n\nSua Ordem de Serviço #{numero_os} foi criada com sucesso!\n\n📋 Serviços: {servicos}\n💰 Valor estimado: {valor}\n\nEm breve entraremos em contato.\n\n{oficina}",
    variables: ["cliente", "numero_os", "servicos", "valor", "oficina"],
  },
  {
    id: "os_approved",
    name: "OS Aprovada",
    description: "Enviada quando a OS é aprovada",
    template: "Olá {cliente}! ✅\n\nSua OS #{numero_os} foi APROVADA e já estamos trabalhando nela!\n\n🔧 Previsão de conclusão: {previsao}\n\nQualquer dúvida, estamos à disposição.\n\n{oficina}",
    variables: ["cliente", "numero_os", "previsao", "oficina"],
  },
  {
    id: "os_completed",
    name: "OS Concluída",
    description: "Enviada quando a OS é concluída",
    template: "Olá {cliente}! 🎉\n\nSeu veículo está PRONTO! ✨\n\n✅ OS #{numero_os} concluída\n🚗 {veiculo}\n💰 Valor total: {valor}\n\nVocê pode retirar seu veículo a qualquer momento!\n\n{oficina}\n📍 {endereco}",
    variables: ["cliente", "numero_os", "veiculo", "valor", "oficina", "endereco"],
  },
  {
    id: "appointment_reminder",
    name: "Lembrete de Agendamento",
    description: "Lembrete enviado 1 dia antes",
    template: "Olá {cliente}! ⏰\n\nLembramos que você tem um agendamento amanhã:\n\n📅 Data: {data}\n🕐 Horário: {horario}\n🚗 Veículo: {veiculo}\n\nConfirme sua presença respondendo esta mensagem.\n\n{oficina}",
    variables: ["cliente", "data", "horario", "veiculo", "oficina"],
  },
  {
    id: "custom",
    name: "Mensagem Personalizada",
    description: "Crie sua própria mensagem",
    template: "",
    variables: [],
  },
];

export default function WhatsAppPage() {
  return (
    <PlanGuard feature="Integração WhatsApp">
      <WhatsAppContent />
    </PlanGuard>
  );
}

function WhatsAppContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  
  // Configuração
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [configured, setConfigured] = useState(false);
  
  // Envio de mensagem
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("custom");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  // Histórico
  const [history, setHistory] = useState<any[]>([]);

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
        
        // Verificar se já está configurado (simulado)
        const storedConfig = localStorage.getItem(`whatsapp_config_${workshopData.id}`);
        if (storedConfig) {
          const config = JSON.parse(storedConfig);
          setWhatsappNumber(config.number);
          setConfigured(true);
        }

        // Buscar clientes
        const { data: clientsData } = await supabase
          .from("clients")
          .select("*")
          .eq("workshop_id", workshopData.id)
          .order("name");

        setClients(clientsData || []);

        // Buscar histórico (simulado)
        const storedHistory = localStorage.getItem(`whatsapp_history_${workshopData.id}`);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleSaveConfig = () => {
    if (!whatsappNumber) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha o número do WhatsApp",
      });
      return;
    }

    // Salvar configuração (simulado - em produção seria no banco)
    localStorage.setItem(
      `whatsapp_config_${workshop?.id}`,
      JSON.stringify({
        number: whatsappNumber,
        apiKey: apiKey,
        configuredAt: new Date().toISOString(),
      })
    );

    setConfigured(true);

    toast({
      title: "Configuração salva!",
      description: "WhatsApp configurado com sucesso.",
    });
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template && template.template) {
      setMessage(template.template);
    } else {
      setMessage("");
    }
  };

  const handleSendMessage = async () => {
    if (!selectedClient || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Selecione um cliente e escreva a mensagem",
      });
      return;
    }

    const client = clients.find(c => c.id === selectedClient);
    if (!client?.phone) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Cliente não possui telefone cadastrado",
      });
      return;
    }

    setSending(true);

    try {
      // Simular envio (em produção seria chamada à API do WhatsApp)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Substituir variáveis
      let finalMessage = message;
      finalMessage = finalMessage.replace(/{cliente}/g, client.name);
      finalMessage = finalMessage.replace(/{oficina}/g, workshop?.name || "");
      finalMessage = finalMessage.replace(/{endereco}/g, workshop?.address || "");

      // Adicionar ao histórico
      const newMessage = {
        id: Date.now().toString(),
        clientId: client.id,
        clientName: client.name,
        clientPhone: client.phone,
        message: finalMessage,
        template: selectedTemplate,
        status: "sent",
        sentAt: new Date().toISOString(),
      };

      const updatedHistory = [newMessage, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`whatsapp_history_${workshop?.id}`, JSON.stringify(updatedHistory));

      toast({
        title: "Mensagem enviada!",
        description: `Mensagem enviada para ${client.name}`,
      });

      // Limpar formulário
      setSelectedClient("");
      setMessage("");
      setSelectedTemplate("custom");
    } catch (error: any) {
      console.error("Erro ao enviar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar mensagem. Tente novamente.",
      });
    } finally {
      setSending(false);
    }
  };

  const copyTemplate = (template: string) => {
    navigator.clipboard.writeText(template);
    toast({
      title: "Copiado!",
      description: "Template copiado para a área de transferência",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-800 bg-clip-text text-transparent leading-tight mb-3">
            Integração WhatsApp 💬
          </h1>
          <p className="text-gray-600 text-lg">Configure e envie mensagens automáticas via WhatsApp</p>
        </div>

      <Tabs defaultValue={configured ? "send" : "config"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center gap-2" disabled={!configured}>
            <Send className="h-4 w-4" />
            Enviar Mensagens
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2" disabled={!configured}>
            <Clock className="h-4 w-4" />
            Histórico
          </TabsTrigger>
        </TabsList>

        {/* Configuração */}
        <TabsContent value="config" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-6 w-6 text-green-600" />
                Configurar WhatsApp Business
              </CardTitle>
              <CardDescription>
                Configure sua conta do WhatsApp Business para enviar mensagens automáticas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              {configured && (
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    WhatsApp Configurado
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Número: {whatsappNumber}
                  </p>
                </div>
              )}

              {/* Formulário */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">Número do WhatsApp Business *</Label>
                  <Input
                    id="whatsappNumber"
                    placeholder="(00) 00000-0000"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Número da conta WhatsApp Business da oficina
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key (Opcional)</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Chave da API do WhatsApp Business"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Necessário para integração real com WhatsApp Business API
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSaveConfig}
                className="w-full bg-green-600 hover:bg-green-700 font-bold"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Salvar Configuração
              </Button>

              {/* Informações */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">ℹ️ Como funciona?</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Configure seu número do WhatsApp Business</li>
                  <li>• Crie templates de mensagens personalizadas</li>
                  <li>• Envie mensagens automáticas para clientes</li>
                  <li>• Acompanhe o histórico de envios</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Versão Demo</h4>
                <p className="text-sm text-yellow-800">
                  Esta é uma versão demonstrativa. As mensagens são simuladas e não são enviadas de verdade.
                  Para integração real, é necessário configurar a WhatsApp Business API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enviar Mensagens */}
        <TabsContent value="send" className="space-y-6">
          {/* Templates */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-purple-600" />
                Templates de Mensagens
              </CardTitle>
              <CardDescription>
                Use templates prontos ou crie mensagens personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {messageTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    onClick={() => handleTemplateChange(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {template.name}
                        {template.template && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyTemplate(template.template);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Envio */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-6 w-6 text-green-600" />
                Enviar Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.phone ? `- ${client.phone}` : "(sem telefone)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  placeholder="Digite sua mensagem aqui..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  Variáveis disponíveis: {"{cliente}"}, {"{oficina}"}, {"{endereco}"}
                </p>
              </div>

              <Button
                onClick={handleSendMessage}
                disabled={sending || !selectedClient || !message.trim()}
                className="w-full bg-green-600 hover:bg-green-700 font-bold h-12"
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-blue-600" />
                Histórico de Mensagens
              </CardTitle>
              <CardDescription>
                {history.length} mensagem{history.length !== 1 ? "s" : ""} enviada{history.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Nenhuma mensagem enviada ainda</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900">{msg.clientName}</p>
                          <p className="text-sm text-gray-600">{msg.clientPhone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border-2 border-green-200">
                            <CheckCircle2 className="h-3 w-3 inline mr-1" />
                            Enviada
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(new Date(msg.sentAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
