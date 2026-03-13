"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut, Menu, X, Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  type: string;
}

interface TopBarProps {
  user: any;
  userType: "workshop" | "motorist";
  userName?: string;
  onMenuClick: () => void;
  onSignOut: () => void;
}

export function TopBar({ user, userType, userName, onMenuClick, onSignOut }: TopBarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    console.log("🔔 [TopBar] Buscando notificações para user:", user.id);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("❌ [TopBar] Erro ao buscar notificações:", error);
        throw error;
      }

      console.log("✅ [TopBar] Notificações encontradas:", data?.length || 0);
      console.log("✅ [TopBar] Não lidas:", data?.filter(n => !n.is_read).length || 0);

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error("❌ [TopBar] Erro ao buscar notificações:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;

      // Atualizar estado local
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    
    // Redirecionar baseado no tipo
    if (notification.type === "quote_received" || notification.type === "quote_response") {
      router.push(userType === "workshop" ? "/oficina/orcamentos" : "/motorista/orcamentos");
    }
    
    setShowNotifications(false);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "agora";
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
    return `há ${Math.floor(seconds / 86400)}d`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quote_received":
      case "quote_response":
        return "💬";
      case "quote_rejected":
        return "❌";
      default:
        return "🔔";
    }
  };

  return (
    <header className="sticky top-0 z-40 h-14 px-8 flex items-center justify-between border-b border-white/5 bg-[#09090B]/80 backdrop-blur-xl">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
        <span className="text-gray-500 hidden lg:inline">
          {userType === "workshop" ? "Dashboard Oficina" : "Dashboard Motorista"}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
            {/* Notifications - Estilo Vercel */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>

              {/* Notifications Dropdown - Dark Theme */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0A0A0F] backdrop-blur-md rounded-xl shadow-2xl border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/5">
                    <h3 className="font-semibold text-white">Notificações</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Tudo em dia!"}
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 ${
                            !notification.is_read ? "bg-white/[0.02]" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-white text-sm truncate">
                                  {notification.title}
                                </p>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-2 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-600">
                                {getTimeAgo(notification.created_at)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-white/5">
                      <Link
                        href={userType === "workshop" ? "/oficina/orcamentos" : "/motorista/orcamentos"}
                        className="block text-center text-sm font-medium text-blue-400 hover:text-blue-300"
                        onClick={() => setShowNotifications(false)}
                      >
                        Ver todas as notificações
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
    </header>
  );
}
