"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface RespondQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: any;
  workshopId: string;
  onSuccess: () => void;
}

export function RespondQuoteDialog({ open, onOpenChange, quote, workshopId, onSuccess }: RespondQuoteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<"accept" | "reject">("accept");
  const supabase = createClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    workshop_response: "",
    estimated_price: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        status: responseType === "accept" ? "responded" : "rejected",
        workshop_response: formData.workshop_response,
        responded_at: new Date().toISOString(),
      };

      if (responseType === "accept" && formData.estimated_price) {
        updateData.estimated_price = parseFloat(formData.estimated_price);
      }

      const { error } = await supabase
        .from("quotes")
        .update(updateData)
        .eq("id", quote.id)
        .eq("workshop_id", workshopId);

      if (error) throw error;

      console.log("✅ Orçamento atualizado, criando notificação...");

      // Criar notificação para o motorista
      try {
        // 1. Buscar profile_id do motorista pelo email
        const { data: motoristProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("email", quote.motorist_email)
          .single();

        if (profileError) {
          console.error("❌ Erro ao buscar profile do motorista:", profileError);
        } else if (motoristProfile) {
          // 2. Buscar nome da oficina
          const { data: workshop } = await supabase
            .from("workshops")
            .select("name")
            .eq("id", workshopId)
            .single();

          const workshopName = workshop?.name || "Oficina";

          // 3. Criar notificação
          const { error: notifError } = await supabase.from("notifications").insert({
            user_id: motoristProfile.id,
            type: responseType === "accept" ? "quote_response" : "quote_rejected",
            title: responseType === "accept" 
              ? "Orçamento Respondido! 🎉" 
              : "Orçamento Recusado",
            message: responseType === "accept"
              ? `A oficina ${workshopName} respondeu seu orçamento. Valor estimado: R$ ${parseFloat(formData.estimated_price).toFixed(2)}`
              : `A oficina ${workshopName} não pôde atender seu orçamento no momento.`,
            is_read: false,
            data: {
              quote_id: quote.id,
              workshop_id: workshopId,
              estimated_price: responseType === "accept" ? parseFloat(formData.estimated_price) : null,
              response_type: responseType
            }
          });

          if (notifError) {
            console.error("❌ Erro ao criar notificação:", notifError);
          } else {
            console.log("✅ Notificação criada para motorista:", motoristProfile.id);
          }
        }
      } catch (notifError) {
        console.error("❌ Erro no processo de notificação:", notifError);
        // Não falha a operação principal se notificação falhar
      }

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        workshop_response: "",
        estimated_price: "",
      });
      setResponseType("accept");

      toast({
        title: "Sucesso!",
        description: responseType === "accept" 
          ? "Orçamento enviado com sucesso. O motorista foi notificado."
          : "Recusa enviada. O motorista foi notificado.",
      });
    } catch (error) {
      console.error("❌ Erro ao responder orçamento:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a resposta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Responder Solicitação de Orçamento</DialogTitle>
          <DialogDescription>
            Envie sua resposta para o cliente sobre o serviço solicitado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resumo do Pedido */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-900">Resumo do Pedido</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-gray-600">Cliente:</span>{" "}
                <span className="font-medium">{quote.motorist?.profiles?.name || "N/A"}</span>
              </p>
              <p>
                <span className="text-gray-600">Serviço:</span>{" "}
                <span className="font-medium">{quote.service_type}</span>
              </p>
              {quote.vehicle && (
                <p>
                  <span className="text-gray-600">Veículo:</span>{" "}
                  <span className="font-medium">
                    {quote.vehicle.make} {quote.vehicle.model} ({quote.vehicle.year})
                  </span>
                </p>
              )}
              <p>
                <span className="text-gray-600">Descrição:</span>{" "}
                <span className="font-medium">{quote.description}</span>
              </p>
            </div>
          </div>

          {/* Tipo de Resposta */}
          <div>
            <Label className="mb-3 block">Tipo de Resposta *</Label>
            <RadioGroup
              value={responseType}
              onValueChange={(value: "accept" | "reject") => setResponseType(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="accept" id="accept" />
                <Label
                  htmlFor="accept"
                  className="font-normal cursor-pointer flex items-center gap-2 flex-1 p-4 border rounded-lg hover:bg-green-50"
                >
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Aceitar e Orçar</p>
                    <p className="text-xs text-gray-500">Enviar orçamento para o cliente</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <RadioGroupItem value="reject" id="reject" />
                <Label
                  htmlFor="reject"
                  className="font-normal cursor-pointer flex items-center gap-2 flex-1 p-4 border rounded-lg hover:bg-red-50"
                >
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold">Recusar</p>
                    <p className="text-xs text-gray-500">Não pode realizar o serviço</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Valor Estimado (apenas se aceitar) */}
          {responseType === "accept" && (
            <div>
              <Label htmlFor="estimated_price">Valor Estimado (R$) *</Label>
              <Input
                id="estimated_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 350.00"
                value={formData.estimated_price}
                onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Informe o valor estimado para o serviço solicitado.
              </p>
            </div>
          )}

          {/* Mensagem */}
          <div>
            <Label htmlFor="workshop_response">
              {responseType === "accept" ? "Mensagem para o Cliente *" : "Motivo da Recusa *"}
            </Label>
            <Textarea
              id="workshop_response"
              placeholder={
                responseType === "accept"
                  ? "Descreva o que será feito, prazo estimado, garantias, etc..."
                  : "Explique o motivo da recusa de forma educada..."
              }
              value={formData.workshop_response}
              onChange={(e) => setFormData({ ...formData, workshop_response: e.target.value })}
              required
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {responseType === "accept"
                ? "Seja detalhado e profissional. Isso ajuda o cliente a tomar uma decisão."
                : "Seja educado e, se possível, sugira alternativas."}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={
                responseType === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {responseType === "accept" ? "Enviar Orçamento" : "Enviar Recusa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

