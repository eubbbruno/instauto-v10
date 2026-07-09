import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import {
  ArrowRight, Check, X, CheckCircle, Wrench, TrendingUp, Users, Car,
  FileText, Package, DollarSign, Calendar, Brain, MessageCircle, Shield, ChevronDown, Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sistema de Gestão para Oficinas Mecânicas | Instauto",
  description:
    "O sistema completo para sua oficina: clientes, ordens de serviço, estoque, financeiro, agenda e diagnóstico com IA. 14 dias de PRO grátis, sem cartão.",
  alternates: { canonical: "https://www.instauto.com.br/para-oficinas" },
};

const FEATURES = [
  { icon: Users, title: "Clientes", desc: "Cadastro completo com histórico de todos os serviços." },
  { icon: Car, title: "Veículos", desc: "Controle de frota com modelo, peças e histórico." },
  { icon: FileText, title: "Ordens de Serviço", desc: "Gestão das OS com status, valores e PDF profissional." },
  { icon: Package, title: "Estoque", desc: "Controle de peças com alerta de reposição." },
  { icon: DollarSign, title: "Financeiro", desc: "Receitas, despesas e fluxo de caixa em tempo real." },
  { icon: Calendar, title: "Agenda", desc: "Agendamento de serviços e compromissos." },
  { icon: Brain, title: "Diagnóstico IA", desc: "Inteligência artificial para identificar problemas." },
  { icon: MessageCircle, title: "WhatsApp", desc: "Fale com seus clientes direto da plataforma." },
];

