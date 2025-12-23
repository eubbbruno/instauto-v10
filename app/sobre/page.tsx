"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Target,
  Heart,
  Zap,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
              Sobre o Instauto
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-sans leading-relaxed">
              Nascemos para revolucionar a gestão de oficinas mecânicas no Brasil
            </p>
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

      {/* Nossa História */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-xl text-gray-600 font-sans leading-relaxed">
                Tudo começou com um problema real
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 font-sans text-lg leading-relaxed mb-6">
                Em 2023, após anos trabalhando com oficinas mecânicas e observando as dificuldades 
                do dia a dia, percebemos que a maioria dos donos de oficina perdiam horas organizando 
                planilhas, cadernos e papéis. Muitos não sabiam exatamente quanto estavam lucrando, 
                perdiam ordens de serviço e tinham dificuldade em controlar o estoque.
              </p>

              <p className="text-gray-700 font-sans text-lg leading-relaxed mb-6">
                Foi aí que nasceu o <strong className="text-blue-600">Instauto</strong>: um sistema 
                completo de gestão pensado especialmente para oficinas mecânicas brasileiras. Nossa 
                missão é simples: <strong>organizar, automatizar e aumentar o faturamento</strong> 
                das oficinas através da tecnologia.
              </p>

              <p className="text-gray-700 font-sans text-lg leading-relaxed mb-6">
                Hoje, centenas de oficinas em todo o Brasil já confiam no Instauto para gerenciar 
                seus negócios. E estamos apenas começando.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Missão */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Missão
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Transformar a gestão de oficinas mecânicas através da tecnologia, 
                tornando-as mais organizadas, lucrativas e profissionais.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Visão
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Ser o sistema #1 de gestão para oficinas mecânicas no Brasil, 
                presente em todas as regiões do país.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Valores
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Simplicidade, inovação, transparência e foco total no sucesso 
                dos nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Instauto em Números
            </h2>
            <p className="text-xl text-gray-600 font-sans">
              Crescendo junto com nossos clientes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-blue-600 mb-3">
                500+
              </div>
              <p className="text-gray-700 font-sans text-lg">
                Oficinas ativas
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-blue-600 mb-3">
                50k+
              </div>
              <p className="text-gray-700 font-sans text-lg">
                Ordens de serviço
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-blue-600 mb-3">
                15
              </div>
              <p className="text-gray-700 font-sans text-lg">
                Estados brasileiros
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold text-blue-600 mb-3">
                98%
              </div>
              <p className="text-gray-700 font-sans text-lg">
                Satisfação dos clientes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher o Instauto */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Por que escolher o Instauto?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Somos diferentes porque entendemos o seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Feito para oficinas brasileiras
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Desenvolvido pensando nas necessidades reais das oficinas do Brasil, 
                com suporte em português e funcionalidades específicas para o mercado nacional.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Suporte humanizado
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Nossa equipe está sempre disponível para ajudar. Respondemos rápido e 
                falamos a sua língua, sem complicação.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Sempre evoluindo
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed">
                Lançamos novos recursos constantemente baseados no feedback dos nossos 
                clientes. Seu sucesso é o nosso sucesso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
            Faça parte da nossa história
          </h2>
          <p className="text-xl text-blue-100 font-sans mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de oficinas que já transformaram seus negócios com o Instauto
          </p>

          <Link href="/cadastro">
            <Button
              size="lg"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold text-lg px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Começar Teste Grátis de 14 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

