"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, Bell } from "lucide-react";
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
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;

    try {
      if (profile.type === "motorista") {
        const { data: motorist } = await supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", profile.id)
          .single();

        if (!motorist) return;

        const { count } = await supabase
          .from("quotes")
          .select("*", { count: "exact", head: true })
          .eq("motorist_id", motorist.id)
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
  const notificationsPath = profile?.type === "motorista" ? "/motorista/orcamentos" : "/oficina/orcamentos";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={dashboardPath} className="flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={120}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              href={notificationsPath}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notifications > 9 ? "9+" : notifications}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{firstName}</p>
                <p className="text-xs text-gray-500 capitalize">{profile?.type}</p>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
