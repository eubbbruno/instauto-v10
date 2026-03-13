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
  Stethoscope, ChevronRight
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

      {/* Sidebar Premium Dark - Estilo Linear/Raycast */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0F] border-r border-white/5
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <Link href="/oficina" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Instauto</span>
          </Link>
        </div>

        {/* Navigation - Estilo Linear */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/oficina/orcamentos" && pendingQuotes > 0;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                  ${isActive 
                    ? "bg-white/5 text-white" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-blue-400" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                    {pendingQuotes}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card - Estilo Linear */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold">
              {workshop?.name?.charAt(0) || "O"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{workshop?.name || "Oficina"}</p>
              <p className="text-xs text-gray-500 truncate">
                {workshop?.plan_type === "pro" ? "Plano Pro" : "Plano Free"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
          </div>
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
