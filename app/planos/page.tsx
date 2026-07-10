"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  X,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="band-dark pt-32 pb-16 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-yellow/6 blur-[80px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-eyebrow text-brand-gold mb-4">Planos e Preços</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Simples, transparente,<br className="hidden sm:block" /> sem surpresas
            </h1>
            <p className="text-white/55 text-lg font-sans leading-relaxed">
              Comece grátis e escale conforme sua oficina cresce. 14 dias de PRO completo sem cartão.
            </p>
          </div>
        </div>
      </section>

      {/* Comparação de Planos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Plano FREE */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
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
                  Grátis para sempre
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Dashboard básico com visão geral
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Configurações da oficina (perfil, dados)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-sans">
                    Acesso ao marketplace (receber orçamentos)
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
                    Clientes e veículos
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Ordens de serviço
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Estoque e financeiro
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Relatórios e gráficos
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Diagnóstico com IA
                  </span>
                </li>
                <li className="flex items-start gap-3 opacity-40">
                  <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 font-sans line-through">
                    Integração WhatsApp
                  </span>
                </li>
              </ul>

              <Link href="/cadastro/oficina">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:border-navy hover:text-navy font-sans font-bold py-6 rounded-xl"
                >
                  Começar Grátis
                </Button>
              </Link>
            </div>

            {/* Plano PRO */}
            <div className="bg-navy rounded-2xl p-8 relative shadow-2xl transform md:scale-105 overflow-hidden">
              <div className="pointer-events-none absolute -top-24 -right-16 w-[300px] h-[300px] rounded-full bg-brand-blue/20 blur-[80px]" />
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-yellow text-navy px-6 py-2 rounded-full text-sm font-sans font-bold shadow-lg z-10">
                RECOMENDADO
              </div>

              <div className="relative text-center mb-8">
                <h3 className="text-2xl font-heading font-bold text-white mb-2">
                  PRO
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-heading font-bold text-brand-yellow">
                    R$ 97
                  </span>
                  <span className="text-white/50 font-sans">/mês</span>
                </div>
                <p className="text-white/55 font-sans">
                  Sistema completo de gestão
                </p>
              </div>

              <ul className="relative space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Tudo do FREE</strong> +
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Clientes ilimitados</strong> com histórico completo
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Veículos ilimitados</strong> por cliente
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Ordens de serviço ilimitadas</strong> por mês
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Controle de <strong>estoque</strong> com alertas
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Gestão <strong>financeira</strong> completa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Agenda</strong> de compromissos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Relatórios</strong> em PDF com gráficos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    <strong>Diagnóstico IA</strong> com GPT-4
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-white font-sans">
                    Integração <strong>WhatsApp</strong>
                  </span>
                </li>
              </ul>

              <Link href="/cadastro/oficina" className="relative block">
                <Button className="btn-epic w-full font-sans font-bold py-6 rounded-xl text-lg">
                  Começar Teste de 14 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="relative text-center text-white/40 text-sm font-sans mt-4">
                Sem cartão de crédito • Cancele quando quiser
              </p>
            </div>
          </div>

          {/* Garantia */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-heading font-bold text-gray-900 mb-2">
                    Garantia de 14 dias - Risco Zero
                  </h4>
                  <p className="text-gray-700 font-sans leading-relaxed">
                    Teste o plano PRO por 14 dias sem compromisso. Se não gostar,
                    não paga nada. Você pode voltar para o plano FREE a qualquer
                    momento e seus dados ficam salvos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabela Comparativa Detalhada */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Comparação Detalhada
            </h2>
            <p className="text-xl text-gray-600 font-sans">
              Veja tudo que está incluído em cada plano
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-6 font-heading font-bold text-gray-900">
                    Funcionalidade
                  </th>
                  <th className="text-center p-6 font-heading font-bold text-gray-900">
                    FREE
                  </th>
                  <th className="text-center p-6 font-heading font-bold text-blue-600 bg-blue-50">
                    PRO
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="p-6 font-sans text-gray-700">Dashboard</td>
                  <td className="text-center p-6">
                    <span className="text-gray-600 font-sans text-sm">Básico</span>
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <span className="text-blue-600 font-sans font-bold">Completo</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Configurações</td>
                  <td className="text-center p-6">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Marketplace (orçamentos)</td>
                  <td className="text-center p-6">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Clientes</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <span className="text-blue-600 font-sans font-bold">Ilimitado</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Veículos</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <span className="text-blue-600 font-sans font-bold">Ilimitado</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Ordens de Serviço</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <span className="text-blue-600 font-sans font-bold">Ilimitado</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Estoque</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Financeiro</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Agenda</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Relatórios PDF</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Diagnóstico IA (GPT-4)</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">WhatsApp</td>
                  <td className="text-center p-6">
                    <X className="h-5 w-5 text-gray-400 mx-auto" />
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="p-6 font-sans text-gray-700">Suporte</td>
                  <td className="text-center p-6">
                    <span className="text-gray-600 font-sans text-sm">E-mail</span>
                  </td>
                  <td className="text-center p-6 bg-blue-50">
                    <span className="text-blue-600 font-sans font-bold">Prioritário</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-gray-50 p-6 rounded-xl group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Posso mudar de plano depois?
                </span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed ml-8">
                Sim! Você pode fazer upgrade do FREE para o PRO a qualquer momento.
                E também pode cancelar o PRO e voltar para o FREE quando quiser.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  O que acontece após os 14 dias de teste?
                </span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed ml-8">
                Você escolhe se quer continuar no PRO (R$ 97/mês) ou usar o plano
                FREE. Seus dados ficam salvos em qualquer opção.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Como funciona o pagamento do plano PRO?
                </span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed ml-8">
                R$ 97/mês via PIX ou cartão de crédito através do MercadoPago. A
                cobrança é automática e você recebe recibo por e-mail.
              </p>
            </details>

            <details className="bg-gray-50 p-6 rounded-xl group">
              <summary className="font-heading font-bold text-lg text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Posso usar o plano FREE para sempre?
                </span>
                <span className="text-blue-600 group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-4 text-gray-600 font-sans leading-relaxed ml-8">
                Sim! O plano FREE é grátis para sempre. Você pode usá-lo sem
                limite de tempo para acessar o marketplace e gerenciar o perfil da
                sua oficina.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="band-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.1),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/55 font-sans mb-10 max-w-2xl mx-auto">
            Teste o plano PRO por 14 dias sem compromisso
          </p>
          <Link href="/cadastro/oficina">
            <Button
              size="lg"
              className="btn-epic font-sans font-bold text-lg px-10 py-6 rounded-xl"
            >
              Começar Teste Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

