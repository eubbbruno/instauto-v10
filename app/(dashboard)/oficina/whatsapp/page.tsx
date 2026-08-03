"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import PlanGuard from "@/components/auth/PlanGuard";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Loader2, MessageSquare, Send, Smartphone, CheckCircle2, RefreshCw, QrCode,
  Bot, ArrowLeft, Search, Settings2,
} from "lucide-react";

export default function WhatsAppPage() {
  return (
    <PlanGuard feature="Integração WhatsApp">
      <WhatsAppContent />
    </PlanGuard>
  );
}

interface Message {
  id: string;
  remote_jid: string;
  contact_name: string | null;
  from_me: boolean;
  text: string | null;
  created_at: string;
}

interface Conversation {
  jid: string;
  name: string;
  number: string;
  lastText: string;
  lastAt: string;
  lastFromMe: boolean;
  messages: Message[];
}

function jidNumber(jid: string) {
  return jid.split("@")[0] || jid;
}

function groupConversations(messages: Message[]): Conversation[] {
  const map = new Map<string, Message[]>();
  for (const m of messages) {
    const arr = map.get(m.remote_jid) || [];
    arr.push(m);
    map.set(m.remote_jid, arr);
  }
  const convs: Conversation[] = [];
  for (const [jid, msgs] of map) {
    // messages chegam do banco em ordem desc; ordena asc p/ a thread
    const asc = [...msgs].sort((a, b) => a.created_at.localeCompare(b.created_at));
    const last = asc[asc.length - 1];
    const name =
      asc.find((m) => !m.from_me && m.contact_name)?.contact_name || jidNumber(jid);
    convs.push({
      jid,
      name,
      number: jidNumber(jid),
      lastText: last?.text || "",
      lastAt: last?.created_at || "",
      lastFromMe: last?.from_me || false,
      messages: asc,
    });
  }
  return convs.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
}

