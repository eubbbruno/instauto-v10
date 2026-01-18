"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  FileText,
  Calendar,
  Star,
  MapPin,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";

export default function MotoristasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-sans font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                Plataforma #1 para Motoristas
              </div>

              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Encontre a oficina ideal para seu veículo
              </h1>

              <p className="text-xl md:text-2xl text-blue-100 font-sans mb-8 leading-relaxed">
                Marketplace que conecta motoristas a oficinas de confiança. 
                Compare preços, agende serviços e avalie.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/cadastro-motorista">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all w-full sm:w-auto"
                  >
                    Cadastrar Grátis
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
                  <span>100% gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Oficinas verificadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400" />
                  <span>Avaliações reais</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative max-w-md">
                <Image
                  src="/images/car-3d.png"
                  alt="Carro 3D"
                  width={350}
                  height={350}
                  className="object-contain drop-shadow-2xl w-full h-auto"
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
              Como vai funcionar?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Simples, rápido e sem burocracia
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-2xl">
                1
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Busque oficinas
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Encontre oficinas próximas a você ou especializadas no seu tipo de veículo
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-2xl">
                2
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Peça orçamentos
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Descreva o problema e receba orçamentos de várias oficinas
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-heading font-bold text-2xl">
                3
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Agende o serviço
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Escolha a melhor oferta e agende direto pelo app
              </p>
            </div>

            {/* Passo 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-900 font-heading font-bold text-2xl">
                4
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                Avalie
              </h3>
              <p className="text-gray-600 font-sans text-sm leading-relaxed">
                Após o serviço, avalie a oficina e ajude outros motoristas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Recursos pensados para facilitar sua vida
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Busca por localização
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Encontre oficinas próximas a você com mapa interativo e filtros 
                por distância, especialidade e avaliação.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Orçamentos online
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Receba múltiplos orçamentos sem sair de casa. Compare preços, 
                prazos e escolha a melhor opção.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Avaliações verificadas
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Leia avaliações reais de outros motoristas e tome decisões 
                informadas sobre onde levar seu veículo.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Agendamento fácil
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Agende serviços direto pelo app. Receba lembretes e 
                acompanhe o status em tempo real.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Histórico completo
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Mantenha todo o histórico de manutenção do seu veículo 
                organizado em um só lugar.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Garantia de qualidade
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Todas as oficinas são verificadas e avaliadas. Seu veículo 
                em boas mãos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Veículos */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Para todos os tipos de veículos
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Carros, motos, caminhões e muito mais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border-2 border-blue-200 group-hover:border-blue-400 transition-all mb-4">
                <Image
                  src="/images/car-3d.png"
                  alt="Carros"
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900">
                Carros
              </h3>
              <p className="text-gray-600 font-sans text-sm mt-2">
                Passeio, SUV, esportivos
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border-2 border-green-200 group-hover:border-green-400 transition-all mb-4">
                <Image
                  src="/images/moto-3d.png"
                  alt="Motos"
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900">
                Motos
              </h3>
              <p className="text-gray-600 font-sans text-sm mt-2">
                Urbanas, esportivas, custom
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border-2 border-yellow-200 group-hover:border-yellow-400 transition-all mb-4">
                <Image
                  src="/images/truck-3d.png"
                  alt="Caminhões"
                  width={200}
                  height={200}
                  className="object-contain mx-auto"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900">
                Caminhões
              </h3>
              <p className="text-gray-600 font-sans text-sm mt-2">
                Leves, médios, pesados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Cadastre-se grátis e comece a gerenciar seus veículos e manutenções hoje mesmo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/cadastro-motorista">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
              >
                Cadastrar Grátis Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-blue-100 font-sans">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Cadastro em 2 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>100% seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Sempre gratuito</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

