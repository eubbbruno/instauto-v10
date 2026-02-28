"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { TopBar } from "@/components/layout/TopBar";
import {
  LayoutDashboard, Users, Car, FileText, Package, DollarSign,
  Calendar, MessageSquare, Settings, CreditCard, Wrench, Menu,
  X, LogOut, Bell, ChevronDown, Loader2, ClipboardList, Receipt,
  Stethoscope
} from "lucide-react";

interface Profile {
  id: string;
  email: string;
  name: string | null;
  type: string;
}

interface Workshop {
  id: string;
  name: string;
  plan_type: string;
  city?: string;
  state?: string;
}

const menuItems = [
  { href: "/oficina", label: "Dashboard", icon: LayoutDashboard },
  { href: "/oficina/clientes", label: "Clientes", icon: Users },
  { href: "/oficina/veiculos", label: "Veículos", icon: Car },
  { href: "/oficina/ordens", label: "Ordens de Serviço", icon: ClipboardList },
  { href: "/oficina/orcamentos", label: "Orçamentos", icon: Receipt },
  { href: "/oficina/estoque", label: "Estoque", icon: Package },
  { href: "/oficina/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/oficina/agenda", label: "Agenda", icon: Calendar },
  { href: "/oficina/diagnostico", label: "Diagnóstico IA", icon: Stethoscope },
  { href: "/oficina/relatorios", label: "Relatórios", icon: FileText },
  { href: "/oficina/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/oficina/configuracoes", label: "Configurações", icon: Settings },
  { href: "/oficina/planos", label: "Planos", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      console.log("🏠 [Layout] Iniciando loadData...");
      console.log("🏠 [Layout] authLoading:", authLoading);
      console.log("🏠 [Layout] user:", user?.email);
      
      // Se auth ainda carregando, esperar
      if (authLoading) {
        console.log("🏠 [Layout] Auth ainda carregando, aguardando...");
        return;
      }
      
      // Se não tem user, redirecionar
      if (!user) {
        console.log("🏠 [Layout] Sem user, redirecionando para /login");
        router.push("/login");
        return;
      }

      try {
        console.log("🏠 [Layout] Carregando profile...");
        // Carregar profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        console.log("🏠 [Layout] Profile result:", { profileData, profileError });

        if (!profileData) {
          console.log("❌ Profile não encontrado, criando...");
          // Criar profile se não existir
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.email?.split("@")[0],
              type: "workshop"
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
          
          // Verificar se é workshop
          if (profileData.type !== "workshop") {
            console.log("⚠️ Tipo não é workshop, redirecionando...");
            router.push("/motorista");
            return;
          }
        }

        console.log("🏠 [Layout] Carregando workshop...");
        // Carregar workshop
        const { data: workshopData, error: workshopError } = await supabase
          .from("workshops")
          .select("*")
          .eq("profile_id", user.id)
          .single();

        console.log("🏠 [Layout] Workshop result:", { workshopData, workshopError });

        if (!workshopData) {
          console.log("❌ Workshop não encontrado, criando...");
          // Criar workshop se não existir
          const { data: newWorkshop } = await supabase
            .from("workshops")
            .insert({
              profile_id: user.id,
              name: user.user_metadata?.full_name || "Minha Oficina",
              plan_type: "free",
              is_public: true,
              accepts_quotes: true
            })
            .select()
            .single();
          
          if (newWorkshop) {
            console.log("✅ Workshop criado:", newWorkshop);
            setWorkshop(newWorkshop);
          }
        } else {
          console.log("✅ Workshop encontrado:", workshopData.name);
          setWorkshop(workshopData);
        }

        // Buscar notificações não lidas
        if (profileData) {
          const { data: notifications } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", profileData.id)
            .eq("is_read", false);
          
          setUnreadCount(notifications?.length || 0);
          console.log("🔔 [Layout] Notificações não lidas:", notifications?.length || 0);
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
    console.log("🏠 [Layout] Mostrando loading...", { authLoading, dataLoading });
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
    console.log("🏠 [Layout] Sem user após loading");
    return null;
  }

  console.log("🏠 [Layout] Renderizando layout completo");

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
          <Link href="/oficina">
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
              {workshop?.name?.charAt(0) || "O"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">{workshop?.name || "Oficina"}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                workshop?.plan_type === "pro" 
                  ? "bg-yellow-100 text-yellow-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {workshop?.plan_type === "pro" ? "PRO" : "FREE"}
              </span>
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
          userType="workshop"
          userName={workshop?.name}
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
