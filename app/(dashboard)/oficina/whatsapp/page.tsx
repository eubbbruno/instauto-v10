"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import PlanGuard from "@/components/auth/PlanGuard";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2, MessageSquare, Send, Smartphone, CheckCircle2, RefreshCw, QrCode, Power,
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
  const [sendNumber, setSendNumber] = useState("");
  const [sendText, setSendText] = useState("");
  const [sending, setSending] = useState(false);

  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (profile?.id) init();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const init = async () => {
    setLoading(true);
    const ws = await resolveWorkshop(supabase, profile?.id);
    if (ws) {
      setWorkshopId(ws.id);
      await checkStatus(ws.id);
      await loadMessages(ws.id);
    }
    setLoading(false);
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
      .limit(50);
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
        // Poll a cada 3s até conectar
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
    if (!workshopId || !sendNumber.trim() || !sendText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, number: sendNumber, text: sendText }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Mensagem enviada!" });
      setSendText("");
      loadMessages(workshopId);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erro ao enviar", description: e.message });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / WhatsApp</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">WhatsApp</h1>
        <p className="text-sm text-gray-600 mt-1">Conecte o WhatsApp da oficina e fale com seus clientes por aqui.</p>
      </div>

      {/* Status da conexão */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${connected ? "bg-green-100" : "bg-gray-100"}`}>
              <Smartphone className={`w-5 h-5 ${connected ? "text-green-600" : "text-gray-400"}`} />
            </div>
            <div>
              <p className="font-bold text-gray-900 flex items-center gap-2">
                {connected ? (<><CheckCircle2 className="w-4 h-4 text-green-600" /> Conectado</>) : "Não conectado"}
              </p>
              <p className="text-sm text-gray-500">
                {connected ? "Seu WhatsApp está pronto para enviar e receber." : "Conecte escaneando o QR Code com o WhatsApp da oficina."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => workshopId && checkStatus(workshopId)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"
              title="Atualizar status"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            {!connected && (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60"
              >
                {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                Conectar WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* QR Code */}
        {qr && !connected && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center text-center">
            <img src={qr} alt="QR Code do WhatsApp" className="w-56 h-56 rounded-xl border border-gray-200" />
            <p className="text-sm text-gray-600 mt-4 max-w-sm">
              No celular da oficina, abra o <strong>WhatsApp → Aparelhos conectados → Conectar um aparelho</strong> e escaneie este código.
            </p>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Aguardando leitura…</p>
          </div>
        )}
      </div>

      {/* Enviar mensagem */}
      {connected && (
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
            <Send className="w-5 h-5 text-[#1e3a8a]" /> Enviar mensagem
          </h2>
          <form onSubmit={handleSend} className="space-y-3">
            <input
              value={sendNumber}
              onChange={(e) => setSendNumber(e.target.value)}
              placeholder="Número com DDD (ex.: 43999998888)"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent"
            />
            <textarea
              value={sendText}
              onChange={(e) => setSendText(e.target.value)}
              placeholder="Sua mensagem…"
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent resize-none"
            />
            <button type="submit" disabled={sending} className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold disabled:opacity-60">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Mensagens recentes */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1e3a8a]" /> Mensagens recentes
          </h2>
          <button onClick={() => workshopId && loadMessages(workshopId)} className="text-sm text-[#1e3a8a] hover:underline">Atualizar</button>
        </div>
        <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-200" />
              <p className="text-sm">Nenhuma mensagem ainda.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`p-4 flex ${m.from_me ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.from_me ? "bg-[#1e3a8a] text-white" : "bg-gray-100 text-gray-900"}`}>
                  <p className="text-xs opacity-60 mb-0.5">
                    {m.from_me ? "Você" : (m.contact_name || m.remote_jid.split("@")[0])}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                  <p className="text-[10px] opacity-50 mt-1">{new Date(m.created_at).toLocaleString("pt-BR")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
