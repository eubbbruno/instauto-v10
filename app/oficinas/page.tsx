"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  Users,
  Car,
  Package,
  DollarSign,
  Calendar,
  BarChart3,
  MessageSquare,
  Brain,
  FileText,
  X,
  Sparkles,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

export default function OficinasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm bg-white/90">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-of-dark.svg"
              alt="Instauto"
              width={150}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#funcionalidades"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Funcionalidades
            </a>
            <a
              href="#planos"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Planos
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-semibold">
                Teste Grátis (14 dias)
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Link href="/auth/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Começar
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-sans font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                Sistema #1 para Oficinas no Brasil
              </div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Pare de perder tempo com planilhas
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 font-sans mb-8 leading-relaxed">
                Sistema completo de gestão que organiza sua oficina, aumenta o
                faturamento e libera seu tempo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                  >
                    Começar Teste Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <a href="#funcionalidades">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100 font-sans font-bold text-lg px-8 py-6 rounded-xl transition-all w-full sm:w-auto shadow-lg"
                  >
                    Ver Funcionalidades
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-blue-100 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>14 dias grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/images/img-02.png"
                  alt="Mecânico Instauto"
                  width={500}
                  height={500}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Problema → Solução */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
                Você está perdendo dinheiro sem perceber
              </h2>
              <p className="text-xl text-gray-600 font-sans">
                Veja como a desorganização está custando caro
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Problemas */}
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold text-red-600 mb-6 flex items-center gap-2">
                  <X className="h-6 w-6" />
                  Sem Sistema
                </h3>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    📋 Planilhas bagunçadas e desatualizadas
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    😰 Ordens de serviço perdidas ou esquecidas
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    💸 Não sabe quanto está lucrando de verdade
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    📦 Estoque descontrolado (falta ou sobra)
                  </p>
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ⏰ Perde horas organizando papel e caderno
                  </p>
                </div>
              </div>

              {/* Soluções */}
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-bold text-green-600 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  Com Instauto
                </h3>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ✅ Tudo organizado em um só lugar
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ✅ Acompanhe todas as OS em tempo real
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ✅ Relatórios automáticos de faturamento
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ✅ Alertas quando o estoque está baixo
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <p className="text-gray-800 font-sans">
                    ✅ Economize 10+ horas por semana
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-lg"
                >
                  Resolver Agora com 14 Dias Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só sistema
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              8 módulos completos para gerenciar sua oficina do início ao fim
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Clientes
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Cadastro completo com histórico de serviços e veículos
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Veículos
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Controle de frota com placa, modelo, ano e km rodados
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Ordens de Serviço
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Gestão completa de OS com status e valores
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Estoque
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Controle de peças com alertas de reposição
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Financeiro
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Receitas, despesas e fluxo de caixa em tempo real
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Agenda
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Agendamento de serviços e compromissos
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 relative">
              <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2 py-1 rounded-full text-xs font-sans font-bold">
                IA
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Diagnóstico IA
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Inteligência artificial para diagnosticar problemas
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                WhatsApp
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Integração para enviar mensagens aos clientes
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-lg"
              >
                Testar Todas as Funcionalidades Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparativo FREE vs PRO */}
      <section id="planos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Escolha o plano ideal para sua oficina
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Comece grátis ou teste o PRO por 14 dias sem compromisso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Plano FREE */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                  FREE
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-heading font-bold text-gray-900">
                    R$ 0
                  </span>
                  <span className="text-gray-600 font-sans">/mês</span>
                </div>
                <p className="text-gray-600 font-sans">
                  Para testar o marketplace
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Dashboard básico
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Configurações da oficina
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Marketplace (orçamentos)
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Sistema de gestão completo
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Clientes e veículos ilimitados
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Ordens de serviço ilimitadas
                  </span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-sans font-bold py-6 rounded-xl"
                >
                  Começar Grátis
                </Button>
              </Link>
            </div>

            {/* Plano PRO */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-600 rounded-2xl p-8 relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-sans font-bold shadow-lg">
                MAIS POPULAR
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  PRO
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-heading font-bold text-white">
                    R$ 97
                  </span>
                  <span className="text-blue-200 font-sans">/mês</span>
                </div>
                <p className="text-blue-100 font-sans">
                  Sistema completo + 14 dias grátis
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Tudo do FREE</strong> +
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Clientes e veículos <strong>ilimitados</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Ordens de serviço <strong>ilimitadas</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Controle de estoque completo
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Gestão financeira avançada
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Relatórios e gráficos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Diagnóstico com IA (GPT-4)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Integração WhatsApp
                  </span>
                </li>
              </ul>

              <Link href="/auth/register">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold py-6 rounded-xl shadow-xl text-lg">
                  Começar Teste de 14 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="text-center text-blue-100 text-sm font-sans mt-4">
                Sem cartão de crédito • Cancele quando quiser
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-heading font-bold text-gray-900 mb-2">
                    Garantia de 14 dias - Risco Zero
                  </h4>
                  <p className="text-gray-700 font-sans leading-relaxed">
                    Teste o plano PRO por 14 dias sem compromisso. Se não gostar,
                    não paga nada. Simples assim.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600 font-sans">
              Tire suas dúvidas sobre o Instauto
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Como funciona o teste grátis de 14 dias?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                Você se cadastra e tem acesso completo ao plano PRO por 14 dias.
                Não precisa cadastrar cartão de crédito. Após o período, você
                escolhe se quer continuar no PRO (R$ 97/mês) ou usar o plano FREE
                para sempre.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Posso cancelar a qualquer momento?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                Sim! Não há fidelidade. Você pode cancelar quando quiser e
                continuar usando o plano FREE. Seus dados ficam salvos.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Meus dados ficam seguros?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                Totalmente! Usamos criptografia de ponta e fazemos backup
                automático diário. Seus dados estão protegidos em servidores
                seguros.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Preciso instalar algum programa?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                Não! O Instauto funciona 100% online. Acesse de qualquer
                computador, tablet ou celular com internet.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Tem limite de clientes ou ordens de serviço?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                No plano PRO, não! Você pode cadastrar quantos clientes, veículos
                e ordens de serviço quiser. Sem limites.
              </p>
            </details>

            <details className="bg-white p-6 rounded-xl shadow-sm group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                Como funciona o pagamento?
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed">
                Após o período de teste, você paga R$ 97/mês via PIX ou cartão de
                crédito através do MercadoPago. A cobrança é automática e você
                recebe recibo por e-mail.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Pronto para organizar sua oficina?
          </h2>
          <p className="text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de oficinas que já transformaram seu negócio com
            o Instauto
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                Começar Teste Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-blue-100 font-sans">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Configuração em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Suporte rápido</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <Image
                  src="/images/logo.svg"
                  alt="Instauto"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-sm font-sans">
                Sistema completo de gestão para oficinas mecânicas.
              </p>
            </div>

            <div>
              <h4 className="text-white font-sans font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>
                  <a href="#funcionalidades" className="hover:text-white transition-colors">
                    Funcionalidades
                  </a>
                </li>
                <li>
                  <Link href="/planos" className="hover:text-white transition-colors">
                    Planos e Preços
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-sans font-bold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-sans font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm font-sans">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm font-sans">
            <p>© 2024 Instauto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

