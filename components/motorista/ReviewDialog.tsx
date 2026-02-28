"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/StarRating";
import { Loader2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshopId: string;
  workshopName: string;
  motoristId: string;
  quoteId?: string;
  onSuccess: () => void;
}

export function ReviewDialog({ 
  open, 
  onOpenChange, 
  workshopId, 
  workshopName,
  motoristId,
  quoteId,
  onSuccess 
}: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("⭐ [Avaliação] Enviando avaliação...");
      console.log("⭐ [Avaliação] Workshop ID:", workshopId);
      console.log("⭐ [Avaliação] Motorist ID:", motoristId);
      console.log("⭐ [Avaliação] Rating:", rating);

      // 1. Inserir avaliação
      const { error: reviewError } = await supabase
        .from("reviews")
        .insert({
          workshop_id: workshopId,
          motorist_id: motoristId,
          quote_id: quoteId || null,
          rating: rating,
          comment: comment.trim() || null,
        });

      if (reviewError) throw reviewError;

      console.log("✅ [Avaliação] Avaliação criada");

      // 2. Recalcular média da oficina
      const { data: allReviews, error: fetchError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("workshop_id", workshopId);

      if (fetchError) throw fetchError;

      if (allReviews && allReviews.length > 0) {
        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
        
        console.log("📊 [Avaliação] Nova média:", avgRating.toFixed(1));

        // 3. Atualizar oficina com nova média
        const { error: updateError } = await supabase
          .from("workshops")
          .update({ 
            rating: parseFloat(avgRating.toFixed(1)),
            reviews_count: allReviews.length 
          })
          .eq("id", workshopId);

        if (updateError) throw updateError;

        console.log("✅ [Avaliação] Média atualizada na oficina");
      }

      // 4. Criar notificação para a oficina
      const { data: workshop } = await supabase
        .from("workshops")
        .select("profile_id")
        .eq("id", workshopId)
        .single();

      if (workshop) {
        await supabase.from("notifications").insert({
          user_id: workshop.profile_id,
          type: "review_received",
          title: "Nova avaliação recebida! ⭐",
          message: `Você recebeu uma avaliação de ${rating} estrela${rating > 1 ? "s" : ""}`,
          is_read: false,
          data: {
            rating: rating,
            workshop_id: workshopId,
          },
        });

        console.log("✅ [Avaliação] Notificação criada para oficina");
      }

      toast({
        title: "Avaliação enviada!",
        description: "Obrigado pelo seu feedback!",
      });

      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setRating(0);
      setComment("");
    } catch (error: any) {
      console.error("❌ [Avaliação] Erro:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar a avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {workshopName}</DialogTitle>
          <DialogDescription>
            Como foi sua experiência com esta oficina?
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Estrelas */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-4">Selecione sua nota:</p>
            <div className="flex justify-center">
              <StarRating
                rating={rating}
                size="lg"
                interactive={true}
                onChange={setRating}
              />
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium text-gray-700 mt-3">
                {rating === 1 && "😞 Muito insatisfeito"}
                {rating === 2 && "😕 Insatisfeito"}
                {rating === 3 && "😐 Regular"}
                {rating === 4 && "😊 Satisfeito"}
                {rating === 5 && "🤩 Muito satisfeito"}
              </p>
            )}
          </div>

          {/* Comentário */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Conte como foi o atendimento (opcional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="O que você achou do serviço? Como foi o atendimento? Recomenda?"
              rows={4}
              className="resize-none"
              disabled={loading}
            />
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
              disabled={loading || rating === 0}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Star className="mr-2 h-4 w-4" />
              Enviar Avaliação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
