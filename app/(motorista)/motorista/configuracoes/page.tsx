"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings, User, Bell, Lock, LogOut, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ConfiguracoesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [motoristData, setMotoristData] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    email_quotes: true,
    email_promotions: true,
    email_reminders: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-motorista");
      return;
    }

    if (profile?.id) {
      loadMotoristData();
    }
  }, [user, authLoading, profile, router]);

  const loadMotoristData = async () => {
    try {
      setLoading(true);

      // Carregar dados do motorista
      const { data: motorist, error } = await supabase
        .from("motorists")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;

      setMotoristData(motorist);

      // Preencher forms
      setProfileForm({
        name: profile?.name || "",
        phone: motorist?.phone || "",
      });

      // Carregar preferências de notificação (se existir coluna)
      // Por enquanto, usar valores padrão
      setNotificationPrefs({
        email_quotes: true,
        email_promotions: true,
        email_reminders: true,
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar suas configurações.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nome é obrigatório.",
      });
      return;
    }

    setSaving(true);
    try {
      // Atualizar profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: profileForm.name.trim() })
        .eq("id", profile?.id);

      if (profileError) throw profileError;

      // Atualizar motorist
      const { error: motoristError } = await supabase
        .from("motorists")
        .update({ phone: profileForm.phone.trim() || null })
        .eq("profile_id", profile?.id);

      if (motoristError) throw motoristError;

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });

      // Recarregar dados
      loadMotoristData();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter no mínimo 6 caracteres.",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso.",
      });

      setPasswordForm({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível alterar a senha.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login-motorista");
  };

  const handleDeleteAccount = async () => {
    setSaving(true);
    try {
      // Soft delete: desativar veículos
      await supabase
        .from("motorist_vehicles")
        .update({ is_active: false })
        .eq("motorist_id", motoristData?.id);

      // Deletar profile (cascade irá deletar motorist)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso.",
      });

      await supabase.auth.signOut();
      router.push("/");
    } catch (error: any) {
      console.error("Erro ao excluir conta:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a conta.",
      });
    } finally {
      setSaving(false);
      setShowDeleteDialog(false);
    }
  };

  if (authLoading || loading) {
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
          {/* PERFIL */}
          <Card className="border-2 border-gray-200 hover:shadow-xl hover:border-gray-400 transition-all duration-300">
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
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">O email não pode ser alterado</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="w-full bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 font-bold shadow-lg" 
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Perfil
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* NOTIFICAÇÕES */}
          <Card className="border-2 border-blue-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
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
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Orçamentos por Email</p>
                  <p className="text-sm text-gray-600">Receba notificações de respostas de orçamentos</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_quotes}
                  onCheckedChange={(checked) => 
                    setNotificationPrefs({ ...notificationPrefs, email_quotes: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Promoções por Email</p>
                  <p className="text-sm text-gray-600">Receba ofertas e promoções especiais</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_promotions}
                  onCheckedChange={(checked) => 
                    setNotificationPrefs({ ...notificationPrefs, email_promotions: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Lembretes</p>
                  <p className="text-sm text-gray-600">Receba lembretes de manutenção e vencimentos</p>
                </div>
                <Switch
                  checked={notificationPrefs.email_reminders}
                  onCheckedChange={(checked) => 
                    setNotificationPrefs({ ...notificationPrefs, email_reminders: checked })
                  }
                />
              </div>

              <p className="text-xs text-gray-500 text-center pt-2">
                As preferências de notificação serão salvas automaticamente
              </p>
            </CardContent>
          </Card>

          {/* SEGURANÇA */}
          <Card className="border-2 border-purple-200 hover:shadow-xl hover:border-purple-400 transition-all duration-300">
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
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Digite novamente"
                />
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 font-bold shadow-lg" 
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AÇÕES DA CONTA */}
          <Card className="border-2 border-red-200 hover:shadow-xl hover:border-red-400 transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                  <LogOut className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ações da Conta</CardTitle>
                  <CardDescription>Sair ou excluir sua conta</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full border-2 border-gray-300 hover:bg-gray-100 font-bold" 
                size="lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
              </Button>

              <Button 
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive" 
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-bold shadow-lg" 
                size="lg"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta
              e remover todos os seus dados dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Sim, excluir conta"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
