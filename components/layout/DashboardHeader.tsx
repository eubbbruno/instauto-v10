"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Bell, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function DashboardHeader() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      loadNotifications();
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;

    try {
      if (profile.type === "motorista") {
        // Buscar motorista
        const { data: motorist } = await supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id)
          .single();

        if (!motorist) return;

        // Contar orçamentos respondidos não visualizados
        const { count } = await supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("motorist_id", motorist.id)
          .eq("status", "responded");

        setNotifications(count || 0);
      } else if (profile.type === "oficina") {
        // Buscar oficina
        const { data: workshop } = await supabase
          .from("workshops")
          .select("id")
          .eq("profile_id", profile.id)
          .single();

        if (!workshop) return;

        // Contar orçamentos pendentes
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
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleNotificationClick = () => {
    if (profile?.type === "motorista") {
      router.push("/motorista/orcamentos");
    } else if (profile?.type === "oficina") {
      router.push("/oficina/orcamentos");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={140}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* User Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notificações */}
            {notifications > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="relative border-yellow-300 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold hidden sm:flex"
                onClick={handleNotificationClick}
              >
                <FileText className="h-4 w-4 mr-2" />
                {profile?.type === "motorista" ? "Respostas" : "Novos"}
                <Badge className="ml-2 bg-gray-900 hover:bg-gray-800 text-white">
                  {notifications}
                </Badge>
              </Button>
            )}

            {/* Bell Icon (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="relative sm:hidden text-white hover:bg-white/20"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              )}
            </Button>

            {/* User Info */}
            {profile && (
              <div className="hidden md:flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                <span className="font-medium">{profile.name}</span>
              </div>
            )}
            
            {/* Logout */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

