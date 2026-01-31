"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ClipboardList, 
  Calendar, 
  Package, 
  DollarSign, 
  FileText, 
  Settings, 
  Crown, 
  LogOut, 
  Loader2,
  Menu,
  X,
  Stethoscope,
  MessageSquare,
  Receipt
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  pro: boolean;
}

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/oficina", icon: <LayoutDashboard className="h-5 w-5" />, pro: false },
  { name: "Clientes", href: "/oficina/clientes", icon: <Users className="h-5 w-5" />, pro: true },
  { name: "Veículos", href: "/oficina/veiculos", icon: <Car className="h-5 w-5" />, pro: true },
  { name: "Ordens de Serviço", href: "/oficina/ordens", icon: <ClipboardList className="h-5 w-5" />, pro: true },
  { name: "Orçamentos", href: "/oficina/orcamentos", icon: <Receipt className="h-5 w-5" />, pro: true },
  { name: "Agenda", href: "/oficina/agenda", icon: <Calendar className="h-5 w-5" />, pro: true },
  { name: "Estoque", href: "/oficina/estoque", icon: <Package className="h-5 w-5" />, pro: true },
  { name: "Financeiro", href: "/oficina/financeiro", icon: <DollarSign className="h-5 w-5" />, pro: true },
  { name: "Diagnóstico IA", href: "/oficina/diagnostico", icon: <Stethoscope className="h-5 w-5" />, pro: true },
  { name: "Relatórios", href: "/oficina/relatorios", icon: <FileText className="h-5 w-5" />, pro: true },
  { name: "WhatsApp", href: "/oficina/whatsapp", icon: <MessageSquare className="h-5 w-5" />, pro: true },
  { name: "Configurações", href: "/oficina/configuracoes", icon: <Settings className="h-5 w-5" />, pro: false },
  { name: "Planos", href: "/oficina/planos", icon: <Crown className="h-5 w-5" />, pro: false },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login-oficina");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile?.id) {
      loadWorkshop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const loadWorkshop = async () => {
    try {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", profile?.id)
        .single();

      if (error) throw error;
      setWorkshop(data);
    } catch (error) {
      console.error("Erro ao carregar oficina:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isPro = workshop?.plan_type === "pro" && workshop?.subscription_status === "active";
  const isTrialActive = workshop?.trial_ends_at && new Date(workshop.trial_ends_at) > new Date();
  const hasProAccess = isPro || isTrialActive;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">Instauto</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-blue-700">
            <Link href="/oficina" className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-700 rounded-lg">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">Instauto</span>
                <p className="text-[10px] text-blue-200 mt-0.5 truncate max-w-[150px]">
                  {workshop?.name || profile.name}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const needsPro = item.pro && !hasProAccess;

              // Se precisa PRO e não tem acesso, redireciona para planos
              if (needsPro) {
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      setSidebarOpen(false);
                      router.push("/oficina/planos");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm text-blue-200/50 hover:bg-blue-700/30 hover:text-blue-100 cursor-not-allowed opacity-60"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-yellow-400 text-blue-900 rounded-full">
                      PRO
                    </span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm ${
                    isActive
                      ? "bg-blue-700 text-white shadow-lg"
                      : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Plan Badge */}
          <div className="p-3 border-t border-blue-700">
            {isPro ? (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-2 mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-blue-900" />
                  <div>
                    <p className="text-xs font-bold text-blue-900">Plano PRO</p>
                    <p className="text-[10px] text-blue-800">Assinatura ativa</p>
                  </div>
                </div>
              </div>
            ) : isTrialActive ? (
              <div className="bg-blue-500 rounded-lg p-2 mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-white" />
                  <div>
                    <p className="text-xs font-bold text-white">Trial PRO</p>
                    <p className="text-[10px] text-blue-100">
                      {Math.ceil(
                        (new Date(workshop?.trial_ends_at || "").getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      dias
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-700 rounded-lg p-2 mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-blue-300" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">Plano FREE</p>
                    <p className="text-[10px] text-blue-300">Limitado</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/oficina/planos")}
                  className="w-full mt-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 hover:from-yellow-500 hover:to-yellow-600 font-bold text-xs h-7"
                  size="sm"
                >
                  Upgrade
                </Button>
              </div>
            )}

            {/* User Info */}
            <div className="bg-blue-700/50 rounded-lg p-2 mb-2">
              <p className="text-xs font-medium text-white truncate">{profile.name}</p>
              <p className="text-[10px] text-blue-300 truncate">{profile.email}</p>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-blue-100 hover:bg-blue-700 hover:text-white text-xs h-8"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-3 w-3" />
              Sair
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <DashboardStats />
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
