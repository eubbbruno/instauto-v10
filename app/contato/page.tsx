"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";

const WHATSAPP = "https://wa.me/5543991852779?text=" + encodeURIComponent("Olá! Vim pelo site do Instauto.");

export default function ContatoPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar");
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao enviar. Tente novamente.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="band-dark py-16 sm:py-24 pt-28 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-eyebrow text-brand-gold mb-3">Contato</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">Vamos conversar</h1>
          <p className="text-white/55 text-lg max-w-xl mx-auto">
            Dúvida, sugestão ou parceria? Fale com a gente pelo WhatsApp para resposta rápida, ou mande uma mensagem.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-10 sm:py-16 -mt-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 items-start">
            {/* Coluna esquerda: canais */}
            <FadeIn>
              <div className="space-y-4">
                {/* WhatsApp em destaque */}
                <Link
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-[#25D366] text-white p-5 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Fale no WhatsApp</h3>
                      <p className="text-white/85 text-sm">Resposta mais rápida — (43) 99185-2779</p>
                    </div>
                  </div>
                </Link>

                {/* E-mail */}
                <div className="rounded-2xl border border-navy/8 bg-white p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">E-mail</h3>
                    <a href="mailto:contato@instauto.com.br" className="text-blue-600 hover:underline break-all">
                      contato@instauto.com.br
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Respondemos em até 24h úteis</p>
                  </div>
                </div>

                {/* Telefone */}
                <div className="rounded-2xl border border-navy/8 bg-white p-5 sm:p-6 flex items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5">Telefone</h3>
                    <a href="tel:+5543991852779" className="text-blue-600 hover:underline">(43) 99185-2779</a>
                  </div>
                </div>

                {/* Localização + horário */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-navy/8 bg-white p-5 flex items-start gap-3 shadow-sm">
                    <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5">Onde estamos</h3>
                      <p className="text-gray-600 text-sm">Londrina, Paraná · Brasil</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-navy/8 bg-white p-5 flex items-start gap-3 shadow-sm">
                    <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5">Atendimento</h3>
                      <p className="text-gray-600 text-sm">Seg–Sex 9h–18h · Sáb 9h–13h</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Formulário */}
            <FadeIn delay={0.15}>
              <GlassCard>
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Envie sua mensagem</h3>
                  <p className="text-sm text-gray-500 mb-6">Preencha e a gente responde no seu e-mail.</p>

                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      Mensagem enviada! Responderemos em breve.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
                      <input
                        type="text" required value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail *</label>
                        <input
                          type="email" required value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone</label>
                        <input
                          type="tel" value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Assunto *</label>
                      <select
                        required value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      >
                        <option value="">Selecione um assunto</option>
                        <option value="Dúvida sobre a plataforma">Dúvida sobre a plataforma</option>
                        <option value="Suporte técnico">Suporte técnico</option>
                        <option value="Sou oficina">Sou oficina e quero assinar</option>
                        <option value="Parceria comercial">Parceria comercial</option>
                        <option value="Sugestão">Sugestão</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem *</label>
                      <textarea
                        required rows={5} value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Escreva sua mensagem aqui..."
                      />
                    </div>
                    <button
                      type="submit" disabled={isSubmitting}
                      className="btn-epic-blue w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl min-h-[48px] disabled:opacity-60 font-bold"
                    >
                      {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>) : (<><Send className="w-5 h-5" /> Enviar mensagem</>)}
                    </button>
                  </form>
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
