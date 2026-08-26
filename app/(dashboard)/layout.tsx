"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { isProActive } from "@/lib/plan";
import { canAccessModule, PERMISSION_MODULES } from "@/lib/permissions";
import { TopBar } from "@/components/layout/TopBar";
import {
  LayoutDashboard, Users, Car, FileText, Package, DollarSign,
  Calendar, MessageSquare, Settings, CreditCard, Wrench, Menu,
  X, LogOut, Bell, ChevronDown, Loader2, ClipboardList, Receipt,
  Stethoscope, ChevronRight, Bot, ClipboardCheck, LayoutGrid
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
  { href: "/oficina/quadro", label: "Quadro", icon: LayoutGrid },
  { href: "/oficina/orcamentos", label: "Orçamentos", icon: Receipt },
  { href: "/oficina/estoque", label: "Estoque", icon: Package },
  { href: "/oficina/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/oficina/agenda", label: "Agenda", icon: Calendar },
  { href: "/oficina/diagnostico", label: "Diagnóstico IA", icon: Stethoscope },
  { href: "/oficina/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/oficina/relatorios", label: "Relatórios", icon: FileText },
  { href: "/oficina/whatsapp", label: "WhatsApp", icon: MessageSquare },
  { href: "/oficina/ia", label: "Assistente IA", icon: Bot },
  { href: "/oficina/equipe", label: "Equipe", icon: Users },
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
  const [memberRole, setMemberRole] = useState<string>("owner");
  const [memberPermissions, setMemberPermissions] = useState<Record<string, boolean> | null>(null);

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
          // SEGURANÇA: não marcar como oficina se o cadastro foi de MOTORISTA.
          const metaType = (user.user_metadata as any)?.user_type;
          const cookieType = typeof document !== "undefined"
            ? document.cookie.match(/instauto_user_type=([^;]+)/)?.[1]
            : null;
          if (metaType === "motorist" || cookieType === "motorista") {
            console.log("↪️ [Layout Oficina] Cadastro é de motorista — redirecionando para /motorista");
            router.replace("/motorista");
            return;
          }

          console.log("❌ Profile não encontrado, criando...");
          // Criar profile se não existir
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: (user.user_metadata as any)?.name || user.user_metadata?.full_name || user.email?.split("@")[0],
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
        }

        // Aceita convites de equipe pendentes (vincula o membro à oficina, se houver)
        await supabase.rpc("accept_my_invites");

        const profileType = profileData?.type ?? "workshop";

        console.log("🏠 [Layout] Carregando workshop (dono ou membro)...");
        // Resolve a oficina do usuário — dono OU membro (via workshop_members)
        let workshopData = await resolveWorkshop(supabase, user.id);

        if (!workshopData) {
          // Sem vínculo com oficina. Se for motorista, este não é o lugar dele.
          if (profileType !== "workshop") {
            console.log("⚠️ Motorista sem oficina, redirecionando...");
            router.push("/motorista");
            return;
          }
          // Dono novo (type workshop, sem oficina): cria a oficina e o vínculo de dono
          const md = user.user_metadata as any;
          const { data: newWorkshop } = await supabase
            .from("workshops")
            .insert({
              profile_id: user.id,
              name: md?.name || md?.full_name || "Minha Oficina",
              phone: md?.phone || null,
              address: md?.address || null,
              city: md?.city || null,
              state: md?.state || null,
              plan_type: "free",
              subscription_status: "trial",
              // Trial reverso: 14 dias de PRO completo (mesma regra do callback)
              trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              is_public: true,
              accepts_quotes: true
            })
            .select()
            .single();

          if (newWorkshop) {
            await supabase.from("workshop_members").insert({
              workshop_id: newWorkshop.id,
              profile_id: user.id,
              role: "owner",
            });
            workshopData = newWorkshop;
          }
        }

        setWorkshop(workshopData);

        // Papel + permissões do usuário atual nessa oficina (para filtrar o menu)
        if (workshopData?.id) {
          const { data: myMembership } = await supabase
            .from("workshop_members")
            .select("role, permissions")
            .eq("workshop_id", workshopData.id)
            .eq("profile_id", user.id)
            .maybeSingle();
          setMemberRole(myMembership?.role ?? "owner");
          setMemberPermissions((myMembership?.permissions as Record<string, boolean>) ?? null);
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

  // Atribuição de afiliado: se veio de um link ?ref=, vincula a oficina ao afiliado.
  useEffect(() => {
    if (!workshop?.id) return;
    const ref = typeof window !== "undefined" ? localStorage.getItem("instauto_ref") : null;
    if (!ref) return;
    fetch("/api/affiliate/attribute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.ok) localStorage.removeItem("instauto_ref"); })
      .catch(() => {});
  }, [workshop?.id]);

  // Guard de permissão por página para MEMBROS (bloqueia acesso por URL direta).
  useEffect(() => {
    if (dataLoading || memberRole === "owner") return;

    // Membro não acessa Equipe/Planos (nível dono)
    if (pathname === "/oficina/equipe" || pathname === "/oficina/planos") {
      router.push("/oficina");
      return;
    }

    // Módulos: /oficina/<modulo>...
    const seg = pathname.split("/")[2] || "";
    const isModule = PERMISSION_MODULES.some((m) => m.key === seg);
    if (isModule && !canAccessModule(memberPermissions, seg)) {
      router.push("/oficina");
    }
  }, [pathname, memberRole, memberPermissions, dataLoading, router]);

  // Loading
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1e3a8a] mx-auto mb-4" />
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Sem user
  if (!user) {
    return null;
  }

  // Menu visível conforme PLANO e papel/permissões.
  const proActive = isProActive(workshop as any);
  // No FREE (trial expirado, sem pagar) só ficam: Dashboard, Orçamentos (marketplace),
  // Configurações e Planos. Todo o resto é gestão (PRO/Equipe/trial).
  const FREE_ALLOWED = ["/oficina", "/oficina/orcamentos", "/oficina/configuracoes", "/oficina/planos"];

  let visibleMenu = menuItems;

  if (!proActive) {
    visibleMenu = visibleMenu.filter((item) => FREE_ALLOWED.includes(item.href));
  }

  // Membro (não dono): esconde Equipe/Planos e os módulos sem permissão.
  if (memberRole !== "owner") {
    const OWNER_ONLY = ["/oficina/equipe", "/oficina/planos"];
    visibleMenu = visibleMenu.filter((item) => {
      if (OWNER_ONLY.includes(item.href)) return false;
      if (item.href === "/oficina" || item.href === "/oficina/configuracoes") return true;
      const key = item.href.split("/").pop() || "";
      return canAccessModule(memberPermissions, key);
    });
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Blue gradient glassmorphism */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col
        bg-gradient-to-b from-[#0B1120] via-[#13224a] to-[#1e3a8a]
        border-r border-white/10 shadow-2xl
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Glass highlight overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

        {/* Logo */}
        <div className="relative flex-shrink-0 p-5 border-b border-white/10">
          <Link href="/oficina" className="flex items-center justify-center">
            <Image
              src="/images/instauto-amarelo-branco.svg"
              alt="Instauto"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-3 space-y-0.5 overflow-y-auto">
          {visibleMenu.map((item) => {
            const isActive = pathname === item.href;
            const showBadge = item.href === "/oficina/orcamentos" && pendingQuotes > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-yellow-400" : ""}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-semibold">
                    {pendingQuotes}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="relative flex-shrink-0 p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-[#0B1120] text-sm font-bold">
              {workshop?.name?.charAt(0) || "O"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{workshop?.name || "Oficina"}</p>
              <p className="text-xs text-white/50 truncate">
                {workshop?.plan_type === "pro" ? "Plano Pro" : "Plano Free"}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
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
