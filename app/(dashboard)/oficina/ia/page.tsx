"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import PlanGuard from "@/components/auth/PlanGuard";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2, Sparkles, Bot, Clock, BookOpen, MessageSquare, Save, Info,
} from "lucide-react";

export default function IAConfigPage() {
  return (
    <PlanGuard feature="Assistente de IA">
      <IAConfigContent />
    </PlanGuard>
  );
}

const PERSONA_PRESETS = [
  { label: "Cordial e próximo", value: "cordial, amigável e próximo do cliente, usando linguagem simples" },
  { label: "Profissional e objetivo", value: "profissional, objetivo e direto ao ponto" },
  { label: "Consultivo", value: "consultivo e explicativo, ajudando o cliente a entender o problema" },
];

function IAConfigContent() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [autoreply, setAutoreply] = useState(false);
  const [persona, setPersona] = useState("");
  const [hours, setHours] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (profile?.id) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const init = async () => {
    setLoading(true);
    const ws = await resolveWorkshop(supabase, profile?.id);
    if (ws) {
      setWorkshopId(ws.id);
      try {
        const res = await fetch(`/api/whatsapp/settings?workshopId=${ws.id}`);
        const data = await res.json();
        setAutoreply(!!data.aiAutoreply);
        setPersona(data.aiPersona || "");
        setHours(data.aiBusinessHours || "");
        setInstructions(data.aiInstructions || "");
      } catch {}
    }
    setLoading(false);
  };

  const save = async () => {
    if (!workshopId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workshopId,
          aiPersona: persona,
          aiBusinessHours: hours,
          aiInstructions: instructions,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Configuração salva!", description: "A IA vai usar essas informações nas respostas." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Erro", description: e.message });
    } finally {
      setSaving(false);
    }
  };

  const toggleAutoreply = async () => {
    if (!workshopId) return;
    const next = !autoreply;
    setAutoreply(next);
    try {
      const res = await fetch("/api/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, aiAutoreply: next }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({
        title: next ? "Resposta automática ativada" : "Resposta automática desativada",
        description: next ? "A IA vai responder novas mensagens do WhatsApp." : undefined,
      });
    } catch (e: any) {
      setAutoreply(!next);
      toast({ variant: "destructive", title: "Erro", description: e.message });
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / Assistente IA</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Assistente de IA</h1>
        <p className="text-sm text-gray-600 mt-1">
          Ensine a IA sobre a sua oficina para ela responder os clientes no WhatsApp com precisão.
        </p>
      </div>

      {/* Banner de destaque */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1120] via-[#13224a] to-[#1e3a8a] p-6 text-white shadow-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">Como funciona</h2>
            <p className="text-white/70 text-sm mt-1 leading-relaxed">
              A IA usa os dados da sua oficina (nome, endereço, especialidades) + o que você definir aqui
              para responder automaticamente. Ela nunca inventa preços — quando precisa de você, avisa o cliente
              que um atendente vai dar sequência. Tudo dentro da sua cota mensal do plano.
            </p>
          </div>
        </div>
      </div>

      {/* Resposta automática */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${autoreply ? "bg-green-100" : "bg-gray-100"}`}>
            <MessageSquare className={`w-5 h-5 ${autoreply ? "text-green-600" : "text-gray-400"}`} />
          </div>
          <div>
            <p className="font-bold text-gray-900">Resposta automática no WhatsApp</p>
            <p className="text-sm text-gray-500">Quando ativado, a IA responde novas mensagens sozinha.</p>
          </div>
        </div>
        <button
          onClick={toggleAutoreply}
          role="switch"
          aria-checked={autoreply}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${autoreply ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${autoreply ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>

      {/* Comportamento (persona) */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1e3a8a]" />
          <h2 className="font-bold text-gray-900">Comportamento da IA</h2>
        </div>
        <p className="text-sm text-gray-500 -mt-2">Como a IA deve conversar com o cliente.</p>
        <div className="flex flex-wrap gap-2">
          {PERSONA_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setPersona(p.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                persona === p.value
                  ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <textarea
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          rows={2}
          placeholder="Ex.: cordial, amigável e objetivo, tratando o cliente pelo nome quando possível."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent resize-none text-sm"
        />
      </div>

      {/* Horário */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#1e3a8a]" />
          <h2 className="font-bold text-gray-900">Horário de atendimento</h2>
        </div>
        <input
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Ex.: Seg a Sex 8h–18h, Sáb 8h–12h. Fechado aos domingos."
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent text-sm"
        />
      </div>

      {/* Base de conhecimento */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#1e3a8a]" />
          <h2 className="font-bold text-gray-900">Base de conhecimento</h2>
        </div>
        <p className="text-sm text-gray-500 -mt-1">
          Escreva o que a IA precisa saber para responder: serviços que faz, formas de pagamento,
          política de garantia, se busca o carro, tempo médio de serviços, etc.
        </p>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={8}
          placeholder={`Ex.:
- Fazemos troca de óleo, freios, suspensão, revisão e injeção eletrônica.
- Formas de pagamento: Pix, cartão em até 3x sem juros, dinheiro.
- Damos 90 dias de garantia nos serviços.
- Troca de óleo leva cerca de 40 minutos.
- Não trabalhamos com funilaria/pintura.`}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent resize-none text-sm leading-relaxed"
        />
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Quanto mais completo, melhor a IA responde. Ela não vai inventar nada além do que estiver aqui.</span>
        </div>
      </div>

      {/* Salvar */}
      <div className="flex justify-end sticky bottom-4">
        <button
          onClick={save}
          disabled={saving}
          className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold disabled:opacity-60 shadow-lg"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar configuração
        </button>
      </div>
    </div>
  );
}
