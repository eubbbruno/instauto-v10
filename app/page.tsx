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
  Car,
  BarChart3,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Busca de Oficinas */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-sans font-semibold mb-6">
                <Car className="h-4 w-4" />
                Encontre a Oficina Perfeita
              </div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Oficinas de confiança{" "}
                <span className="text-yellow-400">
                  perto de você
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 font-sans mb-8 leading-relaxed">
                Compare preços, veja avaliações e agende serviços nas melhores oficinas da sua região.
              </p>

              {/* Campo de Busca */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
                <form action="/buscar-oficinas" method="GET" className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📍 Onde você está?
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Digite seu CEP, cidade ou bairro"
                      className="w-full px-4 py-4 text-gray-900 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none text-lg"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Buscar Oficinas Próximas
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-blue-100 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>100% Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Avaliações Reais</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Compare Preços</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/images/img-01.png"
                  alt="Encontre Oficinas"
                  width={400}
                  height={400}
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

      {/* Como Funciona */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Como funciona?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Encontre a oficina ideal em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-2xl">
                1
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Busque oficinas
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Digite seu endereço e encontre oficinas próximas com avaliações reais
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-2xl">
                2
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Compare preços
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Veja avaliações, serviços oferecidos e peça orçamentos online
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900 font-heading font-bold text-2xl">
                3
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Agende e avalie
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Escolha a melhor opção e depois avalie o serviço prestado
              </p>
            </div>
          </div>

          {/* CTA para Oficinas */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 font-sans mb-4">Você é dono de oficina?</p>
            <Link href="/oficinas">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-sans font-bold text-lg px-8 py-4 rounded-xl transition-all"
              >
                <Wrench className="mr-2 h-5 w-5" />
                Conheça o Sistema para Oficinas
              </Button>
            </Link>
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
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all">
            <Image
              src="/images/uber-seeklogo.png"
              alt="Uber"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/rappi-seeklogo.png"
              alt="Rappi"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/mercado-livre-seeklogo.png"
              alt="Mercado Livre"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/mercedes-benz-seeklogo.png"
              alt="Mercedes-Benz"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/scania-seeklogo.png"
              alt="Scania"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/volvo-seeklogo.png"
              alt="Volvo"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/localiza-seeklogo.png"
              alt="Localiza"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/unidas-rent-a-car-seeklogo.png"
              alt="Unidas"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
            <Image
              src="/images/correios-seeklogo.png"
              alt="Correios"
              width={100}
              height={40}
              className="object-contain h-8 md:h-10 w-auto"
            />
          </div>
        </div>
      </section>

      {/* Presente em todo Brasil */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Presente em todo o Brasil
              </h2>
              <p className="text-xl text-gray-600 font-sans mb-8 leading-relaxed">
                Oficinas de norte a sul do país já confiam no Instauto para
                gerenciar seus negócios e aumentar o faturamento.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-4xl font-heading font-bold text-blue-600 mb-2">
                    500+
                  </div>
                  <p className="text-gray-600 font-sans text-sm">
                    Oficinas ativas
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-4xl font-heading font-bold text-blue-600 mb-2">
                    15
                  </div>
                  <p className="text-gray-600 font-sans text-sm">
                    Estados brasileiros
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-4xl font-heading font-bold text-blue-600 mb-2">
                    50k+
                  </div>
                  <p className="text-gray-600 font-sans text-sm">
                    OS gerenciadas
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-4xl font-heading font-bold text-blue-600 mb-2">
                    98%
                  </div>
                  <p className="text-gray-600 font-sans text-sm">
                    Satisfação
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/brazil-map.png"
                alt="Mapa do Brasil - Instauto"
                width={500}
                height={500}
                className="object-contain drop-shadow-2xl"
              />
            </div>
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
          <Link href="/cadastro">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all group"
            >
              Começar Teste Grátis
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />

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
