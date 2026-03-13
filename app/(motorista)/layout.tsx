"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { TopBar } from "@/components/layout/TopBar";
import {
  LayoutDashboard, Car, FileText, Clock, Search, Menu,
  Fuel, DollarSign, Bell, Gift, Settings, LogOut, Loader2
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  type: string;
}

interface Motorist {
  id: string;
  profile_id: string;
}

const menuItems = [
  { href: "/motorista", label: "Dashboard", icon: LayoutDashboard },
  { href: "/motorista/garagem", label: "Minha Garagem", icon: Car },
  { href: "/motorista/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/motorista/abastecimento", label: "Abastecimento", icon: Fuel },
  { href: "/motorista/despesas", label: "Despesas", icon: DollarSign },
  { href: "/motorista/lembretes", label: "Lembretes", icon: Bell },
  { href: "/motorista/historico", label: "Histórico", icon: Clock },
  { href: "/motorista/oficinas", label: "Buscar Oficinas", icon: Search },
  { href: "/motorista/promocoes", label: "Promoções", icon: Gift },
  { href: "/motorista/configuracoes", label: "Configurações", icon: Settings },
];

export default function MotoristaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [motorist, setMotorist] = useState<Motorist | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingResponses, setPendingResponses] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      console.log("🚗 [Layout Motorista] Iniciando loadData...");
      console.log("🚗 [Layout Motorista] authLoading:", authLoading);
      console.log("🚗 [Layout Motorista] user:", user?.email);
      
      // Se auth ainda carregando, esperar
      if (authLoading) {
        console.log("🚗 [Layout Motorista] Auth ainda carregando, aguardando...");
        return;
      }
      
      // Se não tem user, redirecionar
      if (!user) {
        console.log("🚗 [Layout Motorista] Sem user, redirecionando para /login");
        router.push("/login");
        return;
      }

      try {
        console.log("🚗 [Layout Motorista] Carregando profile...");
        // Carregar profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("🚗 [Layout Motorista] Profile result:", { profileData, profileError });

        if (!profileData) {
          console.log("❌ Profile não encontrado, criando...");
          // Criar profile se não existir
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split("@")[0],
              type: "motorist"
            })
            .select()
            .single();
          
          if (newProfile) {
            console.log("✅ Profile criado:", newProfile);
            setProfile(newProfile);
          }
        } else {
          console.log("✅ Profile encontrado:", profileData.type);
          setProfile(profileData);
          
          // Verificar se é motorist
          if (profileData.type !== "motorist") {
            console.log("⚠️ Tipo não é motorist, redirecionando...");
            router.push("/oficina");
            return;
          }
        }

        console.log("🚗 [Layout Motorista] Carregando motorist...");
        // Carregar motorist
        const { data: motoristData, error: motoristError } = await supabase
          .from("motorists")
          .select("*")
          .eq("profile_id", user.id)
          .single();

        console.log("🚗 [Layout Motorista] Motorist result:", { motoristData, motoristError });

        if (!motoristData) {
          console.log("❌ Motorist não encontrado, criando...");
          // Criar motorist se não existir
          const { data: newMotorist } = await supabase
            .from("motorists")
            .insert({
              profile_id: user.id,
            })
            .select()
            .single();
          
          if (newMotorist) {
            console.log("✅ Motorist criado:", newMotorist);
            setMotorist(newMotorist);
          }
        } else {
          console.log("✅ Motorist encontrado");
          setMotorist(motoristData);
        }

        // Buscar notificações não lidas
        if (profileData) {
          console.log("🔔 [Layout Motorista] Buscando notificações para profile:", profileData.id);
          const { data: notifications, error: notifError } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", profileData.id)
            .eq("is_read", false);
          
          console.log("🔔 [Layout Motorista] Notificações encontradas:", notifications?.length || 0);
          console.log("🔔 [Layout Motorista] Erro:", notifError);
          if (notifications && notifications.length > 0) {
            console.log("🔔 [Layout Motorista] Primeira notificação:", JSON.stringify(notifications[0], null, 2));
          }
          
          setUnreadCount(notifications?.length || 0);
        }

        // Buscar orçamentos com resposta (respondido ou rejeitado)
        if (profileData?.email) {
          console.log("🔔 [Layout Motorista] Buscando orçamentos para email:", profileData.email);
          const { data: quotesData, count, error: quotesError } = await supabase
            .from("quotes")
            .select("*", { count: "exact" })
            .eq("motorist_email", profileData.email)
            .in("status", ["responded", "rejected"]);
          
          console.log("🔔 [Layout Motorista] Orçamentos respondidos:", count || 0);
          console.log("🔔 [Layout Motorista] Erro:", quotesError);
          if (quotesData && quotesData.length > 0) {
            console.log("🔔 [Layout Motorista] Primeiro orçamento:", JSON.stringify(quotesData[0], null, 2));
          }
          
          setPendingResponses(count || 0);
        }

      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
      } finally {
        console.log("✅ Finalizando loadData");
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, router, supabase]);

  // Loading
  if (authLoading || dataLoading) {
    console.log("🚗 [Layout Motorista] Mostrando loading...", { authLoading, dataLoading });
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Sem user
  if (!user) {
    console.log("🚗 [Layout Motorista] Sem user após loading");
    return null;
  }

  console.log("🚗 [Layout Motorista] Renderizando layout completo");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Premium */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
        border-r border-gray-700/50 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo Premium */}
        <div className="p-5 border-b border-gray-700/50">
          <Link href="/motorista" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-blue-400">Inst</span>
              <span className="text-2xl font-bold text-white">auto</span>
            </div>
          </Link>
        </div>

        {/* Menu Premium */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Seção Principal */}
          <div className="px-4 py-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Principal
            </span>
          </div>
          
          {menuItems.slice(0, 3).map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/motorista/orcamentos" && pendingResponses > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease-out
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {showBadge && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
                    {pendingResponses}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Seção Controle */}
          <div className="px-4 py-2 mt-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Controle
            </span>
          </div>
          
          {menuItems.slice(3, 8).map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease-out
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
              </Link>
            );
          })}

          {/* Seção Outros */}
          <div className="px-4 py-2 mt-4">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Outros
            </span>
          </div>
          
          {menuItems.slice(8).map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease-out
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-600/20 to-transparent text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Premium */}
        <div className="p-4 mx-3 mb-3 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
              {profile?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{profile?.name || user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
            </div>
            <button 
              onClick={signOut}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Sair"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* TopBar */}
        <TopBar
          user={user}
          userType="motorist"
          userName={profile?.name || undefined}
          onMenuClick={() => setSidebarOpen(true)}
          onSignOut={signOut}
        />

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
