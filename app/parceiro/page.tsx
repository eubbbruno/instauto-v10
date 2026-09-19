"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { trackLead, trackStartSignup } from "@/lib/analytics";
import { Loader2, CheckCircle, Wrench, Sparkles, MessageCircle, Users, Phone, User, MapPin } from "lucide-react";

const WHATSAPP = "5543991852779";

const FEATURES = [
  { icon: Wrench, t: "Gestão completa", d: "Clientes, OS, estoque, financeiro e agenda" },
  { icon: Sparkles, t: "Diagnóstico com IA", d: "Descreva o sintoma e a IA sugere as causas" },
  { icon: MessageCircle, t: "WhatsApp integrado", d: "Atenda seus clientes, com IA opcional" },
  { icon: Users, t: "Novos clientes", d: "Apareça para motoristas da sua região" },
];

export default function ParceiroPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    trackStartSignup("oficina");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Preencha seu nome e WhatsApp");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erro ao enviar");
      trackLead(city);
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Olá! Me chamo ${name || "..."} e quero saber como começar a usar o Instauto na minha oficina${city ? ` (${city})` : ""}.`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#0B1120] to-[#13224a] text-white">
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <Image src="/images/instauto-amarelo-branco.svg" alt="Instauto" width={150} height={40} className="h-9 w-auto" priority />
        </Link>

        {!done ? (
          <>
            {/* Oferta */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/8 ring-1 ring-white/15 px-3 py-1.5 text-xs font-semibold mb-4">
              <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full" />
              14 dias de PRO grátis, sem cartão
            </div>
            <h1 className="font-heading text-[2rem] sm:text-4xl font-black leading-[1.1] tracking-tight mb-3">
              Organize sua oficina e <span className="text-brand-yellow">pare de perder dinheiro</span>
            </h1>
            <p className="text-white/60 text-base mb-6 leading-relaxed">
              Deixe seu contato que a gente te mostra tudo pelo WhatsApp e te ajuda a começar — leva 1 minuto.
            </p>

            {/* Formulário */}
            <form onSubmit={handleSubmit} onFocusCapture={markStarted} className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-3.5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nome da oficina ou seu nome</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Auto Center Silva" required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="(43) 99999-9999" required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cidade</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ex.: Londrina - PR"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-epic py-4 rounded-xl font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Quero começar grátis
              </button>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1">
                {["14 dias grátis", "Sem cartão", "Cancele quando quiser"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" /> {t}
                  </span>
                ))}
              </div>
            </form>

            {/* Benefícios */}
            <div className="grid grid-cols-2 gap-2.5 mt-6">
              {FEATURES.map((f) => (
                <div key={f.t} className="bg-white/5 ring-1 ring-white/10 rounded-2xl p-3.5">
                  <f.icon className="w-5 h-5 text-brand-yellow mb-2" />
                  <p className="font-bold text-sm leading-tight">{f.t}</p>
                  <p className="text-xs text-white/50 mt-1 leading-snug">{f.d}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Sucesso → continuar no WhatsApp (a IA atende automático) */
          <div className="text-center pt-6">
            <div className="w-20 h-20 bg-green-500/15 ring-1 ring-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-heading text-3xl font-black mb-3">Recebemos seu contato! 🎉</h1>
            <p className="text-white/60 mb-8 leading-relaxed">
              Agora é só continuar no <strong className="text-white">WhatsApp</strong> — nosso atendimento responde na hora
              e te ajuda a começar, sem compromisso.
            </p>
            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-bold text-base transition-colors">
              <MessageCircle className="w-5 h-5" />
              Continuar no WhatsApp
            </a>
            <p className="text-white/40 text-xs mt-4">Se preferir, a gente também te chama no número que você deixou.</p>
          </div>
        )}
      </div>
    </div>
  );
}
