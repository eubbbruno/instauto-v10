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
  Receipt,
  Wrench,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Workshop } from "@/types/database";
import TopBar from "@/components/oficina/TopBar";

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
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadWorkshop = async () => {
      try {
        const { data, error } = await supabase
          .from("workshops")
          .select("*")
          .eq("profile_id", profile.id)
          .abortSignal(abortController.signal)
          .single();

        if (error) throw error;
        if (mounted) {
          setWorkshop(data);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar oficina:", error);
        }
      }
    };

    loadWorkshop();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
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

      {/* SIDEBAR PREMIUM */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-50 via-white to-blue-50/50 border-r border-blue-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo no topo */}
        <div className="p-6 border-b border-blue-100">
          <Link href="/oficina" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg">Instauto</span>
              <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const needsPro = item.pro && !hasProAccess;

            if (needsPro) {
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push("/oficina/planos");
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-3">
            Outros
          </p>
          
          <Link
            href="/oficina/configuracoes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
          
          <Link
            href="/oficina/planos"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <Crown className="w-5 h-5" />
            <span className="font-medium">Planos</span>
          </Link>
        </nav>

        {/* Oficina no rodapé */}
        <div className="p-4 border-t border-blue-100">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {workshop?.name?.charAt(0)?.toUpperCase() || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate text-sm">
                {workshop?.name || 'Oficina'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {workshop?.city}, {workshop?.state}
              </p>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400" />
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
        {/* TopBar - Desktop only */}
        <div className="hidden lg:block">
          <TopBar />
        </div>
        {children}
      </main>
    </div>
  );
}
