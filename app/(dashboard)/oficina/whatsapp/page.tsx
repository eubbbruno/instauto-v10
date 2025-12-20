"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlanGuard } from "@/components/auth/PlanGuard";
import { MessageSquare, Smartphone, Zap, CheckCircle, AlertCircle, QrCode, Users, Send } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function WhatsAppPage() {
  const [connected, setConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConnect = () => {
    if (!phoneNumber) return;
    // Simulação de conexão
    setTimeout(() => {
      setConnected(true);
    }, 1500);
  };

  const features = [
    {
      icon: <Send className="h-5 w-5" />,
      title: "Envio Automático",
      description: "Notificações de OS, agendamentos e lembretes",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Mensagens em Massa",
      description: "Envie promoções e avisos para todos os clientes",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Respostas Rápidas",
      description: "Templates prontos para agilizar o atendimento",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Confirmação de Leitura",
      description: "Saiba quando o cliente visualizou a mensagem",
    },
  ];

  return (
    <PlanGuard>
      <div className="space-y-8">
        <PageHeader
          title="Integração WhatsApp"
          description="Conecte seu WhatsApp e automatize o atendimento"
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Connection Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">Conectar WhatsApp</CardTitle>
              <CardDescription>
                {connected ? "Sua conta está conectada" : "Configure sua conta do WhatsApp Business"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!connected ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-bold text-gray-700">
                      Número do WhatsApp Business
                    </Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 h-12 border-2"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Use um número com WhatsApp Business ativo
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p className="font-bold mb-1">Requisitos:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Conta do WhatsApp Business</li>
                          <li>• Número verificado</li>
                          <li>• API do WhatsApp Business ativa</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleConnect}
                    disabled={!phoneNumber}
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold shadow-lg shadow-green-500/30"
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Conectar via QR Code
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">Conectado com Sucesso!</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Seu WhatsApp Business está conectado e pronto para uso
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                      <Smartphone className="h-4 w-4 text-green-700" />
                      <span className="text-sm font-bold text-green-700">{phoneNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full border-2 font-bold" variant="outline">
                      Testar Conexão
                    </Button>
                    <Button
                      className="w-full border-2 font-bold"
                      variant="outline"
                      onClick={() => setConnected(false)}
                    >
                      Desconectar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">Recursos Disponíveis</CardTitle>
              <CardDescription>
                O que você pode fazer com a integração
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Templates Section */}
        {connected && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl font-heading font-bold">Templates de Mensagens</CardTitle>
              <CardDescription>
                Mensagens prontas para agilizar o atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Confirmação de Agendamento",
                    message: "Olá {nome}! Seu agendamento está confirmado para {data} às {hora}. Até lá! 🚗",
                  },
                  {
                    title: "OS Concluída",
                    message: "Olá {nome}! Seu veículo está pronto. O serviço foi concluído com sucesso. Pode buscar quando quiser! ✅",
                  },
                  {
                    title: "Lembrete de Revisão",
                    message: "Olá {nome}! Está na hora da revisão do seu {veiculo}. Agende já e garanta a saúde do seu carro! 🔧",
                  },
                  {
                    title: "Orçamento Aprovado",
                    message: "Olá {nome}! Recebemos a aprovação do orçamento. Vamos iniciar o serviço em breve! 👍",
                  },
                ].map((template, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-2">{template.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.message}</p>
                    <Button size="sm" variant="outline" className="w-full border-2 font-bold">
                      Usar Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <MessageSquare className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Integração Oficial</h3>
                <p className="text-sm text-gray-700">
                  Utilizamos a API oficial do WhatsApp Business para garantir segurança e conformidade 
                  com as políticas da Meta. Seus dados e mensagens estão protegidos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PlanGuard>
  );
}
