"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase";
import { Bell, User, Settings, LogOut, ChevronDown, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function TopBar() {
  const { profile, signOut } = useAuth();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadNotifications = async () => {
      try {
        let query = supabase
          .from("notifications")
          .select("*")
          .eq("user_id", profile.id);

        query = query.abortSignal(abortController.signal);

        const { data, error } = await query
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;

        if (mounted) {
          setNotifications(data || []);
          setUnreadCount(data?.filter(n => !n.is_read).length || 0);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar notificações:", error);
        }
      }
    };

    loadNotifications();

    // Recarregar a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000);

    return () => {
      mounted = false;
      abortController.abort();
      clearInterval(interval);
    };
  }, [profile?.id]);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      quote_response: "📋",
      message: "💬",
      maintenance: "🔧",
      alert: "🚨",
      promotion: "🎁",
    };
    return icons[type] || "🔔";
  };

  const getUserInitials = () => {
    if (!profile?.name) return "U";
    const names = profile.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profile.name[0].toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Limpar cookies manualmente
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (name.startsWith("sb-")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
      });
      
      // Limpar storage
      Object.keys(localStorage).filter(k => k.startsWith("sb-")).forEach(k => localStorage.removeItem(k));
      Object.keys(sessionStorage).filter(k => k.startsWith("sb-")).forEach(k => sessionStorage.removeItem(k));
      
      // Forçar redirecionamento
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao sair:", error);
      // Forçar redirecionamento mesmo com erro
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6">
      
      {/* Busca central */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Buscar..."
            className="w-full pl-12 pr-16 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded font-medium">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Ações à direita */}
      <div className="flex items-center gap-2">
          {/* Botão tema */}
          <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Sun className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="font-bold text-gray-900">Notificações</h3>
                    {unreadCount > 0 && (
                      <p className="text-sm text-gray-600">{unreadCount} não lida{unreadCount !== 1 ? 's' : ''}</p>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm">Nenhuma notificação</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href="/motorista/notificacoes"
                          onClick={() => setShowNotifications(false)}
                          className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.is_read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <span className="text-2xl flex-shrink-0">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                {!notification.is_read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {format(new Date(notification.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <Link
                      href="/motorista/notificacoes"
                      onClick={() => setShowNotifications(false)}
                      className="block p-3 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
                    >
                      Ver todas as notificações
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold ml-2 hover:shadow-lg transition-all"
            >
              {getUserInitials()}
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {profile?.name || "Motorista"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile?.email || ""}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/motorista/configuracoes"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Link>
                    <Link
                      href="/motorista/configuracoes"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Configurações
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da conta
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
    </header>
  );
}
