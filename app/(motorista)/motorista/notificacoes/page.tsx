"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Bell, Check, Trash2, FileText, MessageCircle, Wrench, Tag, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  data: any;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export default function NotificacoesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!profile?.id) return;

    const abortController = new AbortController();
    let mounted = true;

    const loadNotifications = async () => {
      try {
        setLoading(true);

        let query = supabase
          .from("notifications")
          .select("*")
          .eq("user_id", profile.id);

        query = query.abortSignal(abortController.signal);

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted) {
          setNotifications(data || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError' && mounted) {
          console.error("Erro ao carregar notificações:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível carregar as notificações.",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      mounted = false;
      abortController.abort();
    };
  }, [profile?.id]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );

      toast({
        title: "Marcada como lida",
      });
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from("notifications")
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .in("id", unreadIds);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );

      toast({
        title: "Todas marcadas como lidas",
      });
    } catch (error) {
      console.error("Erro ao marcar todas como lidas:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotifications((prev) => prev.filter((n) => n.id !== id));

      toast({
        title: "Notificação removida",
      });
    } catch (error) {
      console.error("Erro ao deletar notificação:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover a notificação.",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, any> = {
      quote_response: FileText,
      message: MessageCircle,
      maintenance: Wrench,
      alert: Bell,
      promotion: Tag,
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      quote_response: "from-green-500 to-emerald-600",
      message: "from-blue-500 to-sky-600",
      maintenance: "from-orange-500 to-amber-600",
      alert: "from-red-500 to-rose-600",
      promotion: "from-pink-500 to-fuchsia-600",
    };
    return colors[type] || "from-gray-500 to-slate-600";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="p-8">
        {/* Header padrão */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-1">Dashboard / Notificações</p>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
              <p className="text-gray-600 text-sm mt-1">
                {unreadCount > 0 ? `${unreadCount} ${unreadCount === 1 ? 'não lida' : 'não lidas'}` : 'Você está em dia!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-xl hover:bg-yellow-300 shadow-lg shadow-yellow-400/30 flex items-center gap-2 transition-all"
              >
                <CheckCircle className="w-5 h-5" />
                Marcar todas como lidas
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-gradient-to-r from-blue-600 to-indigo-600 font-bold" : "border-2 font-bold"}
          >
            Todas ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            onClick={() => setFilter("unread")}
            className={filter === "unread" ? "bg-gradient-to-r from-orange-600 to-amber-600 font-bold" : "border-2 font-bold"}
          >
            Não lidas ({unreadCount})
          </Button>
        </div>

        {/* Lista de Notificações */}
        {filteredNotifications.length === 0 ? (
          <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardContent className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <Bell className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === "unread" ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {filter === "unread" 
                  ? "Você está em dia com todas as suas notificações!"
                  : "Você ainda não recebeu nenhuma notificação."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              const gradient = getNotificationColor(notification.type);

              return (
                <Card
                  key={notification.id}
                  className={`border-2 ${notification.is_read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50/30'} hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-lg mb-1">{notification.title}</CardTitle>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="hover:bg-blue-500 hover:text-white transition-all hover:scale-110"
                                title="Marcar como lida"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(notification.id)}
                              className="hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                              title="Remover"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <Badge className="mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold">
                            Nova
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
