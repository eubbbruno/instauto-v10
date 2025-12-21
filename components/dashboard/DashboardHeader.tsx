"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DashboardHeader() {
  const { profile } = useAuth();
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 mb-8">
      <div className="flex items-center justify-between">
        {/* Data e Saudação */}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600 capitalize">{today}</p>
            <p className="text-xs text-gray-500">Olá, {profile?.name?.split(' ')[0] || 'Usuário'}!</p>
          </div>
        </div>

        {/* Notificações */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </div>
  );
}

