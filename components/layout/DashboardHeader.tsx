"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Bell, User, Menu, X, Car, FileText, Clock, Search, Settings, Fuel, DollarSign, Bell as BellReminder } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import NotificationCenter from "@/components/notifications/NotificationCenter";

export default function DashboardHeader() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (profile) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;

    try {
      if (profile.type === "motorista") {
        // Contar orçamentos respondidos usando email
        const { count } = await supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("motorist_email", profile.email)
          .eq("status", "responded");

        setNotifications(count || 0);
      } else if (profile.type === "oficina") {
        const { data: workshop } = await supabase
          .from("workshops")
          .select("id")
          .eq("profile_id", profile.id)
          .single();

        if (!workshop) return;

        const { count } = await supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("workshop_id", workshop.id)
          .eq("status", "pending");

        setNotifications(count || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const firstName = profile?.name?.split(" ")[0] || "Usuário";
  const dashboardPath = profile?.type === "motorista" ? "/motorista" : "/oficina";

  // Links do menu baseado no tipo de usuário
  const menuLinks = profile?.type === "motorista" ? [
    { href: "/motorista", label: "Dashboard", icon: Car },
    { href: "/motorista/garagem", label: "Garagem", icon: Car },
    { href: "/motorista/oficinas", label: "Oficinas", icon: Search },
    { href: "/motorista/orcamentos", label: "Orçamentos", icon: FileText },
    { href: "/motorista/historico", label: "Histórico", icon: Clock },
    { href: "/motorista/abastecimento", label: "Abastecimento", icon: Fuel },
    { href: "/motorista/despesas", label: "Despesas", icon: DollarSign },
    { href: "/motorista/lembretes", label: "Lembretes", icon: BellReminder },
  ] : [
    { href: "/oficina", label: "Dashboard", icon: Car },
    { href: "/oficina/orcamentos", label: "Orçamentos", icon: FileText },
    { href: "/oficina/clientes", label: "Clientes", icon: User },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-blue-900 shadow-lg"
          : "bg-blue-900/95 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={dashboardPath} className="relative z-10 flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={160}
              height={45}
              className="h-11 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-yellow-400 font-sans font-semibold transition-colors relative group text-[15px] flex items-center gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            <div className="h-6 w-px bg-white/30"></div>
            
            {/* Notifications */}
            <NotificationCenter />

            {/* User menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/30">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{firstName}</p>
                <p className="text-xs text-blue-200 capitalize">{profile?.type}</p>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-yellow-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white hover:text-yellow-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <Link
                href={profile?.type === "motorista" ? "/motorista/orcamentos" : "/oficina/orcamentos"}
                className="flex items-center gap-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className="w-5 h-5" />
                Notificações
                {notifications > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {notifications}
                  </span>
                )}
              </Link>
              
              <div className="border-t border-gray-200 my-3"></div>
              
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900">{firstName}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.type}</p>
              </div>
              
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left text-red-600 hover:bg-red-50 font-sans font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