function timeLabel(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

function WhatsAppContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeJid, setActiveJid] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sendText, setSendText] = useState("");
  const [sending, setSending] = useState(false);
  const [aiAutoreply, setAiAutoreply] = useState(false);
  const [togglingAi, setTogglingAi] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const msgPollRef = useRef<NodeJS.Timeout | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (profile?.id) init();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (msgPollRef.current) clearInterval(msgPollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  // Auto-refresh das mensagens quando conectado (fallback do realtime)
  useEffect(() => {
    if (!workshopId || !connected) return;
    if (msgPollRef.current) clearInterval(msgPollRef.current);
    msgPollRef.current = setInterval(() => loadMessages(workshopId), 5000);
    return () => {
      if (msgPollRef.current) clearInterval(msgPollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId, connected]);

  // Realtime: reage a novas mensagens (enviadas ou recebidas) na hora
  useEffect(() => {
    if (!workshopId) return;
    const channel = supabase
      .channel(`wpp-${workshopId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_messages", filter: `workshop_id=eq.${workshopId}` },
        () => loadMessages(workshopId)
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId]);

  const conversations = useMemo(() => groupConversations(messages), [messages]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) => c.name.toLowerCase().includes(q) || c.number.includes(q)
    );
  }, [conversations, search]);
  const active = useMemo(
    () => conversations.find((c) => c.jid === activeJid) || null,
    [conversations, activeJid]
  );

  // Rola pro fim da thread ao trocar de conversa / chegar msg
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages.length, activeJid]);

  const init = async () => {
    setLoading(true);
    const ws = await resolveWorkshop(supabase, profile?.id);
    if (ws) {
      setWorkshopId(ws.id);
      await Promise.all([checkStatus(ws.id), loadMessages(ws.id), loadSettings(ws.id)]);
    }
    setLoading(false);
  };

  const loadSettings = async (id: string) => {
    try {
      const res = await fetch(`/api/whatsapp/settings?workshopId=${id}`);
      const data = await res.json();
      setAiAutoreply(!!data.aiAutoreply);
    } catch {}
  };

  const toggleAi = async () => {
    if (!workshopId) return;
    const next = !aiAutoreply;
    setTogglingAi(true);
    setAiAutoreply(next); // otimista
    try {
      const res = await fetch("/api/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, aiAutoreply: next }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({
        title: next ? "Resposta automática com IA ativada" : "Resposta automática desativada",
        description: next
          ? "A IA vai responder novas mensagens dentro da sua cota mensal."
          : undefined,
      });
    } catch (e: any) {
      setAiAutoreply(!next); // reverte
      toast({ variant: "destructive", title: "Erro", description: e.message });
    } finally {
      setTogglingAi(false);
    }
  };

  const checkStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/whatsapp/status?workshopId=${id}`);
      const data = await res.json();
      setConnected(!!data.connected);
      if (data.connected) {
        setQr(null);
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      }
      return !!data.connected;
    } catch { return false; }
  };

  const loadMessages = async (id: string) => {
    const { data } = await supabase
      .from("whatsapp_messages")
      .select("*")
      .eq("workshop_id", id)
      .order("created_at", { ascending: false })
      .limit(300);
    setMessages((data as Message[]) || []);
  };

  const handleConnect = async () => {
    if (!workshopId) return;
    setConnecting(true);
    setQr(null);
    try {
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.qrcode) {
        setQr(data.qrcode.startsWith("data:") ? data.qrcode : `data:image/png;base64,${data.qrcode}`);
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(() => checkStatus(workshopId), 3000);
      } else {
        toast({ title: "Aguardando", description: "QR não retornado. Tente novamente em instantes." });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erro ao conectar", description: e.message });
    } finally {
      setConnecting(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopId || !active || !sendText.trim()) return;
    const text = sendText.trim();
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, number: active.number, text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendText("");
      await loadMessages(workshopId);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erro ao enviar", description: e.message });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / WhatsApp</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">WhatsApp</h1>
          <p className="text-sm text-gray-600 mt-1">Converse com seus clientes direto por aqui.</p>
        </div>
        {connected && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCircle2 className="w-4 h-4" /> Conectado
          </span>
        )}
      </div>

      {/* Não conectado → card de conexão / QR */}
      {!connected ? (
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100">
                <Smartphone className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Não conectado</p>
                <p className="text-sm text-gray-500">Conecte escaneando o QR Code com o WhatsApp da oficina.</p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60"
            >
              {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
              Conectar WhatsApp
            </button>
          </div>

          {qr && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center text-center">
              <img src={qr} alt="QR Code do WhatsApp" className="w-56 h-56 rounded-xl border border-gray-200" />
              <p className="text-sm text-gray-600 mt-4 max-w-sm">
                No celular da oficina, abra o <strong>WhatsApp → Aparelhos conectados → Conectar um aparelho</strong> e escaneie este código.
              </p>
              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Aguardando leitura…</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Toggle de auto-resposta com IA */}
          <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${aiAutoreply ? "bg-yellow-100" : "bg-gray-100"}`}>
                <Bot className={`w-5 h-5 ${aiAutoreply ? "text-yellow-600" : "text-gray-400"}`} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Resposta automática com IA</p>
                <p className="text-sm text-gray-500">
                  A IA responde novas mensagens automaticamente.{" "}
                  <Link href="/oficina/ia" className="text-[#1e3a8a] font-medium hover:underline inline-flex items-center gap-1">
                    <Settings2 className="w-3.5 h-3.5" /> Configurar
                  </Link>
                </p>
              </div>
            </div>
            <button
              onClick={toggleAi}
              disabled={togglingAi}
              role="switch"
              aria-checked={aiAutoreply}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-60 ${aiAutoreply ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${aiAutoreply ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>

          {/* Layout de conversas */}
          <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] h-[600px]">
            {/* Lista de contatos */}
            <div className={`border-r border-gray-100 flex-col min-h-0 overflow-hidden ${active ? "hidden md:flex" : "flex"}`}>
              <div className="p-3 border-b border-gray-100 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar conversa…"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => workshopId && loadMessages(workshopId)}
                  className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 shrink-0"
                  title="Atualizar conversas"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">Nenhuma conversa ainda.</p>
                    <p className="text-xs mt-1">As mensagens recebidas aparecem aqui.</p>
                  </div>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.jid}
                      onClick={() => setActiveJid(c.jid)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${activeJid === c.jid ? "bg-[#1e3a8a]/5" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 text-sm truncate">{c.name}</p>
                        <span className="text-[11px] text-gray-400 shrink-0">{timeLabel(c.lastAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {c.lastFromMe && <span className="text-gray-400">Você: </span>}
                        {c.lastText}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Thread */}
            <div className={`flex-col min-h-0 overflow-hidden ${active ? "flex" : "hidden md:flex"}`}>
              {!active ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                  <MessageSquare className="w-12 h-12 mb-3 text-gray-200" />
                  <p className="text-sm">Selecione uma conversa para ver as mensagens.</p>
                </div>
              ) : (
                <>
                  {/* Cabeçalho da conversa */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <button onClick={() => setActiveJid(null)} className="md:hidden p-1 text-gray-500">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-[#1e3a8a] font-bold text-sm">
                      {active.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{active.name}</p>
                      <p className="text-xs text-gray-400">{active.number}</p>
                    </div>
                    <button
                      onClick={() => workshopId && loadMessages(workshopId)}
                      className="ml-auto p-2 rounded-lg text-gray-400 hover:bg-gray-50"
                      title="Atualizar"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mensagens */}
                  <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2 bg-gray-50/50">
                    {active.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.from_me ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${m.from_me ? "bg-[#1e3a8a] text-white" : "bg-white border border-gray-100 text-gray-900"}`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                          <p className={`text-[10px] mt-1 ${m.from_me ? "text-white/60" : "text-gray-400"}`}>
                            {timeLabel(m.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={threadEndRef} />
                  </div>

                  {/* Composer */}
                  <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex items-center gap-2">
                    <input
                      value={sendText}
                      onChange={(e) => setSendText(e.target.value)}
                      placeholder="Digite uma mensagem…"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={sending || !sendText.trim()}
                      className="btn-epic-blue inline-flex items-center justify-center w-11 h-11 rounded-xl font-bold disabled:opacity-60 shrink-0"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
