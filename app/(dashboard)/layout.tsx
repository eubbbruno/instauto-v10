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
  X
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";

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
  { name: "Agenda", href: "/oficina/agenda", icon: <Calendar className="h-5 w-5" />, pro: true },
  { name: "Estoque", href: "/oficina/estoque", icon: <Package className="h-5 w-5" />, pro: true },
  { name: "Financeiro", href: "/oficina/financeiro", icon: <DollarSign className="h-5 w-5" />, pro: true },
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
      router.push("/login");
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
          <Car className="h-6 w-6 text-purple-600" />
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-purple-700">
            <Link href="/oficina" className="flex items-center gap-3">
              <div className="p-2 bg-purple-700 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Instauto</span>
                <p className="text-xs text-purple-200 mt-0.5">
                  {workshop?.name || profile.name}
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const needsPro = item.pro && !hasProAccess;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-purple-700 text-white shadow-lg"
                      : "text-purple-100 hover:bg-purple-700/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {needsPro && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-400 text-purple-900 rounded-full">
                      PRO
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Plan Badge */}
          <div className="p-4 border-t border-purple-700">
            {isPro ? (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-900" />
                  <div>
                    <p className="text-sm font-bold text-purple-900">Plano PRO</p>
                    <p className="text-xs text-purple-800">Assinatura ativa</p>
                  </div>
                </div>
              </div>
            ) : isTrialActive ? (
              <div className="bg-blue-500 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-bold text-white">Trial PRO</p>
                    <p className="text-xs text-blue-100">
                      {Math.ceil(
                        (new Date(workshop?.trial_ends_at || "").getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      dias restantes
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-purple-700 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-purple-300" />
                  <div>
                    <p className="text-sm font-bold text-white">Plano FREE</p>
                    <p className="text-xs text-purple-300">Recursos limitados</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/oficina/planos")}
                  className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 hover:from-yellow-500 hover:to-yellow-600 font-bold"
                  size="sm"
                >
                  Fazer Upgrade
                </Button>
              </div>
            )}

            {/* User Info */}
            <div className="bg-purple-700/50 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-white truncate">{profile.name}</p>
              <p className="text-xs text-purple-300 truncate">{profile.email}</p>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-100 hover:bg-purple-700 hover:text-white"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
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
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