const FAQS = [
  { q: "Como funciona o teste grátis de 14 dias?", a: "Você cria sua conta e tem acesso a TODAS as funcionalidades do plano PRO por 14 dias. Não pedimos cartão de crédito. Se gostar, escolhe um plano; se não, sua conta vira FREE automaticamente." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim. Não existe fidelidade nem multa. Você cancela o PRO quando quiser, direto pelo painel, e a conta continua ativa como FREE." },
  { q: "Meus dados ficam seguros?", a: "Sim. Usamos criptografia e servidores seguros, com backup automático diário. Seus dados são seus e nunca são compartilhados com terceiros." },
  { q: "Preciso instalar algum programa?", a: "Não. O Instauto funciona 100% no navegador (Chrome, Firefox, Safari), de qualquer computador, tablet ou celular." },
  { q: "Tem limite de clientes ou ordens de serviço?", a: "No PRO, não! Clientes, veículos e ordens de serviço ilimitados. No FREE você tem acesso ao marketplace de orçamentos." },
  { q: "Como funciona o pagamento?", a: "Aceitamos PIX, cartão e boleto. A assinatura é mensal (R$ 97/mês) e pode ser cancelada quando quiser. Sem taxa de adesão." },
];

export default function ParaOficinasPage() {
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
                  <Wrench className="w-4 h-4 text-brand-yellow" />
                  Sistema #1 para oficinas no Brasil
                </div>

                <h1 className="font-heading text-[2.4rem] sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                  Gestão completa <span className="text-brand-yellow">para sua oficina</span>
                </h1>

                <p className="text-white/55 text-lg mb-8 max-w-xl leading-relaxed">
                  Organize clientes, ordens de serviço, estoque e financeiro num só lugar — e ainda apareça para milhares de motoristas buscando oficina.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
                    Começar teste grátis
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a href="#funcionalidades" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-all">
                    Ver funcionalidades
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                  {["14 dias de PRO grátis", "Sem cartão de crédito", "Cancele quando quiser"].map((t) => (
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
                    alt="Mecânico usando o Instauto"
                    width={500}
                    height={500}
                    className="drop-shadow-2xl"
                    style={{ maxHeight: "450px", width: "auto", height: "auto" }}
                    priority
                  />
                  <div className="absolute -top-3 -left-3 px-4 py-3 bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-brand-yellow/15 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <p className="text-xl font-heading font-black text-navy">+40%</p>
                        <p className="text-xs text-gray-500">Faturamento</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-3 -right-3 px-4 py-3 bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-brand-yellow fill-brand-yellow" />
                      <span className="text-sm font-heading font-bold text-navy">+500 oficinas</span>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Faixa de métricas */}
      <section className="bg-navy border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { n: "+500", l: "Oficinas ativas" },
              { n: "+40%", l: "Aumento no faturamento" },
              { n: "10h", l: "Economizadas por semana" },
              { n: "14 dias", l: "De PRO grátis" },
            ].map((m) => (
              <div key={m.l}>
                <p className="text-3xl sm:text-4xl font-heading font-black text-brand-yellow mb-1">{m.n}</p>
                <p className="text-sm text-white/50">{m.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problema vs Solução */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-eyebrow text-brand-gold mb-3">O custo da desorganização</p>
            <h2 className="h-section text-navy">Você está perdendo dinheiro sem perceber</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
            <div className="rounded-3xl p-6 sm:p-8 border border-red-100 bg-red-50/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy">Sem sistema</h3>
              </div>
              <ul className="space-y-4">
                {["Planilhas bagunçadas e desatualizadas", "Ordens de serviço perdidas ou esquecidas", "Não sabe quanto lucra de verdade", "Estoque descontrolado (falta ou sobra)", "Horas perdidas com papel e caderno"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl p-6 sm:p-8 border-2 border-navy/10 bg-white shadow-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-yellow text-navy text-xs font-bold rounded-full">
                COM INSTAUTO
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-xl font-heading font-bold text-navy">Com Instauto</h3>
              </div>
              <ul className="space-y-4">
                {["Tudo organizado em um só lugar", "Acompanhe todas as OS em tempo real", "Relatórios automáticos de faturamento", "Alertas quando o estoque está baixo", "Economize 10+ horas por semana"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-16 sm:py-20 bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-eyebrow text-brand-gold mb-3">Tudo em um só lugar</p>
              <h2 className="h-section text-navy">8 módulos para gerenciar sua oficina do início ao fim</h2>
            </div>
          </FadeIn>

          <StaggerContainer>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {FEATURES.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="card-lift h-full bg-white rounded-2xl border border-navy/8 p-6">
                    <div className="w-12 h-12 bg-navy/5 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-navy" />
                    </div>
                    <h3 className="font-heading font-bold text-navy mb-1.5">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Preços */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-eyebrow text-brand-gold mb-3">Planos</p>
              <h2 className="h-section text-navy">Comece grátis ou teste o PRO por 14 dias</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5 sm:gap-8 max-w-4xl mx-auto items-start">
            {/* FREE */}
            <div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8">
              <h3 className="text-xl font-heading font-bold text-navy">FREE</h3>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-heading font-black text-navy">R$ 0</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600 mb-6">Para testar o marketplace</p>
              <ul className="space-y-3 mb-8">
                {[
                  { text: "Perfil público no marketplace", ok: true },
                  { text: "Receber orçamentos", ok: true },
                  { text: "Dashboard básico", ok: true },
                  { text: "Gestão de clientes", ok: false },
                  { text: "Ordens de serviço", ok: false },
                  { text: "Estoque e financeiro", ok: false },
                ].map((it) => (
                  <li key={it.text} className="flex items-center gap-3">
                    {it.ok ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> : <X className="w-5 h-5 text-gray-300 flex-shrink-0" />}
                    <span className={it.ok ? "text-gray-700" : "text-gray-400"}>{it.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/cadastro/oficina" className="block w-full py-3.5 text-center border-2 border-navy/15 text-navy font-semibold rounded-xl hover:bg-navy/5 transition-all">
                Começar grátis
              </Link>
            </div>

            {/* PRO */}
            <div className="rounded-3xl bg-navy p-6 sm:p-8 text-white relative shadow-2xl overflow-hidden">
              <div className="absolute -top-24 -right-16 w-[300px] h-[300px] rounded-full bg-brand-blue/20 blur-[80px] pointer-events-none" />
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow text-navy text-xs font-bold rounded-full mb-4">
                  <Star className="w-3.5 h-3.5 fill-navy" /> MAIS POPULAR
                </div>
                <h3 className="text-xl font-heading font-bold">PRO</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-heading font-black text-brand-yellow">R$ 97</span>
                  <span className="text-white/50">/mês</span>
                </div>
                <p className="text-white/55 mb-6">Sistema completo + 14 dias grátis</p>
                <ul className="space-y-3 mb-8">
                  {["Tudo do FREE, e mais:", "Clientes e veículos ilimitados", "Ordens de serviço ilimitadas", "Controle de estoque completo", "Gestão financeira avançada", "Relatórios e gráficos", "Diagnóstico com IA", "Integração com WhatsApp"].map((item, i) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${i === 0 ? "text-white/30" : "text-brand-yellow"}`} />
                      <span className={i === 0 ? "text-white/50 font-semibold" : "text-white/85"}>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/cadastro/oficina" className="btn-epic block w-full py-3.5 text-center rounded-xl font-bold">
                  Começar teste de 14 dias
                </Link>
                <p className="text-center text-sm text-white/40 mt-4">Sem cartão • Cancele quando quiser</p>
              </div>
            </div>
          </div>

          {/* Garantia */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="bg-[#F8F9FB] border border-navy/8 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-yellow/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-navy">Risco zero por 14 dias</h4>
                <p className="text-gray-600 mt-1">Teste o PRO por 14 dias sem compromisso. Se não gostar, não paga nada. Simples assim.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-[#F8F9FB]">
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

      {/* CTA Final */}
      <section className="band-dark py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.1),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white mb-4">
            Pronto para organizar sua oficina?
          </h2>
          <p className="text-white/55 text-lg mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de oficinas que já transformaram o negócio com o Instauto.
          </p>
          <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center gap-2 px-10 py-5 rounded-xl text-lg font-bold">
            Começar teste grátis agora
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-white/50">
            {["Configuração em 5 minutos", "100% seguro", "Suporte dedicado"].map((t) => (
              <span key={t} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
