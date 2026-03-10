"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Building2, 
  Users, 
  FileText, 
  Star, 
  ArrowLeft,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return;

      if (!user) {
        router.push("/login");
        return;
      }

      // Verificar se é admin
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileData?.role !== "admin") {
        console.log("🚫 [Admin Layout] Acesso negado. Redirecionando...");
        router.push("/");
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    };

    checkAdmin();
  }, [user, loading, router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/oficinas", icon: Building2, label: "Oficinas" },
    { href: "/admin/motoristas", icon: Users, label: "Motoristas" },
    { href: "/admin/orcamentos", icon: FileText, label: "Orçamentos" },
    { href: "/admin/avaliacoes", icon: Star, label: "Avaliações" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-gray-900 text-white">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo e Badge Admin */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.svg"
                alt="Instauto"
                width={120}
                height={36}
                className="brightness-0 invert"
              />
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              ADMIN
            </span>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer do Sidebar */}
          <div className="p-4 border-t border-gray-800 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar ao Site</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>

            {/* Info do Admin */}
            <div className="px-4 py-3 bg-gray-800 rounded-xl">
              <p className="text-xs text-gray-400">Logado como</p>
              <p className="text-sm text-white font-medium truncate">{profile?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-50 border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={100}
              height={30}
              className="brightness-0 invert"
            />
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              ADMIN
            </span>
          </div>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="border-t border-gray-800 bg-gray-900">
            <nav className="px-4 py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar ao Site</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sair</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="lg:pl-72">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
