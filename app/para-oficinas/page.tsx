"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Check,
  X,
  CheckCircle,
  Wrench,
  TrendingUp,
  Users,
  Car,
  FileText,
  Package,
  DollarSign,
  Calendar,
  Brain,
  MessageCircle,
  Shield,
  ChevronDown,
} from "lucide-react";

export default function OficinasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-sans font-semibold mb-6">
                <Wrench className="w-4 h-4" />
                Sistema #1 para Oficinas no Brasil
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                Gestão completa{" "}
                <span className="text-yellow-400">para sua oficina</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-lg md:text-xl text-blue-100 font-sans mb-8 max-w-xl">
                Sistema completo de gestão que organiza sua oficina, aumenta o faturamento e libera seu tempo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-sans font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Começar Teste Grátis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#funcionalidades"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold rounded-xl transition-all backdrop-blur-sm"
                >
                  Ver Funcionalidades
                </a>
              </div>

              {/* Benefícios */}
              <div className="flex flex-wrap gap-6 text-sm text-white/90 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>14 dias grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>

            {/* Imagem */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/images/img-03.png"
                  alt="Mecânico Instauto"
                  width={500}
                  height={500}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  style={{ maxHeight: '450px', width: 'auto', height: 'auto' }}
                  priority
                />
                {/* Badge +40% faturamento - Animação bounce */}
                <div className="absolute -top-4 -left-4 px-4 py-3 bg-white rounded-2xl shadow-xl animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-heading font-bold text-gray-900">+40%</p>
                      <p className="text-sm text-gray-500">Faturamento</p>
                    </div>
                  </div>
                </div>

                {/* Badge +60% clientes - Animação pulse */}
                <div className="absolute top-1/2 -right-8 px-4 py-3 bg-white rounded-2xl shadow-xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xl font-heading font-bold text-gray-900">+60%</p>
                      <p className="text-xs text-gray-500">Clientes</p>
                    </div>
                  </div>
                </div>

                {/* Badge oficinas cadastradas - Animação fade */}
                <div className="absolute -bottom-4 -right-4 px-4 py-3 bg-white rounded-2xl shadow-xl animate-pulse">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-heading font-bold text-gray-900">+500 oficinas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Seção Problema vs Solução */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Você está perdendo dinheiro sem perceber
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Veja como a desorganização está custando caro para sua oficina
            </p>
          </div>

          {/* Comparativo */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Sem Sistema */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900">Sem Sistema</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Planilhas bagunçadas e desatualizadas",
                  "Ordens de serviço perdidas ou esquecidas",
                  "Não sabe quanto está lucrando de verdade",
                  "Estoque descontrolado (falta ou sobra)",
                  "Perde horas organizando papel e caderno",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-700 font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Com Instauto */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200 shadow-lg relative">
              {/* Badge Recomendado */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-green-500 text-white text-sm font-sans font-semibold rounded-full">
                RECOMENDADO
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900">Com Instauto</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Tudo organizado em um só lugar",
                  "Acompanhe todas as OS em tempo real",
                  "Relatórios automáticos de faturamento",
                  "Alertas quando o estoque está baixo",
                  "Economize 10+ horas por semana",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Resolver Agora com 14 Dias Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só sistema
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              8 módulos completos para gerenciar sua oficina do início ao fim
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { 
                icon: Users, 
                title: "Clientes", 
                desc: "Cadastro completo com histórico de serviços realizados",
                colorClass: "bg-blue-100 text-blue-600"
              },
              { 
                icon: Car, 
                title: "Veículos", 
                desc: "Controle de frota com peças, modelo e histórico",
                colorClass: "bg-green-100 text-green-600"
              },
              { 
                icon: FileText, 
                title: "Ordens de Serviço", 
                desc: "Gestão completa das OS com status e valores",
                colorClass: "bg-yellow-100 text-yellow-600"
              },
              { 
                icon: Package, 
                title: "Estoque", 
                desc: "Controle de peças com alertas de reposição",
                colorClass: "bg-purple-100 text-purple-600"
              },
              { 
                icon: DollarSign, 
                title: "Financeiro", 
                desc: "Receitas, despesas e fluxo de caixa em tempo real",
                colorClass: "bg-emerald-100 text-emerald-600"
              },
              { 
                icon: Calendar, 
                title: "Agenda", 
                desc: "Agendamento de serviços e compromissos",
                colorClass: "bg-orange-100 text-orange-600"
              },
              { 
                icon: Brain, 
                title: "Diagnóstico IA", 
                desc: "Inteligência artificial para identificar problemas",
                colorClass: "bg-pink-100 text-pink-600"
              },
              { 
                icon: MessageCircle, 
                title: "WhatsApp", 
                desc: "Integração para enviar mensagens aos clientes",
                colorClass: "bg-teal-100 text-teal-600"
              },
            ].map((item) => (
              <div 
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 group"
              >
                <div className={`w-14 h-14 ${item.colorClass} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 font-sans">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold rounded-xl transition-all"
            >
              Testar Todas as Funcionalidades Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Preços */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Escolha o plano ideal para sua oficina
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Comece grátis ou teste o PRO por 14 dias sem compromisso
            </p>
          </div>

          {/* Cards de Preço */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plano FREE */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all">
              <div className="mb-6">
                <h3 className="text-xl font-heading font-bold text-gray-900">FREE</h3>
                <div className="mt-4">
                  <span className="text-4xl font-heading font-bold text-gray-900">R$ 0</span>
                  <span className="text-gray-500 font-sans">/mês</span>
                </div>
                <p className="text-gray-600 font-sans mt-2">Para testar o marketplace</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  { text: "Dashboard básico", included: true },
                  { text: "Configurações da oficina", included: true },
                  { text: "Marketplace (orçamentos)", included: true },
                  { text: "Perfil público", included: true },
                  { text: "Gestão de clientes", included: false },
                  { text: "Ordens de serviço", included: false },
                  { text: "Estoque e financeiro", included: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {item.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`font-sans ${item.included ? "text-gray-700" : "text-gray-400"}`}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/login"
                className="block w-full py-4 text-center border-2 border-gray-300 text-gray-700 font-sans font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Começar Grátis
              </Link>
            </div>

            {/* Plano PRO */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white relative shadow-2xl scale-105">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 text-sm font-sans font-bold rounded-full">
                ⭐ MAIS POPULAR
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-heading font-bold">PRO</h3>
                <div className="mt-4">
                  <span className="text-4xl font-heading font-bold">R$ 97</span>
                  <span className="text-blue-200 font-sans">/mês</span>
                </div>
                <p className="text-blue-200 font-sans mt-2">Sistema completo + 14 dias grátis</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Tudo do FREE +",
                  "Clientes e veículos ilimitados",
                  "Ordens de serviço ilimitadas",
                  "Controle de estoque completo",
                  "Gestão financeira avançada",
                  "Relatórios e gráficos",
                  "Diagnóstico com IA (GPT-4)",
                  "Integração WhatsApp",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <span className="font-sans">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="/login"
                className="block w-full py-4 text-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-sans font-bold rounded-xl transition-all"
              >
                Começar Teste de 14 Dias 🎉
              </Link>
              
              <p className="text-center text-sm text-blue-200 font-sans mt-4">
                Sem cartão de crédito • Cancele quando quiser
              </p>
            </div>
          </div>

          {/* Garantia */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-gray-900">Garantia de 14 dias — Risco Zero</h4>
                <p className="text-gray-600 font-sans mt-1">
                  Teste o plano PRO por 14 dias sem compromisso. Se não gostar, não paga nada. Simples assim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="py-20 bg-gray-50 relative">
        {/* Pattern sutil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Título */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-gray-600 font-sans">
              Tire suas dúvidas sobre o Instauto
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {[
              {
                q: "Como funciona o teste grátis de 14 dias?",
                a: "Você cria sua conta, tem acesso a TODAS as funcionalidades do plano PRO por 14 dias. Não pedimos cartão de crédito. Se gostar, você escolhe um plano. Se não gostar, sua conta vira FREE automaticamente."
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Não existe fidelidade ou multa. Você pode cancelar seu plano PRO quando quiser, diretamente pelo painel. Sua conta continua ativa como FREE."
              },
              {
                q: "Meus dados ficam seguros?",
                a: "Sim! Usamos criptografia de ponta e servidores seguros. Seus dados são seus e nunca serão compartilhados com terceiros. Fazemos backup automático diariamente."
              },
              {
                q: "Preciso instalar algum programa?",
                a: "Não! O Instauto funciona 100% no navegador (Chrome, Firefox, Safari). Acesse de qualquer computador, tablet ou celular. Também temos app para Android e iOS (em breve)."
              },
              {
                q: "Tem limite de clientes ou ordens de serviço?",
                a: "No plano PRO, não! Você pode cadastrar clientes, veículos e ordens de serviço ilimitados. No plano FREE, você só tem acesso ao marketplace."
              },
              {
                q: "Como funciona o pagamento?",
                a: "Aceitamos PIX, cartão de crédito e boleto. O pagamento é mensal (R$ 97/mês) e você pode cancelar quando quiser. Não existe taxa de adesão."
              },
            ].map((item, i) => (
              <details
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden group"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-heading font-semibold text-gray-900 pr-4">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-gray-600 font-sans">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Decoração */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
            Pronto para organizar sua oficina?
          </h2>
          <p className="text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de oficinas que já transformaram seu negócio com o Instauto
          </p>

          <Link
                href="/login"
            className="inline-flex items-center gap-2 px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-sans font-bold text-lg rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Começar Teste Grátis Agora
            <ArrowRight className="w-6 h-6" />
          </Link>

          {/* Benefícios */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/80 font-sans">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Configuração em 5 minutos
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> 100% seguro
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> Suporte dedicado
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
