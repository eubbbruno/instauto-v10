"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Bell, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function DashboardStats() {
  const { profile } = useAuth();
  const router = useRouter();
  const [pendingQuotes, setPendingQuotes] = useState(0);
  const supabase = createClient();
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  useEffect(() => {
    if (profile && profile.type === "oficina") {
      loadPendingQuotes();
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(loadPendingQuotes, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadPendingQuotes = async () => {
    if (!profile) return;

    try {
      // Buscar oficina
      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", profile.id)
        .single();

      if (!workshop) return;

      // Contar orçamentos pendentes
      const { count } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)
        .eq("status", "pending");

      setPendingQuotes(count || 0);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Data e Saudação */}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 capitalize">{today}</p>
            <p className="text-xs text-gray-500">Olá, {profile?.name?.split(' ')[0] || 'Usuário'}!</p>
          </div>
        </div>

        {/* Notificações */}
        <div className="flex items-center gap-2">
          {profile?.type === "oficina" && pendingQuotes > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="relative border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-900"
              onClick={() => router.push("/oficina/orcamentos")}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Novos Orçamentos</span>
              <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                {pendingQuotes}
              </Badge>
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => {
              if (profile?.type === "oficina") {
                router.push("/oficina/orcamentos");
              }
            }}
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {pendingQuotes > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

