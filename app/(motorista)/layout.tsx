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
          const { data: notifications } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", profileData.id)
            .eq("is_read", false);
          
          setUnreadCount(notifications?.length || 0);
          console.log("🔔 [Layout Motorista] Notificações não lidas:", notifications?.length || 0);
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

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-50 via-white to-blue-50/50 
        border-r border-blue-100 transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/motorista">
            <Image 
              src="/images/logo-of-dark.svg" 
              alt="Instauto" 
              width={140} 
              height={40}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{user?.email?.split('@')[0]}</p>
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Motorista</span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
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
