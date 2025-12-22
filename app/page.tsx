"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  Car,
  BarChart3,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function HomePage() {
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
            <Link
              href="/oficinas"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Para Oficinas
            </Link>
            <Link
              href="/planos"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Planos
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-blue-600 font-sans font-medium transition-colors"
            >
              Entrar
            </Link>
            <Link href="/auth/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-semibold">
                Começar Grátis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-sans font-semibold mb-8">
              <Zap className="h-4 w-4" />
              Sistema de Gestão + Marketplace de Oficinas
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Transforme sua oficina em um{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                negócio digital
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 font-sans mb-10 leading-relaxed">
              Sistema completo de gestão para oficinas mecânicas. Controle
              clientes, ordens de serviço, estoque, financeiro e muito mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-sans font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Começar Teste Grátis (14 dias)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/oficinas">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-sans font-bold text-lg px-8 py-6 rounded-xl transition-all"
                >
                  Conhecer Funcionalidades
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600 font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Suporte em português</span>
              </div>
            </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/img-01.png"
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

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* Para Quem é o Instauto */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Feito para quem trabalha com carros
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Seja você oficina mecânica ou motorista, temos a solução perfeita
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Para Oficinas */}
            <Link href="/oficinas">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer hover:shadow-xl">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                  Para Oficinas
                </h3>
                <p className="text-gray-700 font-sans mb-6 leading-relaxed">
                  Sistema completo de gestão: clientes, ordens de serviço,
                  estoque, financeiro, agenda, relatórios e muito mais.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-700 font-sans">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>Gestão completa de OS</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-sans">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>Controle de estoque</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-sans">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span>Relatórios financeiros</span>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 font-sans font-bold group-hover:gap-3 gap-2 transition-all">
                  Conhecer sistema
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            {/* Para Motoristas */}
            <div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-gray-200 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-sans font-bold">
                Em breve
              </div>
              <div className="w-16 h-16 bg-gray-400 rounded-xl flex items-center justify-center mb-6 opacity-60">
                <Car className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Para Motoristas
              </h3>
              <p className="text-gray-700 font-sans mb-6 leading-relaxed">
                Marketplace para encontrar oficinas, pedir orçamentos e agendar
                serviços. Tudo em um só lugar.
              </p>
              <div className="space-y-2 mb-6 opacity-60">
                <div className="flex items-center gap-2 text-gray-700 font-sans">
                  <CheckCircle2 className="h-5 w-5 text-gray-600" />
                  <span>Encontre oficinas próximas</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-sans">
                  <CheckCircle2 className="h-5 w-5 text-gray-600" />
                  <span>Peça orçamentos online</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-sans">
                  <CheckCircle2 className="h-5 w-5 text-gray-600" />
                  <span>Agende serviços</span>
                </div>
              </div>
              <div className="flex items-center text-gray-500 font-sans font-bold gap-2">
                Em desenvolvimento
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Comece a usar em 4 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-01.png"
                  alt="Passo 1 - Cadastro"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Cadastre-se
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                Crie sua conta grátis em menos de 2 minutos
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-02.png"
                  alt="Passo 2 - Configure"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Configure
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                Adicione as informações da sua oficina
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-03.png"
                  alt="Passo 3 - Gerencie"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-heading font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Gerencie
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                Cadastre clientes, veículos e ordens de serviço
              </p>
            </div>

            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-04.png"
                  alt="Passo 4 - Cresça"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-900 font-heading font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Cresça
              </h3>
              <p className="text-gray-600 font-sans text-sm">
                Acompanhe relatórios e aumente seu faturamento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Por que escolher o Instauto?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Tecnologia moderna para oficinas que querem crescer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Rápido e Fácil
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Interface intuitiva que qualquer um aprende a usar em minutos.
                Sem complicação.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Seguro e Confiável
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Seus dados protegidos com criptografia de ponta. Backup
                automático diário.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Relatórios Inteligentes
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Acompanhe o desempenho da sua oficina com gráficos e relatórios
                em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas que confiam */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-500 font-sans mb-8 uppercase tracking-wider">
            Empresas que confiam em soluções automotivas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <Image
              src="/images/uber-seeklogo.png"
              alt="Uber"
              width={100}
              height={40}
              className="object-contain h-10 w-auto"
            />
            <Image
              src="/images/rappi-seeklogo.png"
              alt="Rappi"
              width={100}
              height={40}
              className="object-contain h-10 w-auto"
            />
            <Image
              src="/images/mercado-livre-seeklogo.png"
              alt="Mercado Livre"
              width={100}
              height={40}
              className="object-contain h-10 w-auto"
            />
            <Image
              src="/images/mercedes-benz-seeklogo.png"
              alt="Mercedes-Benz"
              width={100}
              height={40}
              className="object-contain h-10 w-auto"
            />
            <Image
              src="/images/scania-seeklogo.png"
              alt="Scania"
              width={100}
              height={40}
              className="object-contain h-10 w-auto"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Pronto para transformar sua oficina?
          </h2>
          <p className="text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Comece seu teste grátis de 14 dias agora. Sem cartão de crédito.
          </p>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
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
                  <Link href="/oficinas" className="hover:text-white transition-colors">
                    Para Oficinas
                  </Link>
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

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
