"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageSquare, Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

interface Chat {
  id: string;
  workshop_id: string;
  workshop_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "me" | "workshop";
  message: string;
  timestamp: string;
  read: boolean;
}

export default function ChatPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login-motorista");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      loadChats();
    }
  }, [profile]);

  const loadChats = async () => {
    // Mock data - depois conectar com banco
    const mockChats: Chat[] = [
      {
        id: "1",
        workshop_id: "w1",
        workshop_name: "Auto Center Silva",
        last_message: "Seu orçamento está pronto!",
        last_message_time: new Date().toISOString(),
        unread_count: 2,
        online: true,
      },
      {
        id: "2",
        workshop_id: "w2",
        workshop_name: "Mecânica do João",
        last_message: "Podemos agendar para amanhã às 14h",
        last_message_time: new Date(Date.now() - 3600000).toISOString(),
        unread_count: 0,
        online: false,
      },
      {
        id: "3",
        workshop_id: "w3",
        workshop_name: "Oficina Rápida",
        last_message: "Obrigado pela preferência!",
        last_message_time: new Date(Date.now() - 86400000).toISOString(),
        unread_count: 0,
        online: true,
      },
    ];
    setChats(mockChats);
  };

  const loadMessages = (chat: Chat) => {
    // Mock messages - depois conectar com banco
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: "workshop",
        message: "Olá! Como posso ajudar?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: "2",
        sender: "me",
        message: "Preciso de um orçamento para troca de óleo",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true,
      },
      {
        id: "3",
        sender: "workshop",
        message: "Claro! Qual o modelo do seu veículo?",
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        read: true,
      },
      {
        id: "4",
        sender: "me",
        message: "Honda Civic 2020",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: true,
      },
      {
        id: "5",
        sender: "workshop",
        message: "Perfeito! O orçamento para troca de óleo com filtro fica em R$ 180,00. Posso agendar para você?",
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: true,
      },
    ];
    setMessages(mockMessages);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    loadMessages(chat);
    // Marcar como lido
    setChats(prev =>
      prev.map(c => c.id === chat.id ? { ...c, unread_count: 0 } : c)
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "me",
      message: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Atualizar último mensagem no chat
    setChats(prev =>
      prev.map(c =>
        c.id === selectedChat.id
          ? { ...c, last_message: newMessage, last_message_time: new Date().toISOString() }
          : c
      )
    );
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now.getTime() - messageDate.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return messageDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    if (hours < 24) return `${hours}h atrás`;
    if (days === 1) return "Ontem";
    if (days < 7) return `${days}d atrás`;
    return messageDate.toLocaleDateString("pt-BR");
  };

  const filteredChats = chats.filter(chat =>
    chat.workshop_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
          <div className="flex h-full">
            {/* Sidebar - Lista de Chats */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mensagens</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar oficinas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-4">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">
                      {searchTerm ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => handleSelectChat(chat)}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          selectedChat?.id === chat.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                          </div>
                          {chat.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">{chat.workshop_name}</p>
                            {chat.unread_count > 0 && (
                              <Badge className="bg-blue-600 text-white ml-2">
                                {chat.unread_count}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTime(chat.last_message_time)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        {selectedChat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedChat.workshop_name}</p>
                        <p className="text-xs text-gray-500">
                          {selectedChat.online ? "Online" : "Offline"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.sender === "me"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "me" ? "text-blue-100" : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ImageIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Smile className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Enviar
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      Selecione uma conversa
                    </p>
                    <p className="text-gray-400">
                      Escolha uma oficina para começar a conversar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

