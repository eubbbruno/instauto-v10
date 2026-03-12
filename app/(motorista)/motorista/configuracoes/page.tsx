"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Settings, User, Bell, Lock, LogOut, Loader2, Save, Trash2, Camera, Sparkles } from "lucide-react";
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      router.push("/login");
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
      setAvatarUrl(profile?.avatar_url || null);

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
    router.push("/login");
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione uma imagem",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Imagem deve ter no máximo 5MB",
      });
      return;
    }

    setUploading(true);

    try {
      // Nome único para o arquivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${profile?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      // Atualizar profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      setAvatarUrl(urlData.publicUrl);
      toast({
        title: "Sucesso",
        description: "Foto atualizada com sucesso!",
      });

    } catch (error) {
      console.error("Erro no upload:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar foto",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profile?.id);
      
      setAvatarUrl(null);
      toast({
        title: "Sucesso",
        description: "Foto removida",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao remover foto",
      });
    }
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4 sm:p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header padrão */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-gray-500 mb-1">Dashboard / Configurações</p>
          <h1 className="text-base sm:text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Configurações</h1>
        </div>

        {/* Foto de Perfil */}
        <Card className="border-2 border-gray-200 hover:shadow-xl hover:border-gray-400 transition-all duration-300 mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-blue-50/50 to-blue-50/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Foto de Perfil</CardTitle>
                <CardDescription>Personalize seu perfil com uma foto</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar atual ou placeholder */}
              <div className="relative flex-shrink-0">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Input hidden */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-gray-600 mb-3">
                  Adicione uma foto para personalizar seu perfil
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Enviando..." : "Escolher foto"}
                  </button>
                  {avatarUrl && (
                    <button 
                      onClick={handleRemoveAvatar}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG até 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assistente de Perfil com IA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg sm:text-xl">Assistente Pessoal com IA</h3>
              <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-medium mt-1">
                Em breve
              </span>
            </div>
          </div>
          <p className="text-white/90 text-sm sm:text-base mb-4 leading-relaxed">
            Nossa IA vai ajudar você a gerenciar melhor seus veículos, receber lembretes personalizados 
            de manutenção e encontrar as melhores oficinas para cada tipo de serviço.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">🚗 Manutenção inteligente</p>
              <p className="text-xs text-white/70">Lembretes personalizados</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">💰 Economia</p>
              <p className="text-xs text-white/70">Melhores preços</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">🔍 Diagnóstico</p>
              <p className="text-xs text-white/70">IA analisa problemas</p>
            </div>
          </div>
          <button 
            disabled
            className="w-full sm:w-auto px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-semibold cursor-not-allowed hover:bg-white/25 transition-colors"
          >
            🔒 Disponível em breve
          </button>
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
                  <CardTitle className="text-base sm:text-lg">Perfil</CardTitle>
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
                  <CardTitle className="text-base sm:text-lg">Notificações</CardTitle>
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
                  <CardTitle className="text-base sm:text-lg">Segurança</CardTitle>
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
                  <CardTitle className="text-base sm:text-lg">Ações da Conta</CardTitle>
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
