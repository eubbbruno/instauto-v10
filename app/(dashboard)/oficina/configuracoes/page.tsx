"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Profile, Workshop } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User, Building2 } from "lucide-react";

const ESTADOS_BRASILEIROS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export default function ConfiguracoesPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingWorkshop, setSavingWorkshop] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    avatar_url: "",
  });

  const [workshopData, setWorkshopData] = useState({
    name: "",
    cnpj: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar dados do perfil
      setProfileData({
        name: profile?.name || "",
        phone: profile?.phone || "",
        avatar_url: profile?.avatar_url || "",
      });

      // Carregar dados da oficina
      const { data: workshopData, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;

      setWorkshop(workshopData);
      setWorkshopData({
        name: workshopData.name || "",
        cnpj: workshopData.cnpj || "",
        phone: workshopData.phone || "",
        email: workshopData.email || "",
        address: workshopData.address || "",
        city: workshopData.city || "",
        state: workshopData.state || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profileData.name,
          phone: profileData.phone || null,
          avatar_url: profileData.avatar_url || null,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Seus dados foram atualizados.",
      });

      // Recarregar dados
      await loadData();
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar seus dados.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWorkshop(true);

    try {
      const { error } = await supabase
        .from("workshops")
        .update({
          name: workshopData.name,
          cnpj: workshopData.cnpj || null,
          phone: workshopData.phone || null,
          email: workshopData.email || null,
          address: workshopData.address || null,
          city: workshopData.city || null,
          state: workshopData.state || null,
        })
        .eq("id", workshop?.id);

      if (error) throw error;

      toast({
        variant: "success",
        title: "Sucesso!",
        description: "Dados da oficina atualizados.",
      });

      // Recarregar dados
      await loadData();
    } catch (error: any) {
      console.error("Erro ao salvar oficina:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Não foi possível salvar os dados da oficina.",
      });
    } finally {
      setSavingWorkshop(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">
          Gerencie seus dados pessoais e da oficina
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meus Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Meus Dados
            </CardTitle>
            <CardDescription>
              Informações do seu perfil de usuário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nome *</Label>
                <Input
                  id="profile-name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  required
                  disabled={savingProfile}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Telefone</Label>
                <Input
                  id="profile-phone"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  disabled={savingProfile}
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">
                  O email não pode ser alterado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-avatar">URL do Avatar</Label>
                <Input
                  id="profile-avatar"
                  value={profileData.avatar_url}
                  onChange={(e) =>
                    setProfileData({ ...profileData, avatar_url: e.target.value })
                  }
                  disabled={savingProfile}
                  placeholder="https://exemplo.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500">
                  URL da imagem do seu avatar (opcional)
                </p>
              </div>

              <Button type="submit" disabled={savingProfile} className="w-full">
                {savingProfile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Meus Dados"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Dados da Oficina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Oficina
            </CardTitle>
            <CardDescription>
              Informações da sua oficina mecânica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveWorkshop} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workshop-name">Nome da Oficina *</Label>
                <Input
                  id="workshop-name"
                  value={workshopData.name}
                  onChange={(e) =>
                    setWorkshopData({ ...workshopData, name: e.target.value })
                  }
                  required
                  disabled={savingWorkshop}
                  placeholder="Oficina do João"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshop-cnpj">CNPJ</Label>
                <Input
                  id="workshop-cnpj"
                  value={workshopData.cnpj}
                  onChange={(e) =>
                    setWorkshopData({ ...workshopData, cnpj: e.target.value })
                  }
                  disabled={savingWorkshop}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-phone">Telefone</Label>
                  <Input
                    id="workshop-phone"
                    value={workshopData.phone}
                    onChange={(e) =>
                      setWorkshopData({ ...workshopData, phone: e.target.value })
                    }
                    disabled={savingWorkshop}
                    placeholder="(11) 3456-7890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workshop-email">Email</Label>
                  <Input
                    id="workshop-email"
                    type="email"
                    value={workshopData.email}
                    onChange={(e) =>
                      setWorkshopData({ ...workshopData, email: e.target.value })
                    }
                    disabled={savingWorkshop}
                    placeholder="contato@oficina.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workshop-address">Endereço</Label>
                <Input
                  id="workshop-address"
                  value={workshopData.address}
                  onChange={(e) =>
                    setWorkshopData({ ...workshopData, address: e.target.value })
                  }
                  disabled={savingWorkshop}
                  placeholder="Rua Exemplo, 123 - Bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workshop-city">Cidade</Label>
                  <Input
                    id="workshop-city"
                    value={workshopData.city}
                    onChange={(e) =>
                      setWorkshopData({ ...workshopData, city: e.target.value })
                    }
                    disabled={savingWorkshop}
                    placeholder="São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workshop-state">Estado</Label>
                  <select
                    id="workshop-state"
                    value={workshopData.state}
                    onChange={(e) =>
                      setWorkshopData({ ...workshopData, state: e.target.value })
                    }
                    disabled={savingWorkshop}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione</option>
                    {ESTADOS_BRASILEIROS.map((estado) => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" disabled={savingWorkshop} className="w-full">
                {savingWorkshop ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Dados da Oficina"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Plano */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
          <CardDescription>
            Informações sobre seu plano de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {workshop?.plan_type === "pro" ? "PRO" : "FREE"}
              </p>
              {workshop?.plan_type === "free" && workshop?.trial_ends_at && (
                <p className="text-sm text-gray-600 mt-1">
                  Trial termina em:{" "}
                  {new Date(workshop.trial_ends_at).toLocaleDateString("pt-BR")}
                </p>
              )}
              {workshop?.plan_type === "pro" && (
                <p className="text-sm text-gray-600 mt-1">
                  Plano ativo e renovação automática
                </p>
              )}
            </div>
            <Button
              onClick={() => (window.location.href = "/oficina/planos")}
              variant={workshop?.plan_type === "free" ? "default" : "outline"}
            >
              {workshop?.plan_type === "free" ? "Fazer Upgrade" : "Ver Planos"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

