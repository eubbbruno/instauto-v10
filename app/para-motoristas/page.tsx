import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  ArrowRight, CheckCircle, Search, FileText, Star, Car, Bell, Clock, ShieldCheck, MapPin, ChevronDown,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Para Motoristas — encontre oficinas de confiança",
  description:
    "Encontre oficinas mecânicas perto de você, compare avaliações, peça orçamentos grátis e organize as manutenções do seu carro. 100% gratuito.",
  alternates: { canonical: "https://www.instauto.com.br/para-motoristas" },
};

const STEPS = [
  { icon: Search, title: "Busque oficinas", desc: "Encontre oficinas na sua cidade e veja avaliações reais de outros motoristas." },
  { icon: FileText, title: "Peça orçamento", desc: "Descreva o problema uma vez e receba orçamentos de várias oficinas." },
  { icon: Star, title: "Escolha a melhor", desc: "Compare preço, prazo e reputação e feche com quem você confia." },
];

const FEATURES = [
  { icon: Star, title: "Oficinas verificadas", desc: "Avaliações reais de quem já usou. Sem furada." },
  { icon: FileText, title: "Orçamentos grátis", desc: "Compare preços sem compromisso, sem sair de casa." },
  { icon: Car, title: "Garagem digital", desc: "Cadastre seus veículos e mantenha tudo organizado." },
  { icon: Bell, title: "Lembretes", desc: "Não esqueça a revisão, a troca de óleo ou o licenciamento." },
  { icon: Clock, title: "Histórico completo", desc: "Todo serviço registrado num só lugar." },
  { icon: ShieldCheck, title: "100% gratuito", desc: "Para motoristas é grátis, sempre." },
];

const FAQS = [
  { q: "O Instauto é gratuito para motoristas?", a: "Sim! Buscar oficinas, pedir orçamentos e usar a garagem digital é 100% gratuito para motoristas." },
  { q: "Como recebo os orçamentos?", a: "Você descreve o serviço uma vez e as oficinas da sua cidade respondem. Você compara e escolhe pelo painel." },
  { q: "As oficinas são confiáveis?", a: "Cada oficina tem perfil com avaliações de motoristas reais, especialidades e dados de contato para você decidir com segurança." },
  { q: "Preciso instalar algo?", a: "Não. Funciona no navegador do celular ou computador. Basta criar sua conta gratuita." },
];

export default function ParaMotoristasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="band-dark pt-28 pb-16 sm:pb-20 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-blue/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-brand-yellow/8 blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn>
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/6 ring-1 ring-white/12 rounded-full text-sm font-semibold mb-6">
                  <Car className="w-4 h-4 text-brand-yellow" />
                  Grátis para motoristas
                </div>

                <h1 className="font-heading text-[2.4rem] sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                  Cuide do seu carro <span className="text-brand-yellow">sem dor de cabeça</span>
                </h1>

                <p className="text-white/55 text-lg mb-8 max-w-xl leading-relaxed">
                  Encontre oficinas de confiança, peça orçamentos grátis e organize as manutenções do seu veículo — tudo num só lugar.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/cadastro/motorista" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
                    Criar conta grátis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link href="/buscar-oficinas" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all">
                    Buscar oficinas
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                  {["100% gratuito", "Sem compromisso", "Oficinas verificadas"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="hidden lg:flex justify-center items-center">
                <div className="relative">
                  <Image
                    src="/images/img-03.png"
                    alt="Motorista usando o Instauto"
                    width={500}
                    height={500}
                    className="drop-shadow-2xl"
                    style={{ maxHeight: "450px", width: "auto", height: "auto" }}
                    priority
                  />
                  <div className="absolute -bottom-3 -left-3 px-4 py-3 bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-blue" />
                      <span className="text-sm font-heading font-bold text-navy">Oficinas perto de você</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-eyebrow text-brand-gold mb-3">Como funciona</p>
            <h2 className="h-section text-navy">Do problema ao conserto em 3 passos</h2>
          </div>
          <StaggerContainer>
            <div className="grid md:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <StaggerItem key={s.title}>
                  <div className="card-lift h-full bg-white rounded-2xl border border-navy/8 p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center">
                        <s.icon className="w-5 h-5 text-navy" />
                      </div>
                      <span className="text-2xl font-heading font-black text-brand-yellow">{i + 1}</span>
                    </div>
                    <h3 className="font-heading font-bold text-navy mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 sm:py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-eyebrow text-brand-gold mb-3">Tudo que você precisa</p>
            <h2 className="h-section text-navy">Seu carro sempre em dia</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {FEATURES.map((item) => (
              <div key={item.title} className="card-lift h-full bg-white rounded-2xl border border-navy/8 p-6">
                <div className="w-12 h-12 bg-brand-yellow/15 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="font-heading font-bold text-navy mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-eyebrow text-brand-gold mb-3">Dúvidas</p>
            <h2 className="h-section text-navy">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((item) => (
              <details key={item.q} className="bg-white rounded-2xl border border-navy/8 overflow-hidden group">
                <summary className="flex items-center justify-between p-5 sm:p-6 cursor-pointer hover:bg-navy/[0.02] transition-colors">
                  <span className="font-heading font-semibold text-navy pr-4">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 sm:px-6 pb-6 text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="band-dark py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.1),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white mb-4">
            Comece a cuidar do seu carro hoje
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-2xl mx-auto">
            Crie sua conta gratuita e encontre a oficina certa em minutos.
          </p>
          <Link href="/cadastro/motorista" className="btn-epic inline-flex items-center gap-2 px-10 py-5 rounded-xl text-lg font-bold">
            Criar conta grátis
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
