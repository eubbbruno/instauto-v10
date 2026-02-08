"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, User, Bell, Lock, CreditCard, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-motorista");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/30 to-gray-100/20 flex items-center justify-center pt-16">
        <Card className="border-2 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-16 w-16 animate-spin text-gray-600 mb-4" />
            <p className="text-gray-600 font-medium">Carregando configurações...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50/30 to-gray-100/20 pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-4">
        {/* Header Premium */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-600 via-slate-600 to-gray-800 bg-clip-text text-transparent leading-tight mb-3">
            Configurações ⚙️
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie suas preferências e informações da conta
          </p>
        </div>

        {/* Cards de Configurações */}
        <div className="space-y-6">
          <Card className="border-2 border-gray-200 hover:shadow-xl hover:border-gray-400 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Nome:</span>
                  <span className="font-bold text-gray-900">{profile?.name || "Não informado"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="font-bold text-gray-900">{user.email}</span>
                </div>
              </div>
              <Button className="mt-6 w-full bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 font-bold shadow-lg" size="lg">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notificações</CardTitle>
                  <CardDescription>Gerencie suas preferências de notificação</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 font-bold shadow-lg" size="lg">
                Configurar Notificações
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-purple-50 via-violet-50 to-purple-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Segurança</CardTitle>
                  <CardDescription>Altere sua senha e configurações de segurança</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 font-bold shadow-lg" size="lg">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 hover:shadow-xl hover:border-red-400 transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Sair da Conta</CardTitle>
                  <CardDescription>Desconecte-se do aplicativo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Button variant="destructive" className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold shadow-lg" size="lg">
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
