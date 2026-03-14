"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, User, Settings, LogOut, Menu, X, Check, ChevronDown, Search } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
      <div className="flex items-center justify-between h-16 px-6 gap-4">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes, veículos, orçamentos..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
            {/* Notifications Premium */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/30">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-gray-50/80">
                    <h3 className="font-semibold text-gray-900">Notificações</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` : "Tudo em dia!"}
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                            !notification.is_read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-gray-900 text-sm truncate">
                                  {notification.title}
                                </p>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400">
                                {getTimeAgo(notification.created_at)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100 bg-gray-50">
                      <Link
                        href={userType === "workshop" ? "/oficina/orcamentos" : "/motorista/orcamentos"}
                        className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => setShowNotifications(false)}
                      >
                        Ver todas as notificações
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="w-px h-8 bg-gray-200 mx-2" />
            
            {/* User Menu Premium */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {userName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                  <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-gray-50/80">
                    <p className="font-semibold text-gray-900 truncate">{userName || "Usuário"}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href={userType === "workshop" ? "/oficina/configuracoes" : "/motorista/configuracoes"}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-700">Configurações</span>
                    </Link>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    </header>
  );
}
