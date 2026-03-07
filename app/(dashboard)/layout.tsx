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
  const [pendingQuotes, setPendingQuotes] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;
      
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

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

        if (!workshopData) {
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
            setWorkshop(newWorkshop);
          }
        } else {
          setWorkshop(workshopData);
        }

        if (profileData) {
          const { data: notifications } = await supabase
            .from("notifications")
            .select("id")
            .eq("user_id", profileData.id)
            .eq("is_read", false);
          
          setUnreadCount(notifications?.length || 0);
        }

        // Buscar orçamentos pendentes
        if (workshopData?.id) {
          console.log("🔔 [Layout Oficina] Buscando orçamentos pendentes para workshop:", workshopData.id);
          const { data: quotesData, count, error: quotesError } = await supabase
            .from("quotes")
            .select("*", { count: "exact" })
            .eq("workshop_id", workshopData.id)
            .eq("status", "pending");
          
          console.log("🔔 [Layout Oficina] Orçamentos pendentes:", count || 0);
          console.log("🔔 [Layout Oficina] Erro:", quotesError);
          if (quotesData && quotesData.length > 0) {
            console.log("🔔 [Layout Oficina] Primeiro orçamento:", JSON.stringify(quotesData[0], null, 2));
          }
          
          setPendingQuotes(count || 0);
        }

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, authLoading, router, supabase]);

  // Loading
  if (authLoading || dataLoading) {
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
    return null;
  }


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
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <Link href="/oficina">
            <Image 
              src="/images/logo-of-dark.svg" 
              alt="Instauto" 
              width={140} 
              height={40}
              className="h-8 sm:h-10 w-auto"
            />
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/oficina/orcamentos" && pendingQuotes > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium flex-1">{item.label}</span>
                {showBadge && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {pendingQuotes > 9 ? "9+" : pendingQuotes}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 sm:p-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gray-50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {workshop?.name?.charAt(0) || "O"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">{workshop?.name || "Oficina"}</p>
              <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
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
            className="w-full mt-2 sm:mt-3 flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
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
