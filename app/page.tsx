"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressAutocomplete from "@/components/search/AddressAutocomplete";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  Car,
  BarChart3,
  Shield,
  Zap,
  Users,
  MapPin,
  Star,
  Check,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocation) {
      router.push(`/buscar-oficinas?location=${encodeURIComponent(selectedLocation)}`);
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Busca de Oficinas */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div className="text-white">
              {/* Badge com animação */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-sans font-semibold mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Mais de 500 oficinas cadastradas
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
                Encontre a melhor{" "}
                <span className="text-yellow-400">oficina mecânica</span>{" "}
                perto de você
              </h1>

              {/* Subtítulo */}
              <p className="text-lg md:text-xl text-blue-100 font-sans mb-8 max-w-xl">
                Solicite orçamentos grátis, compare preços e avaliações de oficinas confiáveis na sua região.
              </p>

              {/* CAMPO DE BUSCA - PRINCIPAL */}
              <div className="bg-white rounded-2xl shadow-2xl p-2 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <AddressAutocomplete onSelect={setSelectedLocation} />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-sans font-bold rounded-xl transition-all hover:shadow-lg hover:scale-[1.02]"
                  >
                    Buscar Oficinas
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* Badges de benefícios */}
              <div className="flex flex-wrap gap-6 text-sm text-white/90 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>100% Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span>Orçamento em minutos</span>
                </div>
              </div>
            </div>

            {/* Imagem 3D com elementos decorativos */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative">
                <Image
                  src="/images/img-01.png"
                  alt="Mecânico Instauto"
                  width={500}
                  height={500}
                  className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  style={{ maxHeight: '450px', width: 'auto', height: 'auto' }}
                  priority
                />
                {/* Badge de avaliação flutuante */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <Star className="w-10 h-10 text-gray-900" fill="currentColor" />
                </div>
                {/* Badge de usuários */}
                <div className="absolute -bottom-4 -right-4 px-4 py-2 bg-white rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white" />
                      <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white" />
                      <div className="w-8 h-8 bg-yellow-500 rounded-full border-2 border-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">+2.500 usuários</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave no final */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Tipos de Veículos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Oficinas para todos os tipos de veículos
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Carros, motos, caminhões e mais. Encontre especialistas para cada tipo de manutenção automotiva.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Carros */}
            <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/car-3d.png"
                  alt="Oficina Mecânica para Carros"
                  width={150}
                  height={150}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                  style={{ maxHeight: '120px', width: 'auto', height: 'auto' }}
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 text-center">
                Carros
              </h3>
              <p className="text-gray-600 font-sans text-sm text-center">
                Manutenção preventiva, troca de óleo, freios, suspensão e muito mais
              </p>
            </div>

            {/* Motos */}
            <div className="bg-gradient-to-b from-yellow-50 to-white p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/moto-3d.png"
                  alt="Oficina Mecânica para Motos"
                  width={150}
                  height={150}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 text-center">
                Motos
              </h3>
              <p className="text-gray-600 font-sans text-sm text-center">
                Revisão completa, troca de corrente, pneus e serviços especializados
              </p>
            </div>

            {/* Caminhões */}
            <div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/truck-3d.png"
                  alt="Oficina Mecânica para Caminhões"
                  width={150}
                  height={150}
                  className="object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 text-center">
                Caminhões
              </h3>
              <p className="text-gray-600 font-sans text-sm text-center">
                Manutenção pesada, motor, transmissão e serviços para frotas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Como solicitar orçamento de oficina mecânica?
            </h2>
            <p className="text-xl text-gray-600 font-sans max-w-2xl mx-auto">
              Encontre oficinas mecânicas confiáveis em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Passo 1 */}
            <div className="relative text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-01.png"
                  alt="Buscar oficinas mecânicas próximas"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-400 text-gray-900 font-heading font-bold flex items-center justify-center shadow-lg">
                1
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Busque oficinas próximas
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Digite seu CEP ou endereço e encontre oficinas mecânicas na sua região com avaliações reais de clientes
              </p>
            </div>

            {/* Passo 2 */}
            <div className="relative text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-02.png"
                  alt="Solicitar orçamento de oficina mecânica"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-400 text-gray-900 font-heading font-bold flex items-center justify-center shadow-lg">
                2
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Solicite orçamentos grátis
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Compare preços, serviços oferecidos e avaliações. Peça orçamentos online sem compromisso
              </p>
            </div>

            {/* Passo 3 */}
            <div className="relative text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/passo-03.png"
                  alt="Agendar serviço em oficina mecânica"
                  width={180}
                  height={180}
                  className="object-contain"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-yellow-400 text-gray-900 font-heading font-bold flex items-center justify-center shadow-lg">
                3
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Agende e avalie o serviço
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Escolha a melhor oficina mecânica, agende seu serviço e depois compartilhe sua experiência
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher o Instauto */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Por que escolher o Instauto?
            </h2>
            <p className="text-lg text-gray-600 font-sans max-w-2xl mx-auto">
              Tecnologia moderna para encontrar as melhores oficinas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                Rápido e Fácil
              </h3>
              <p className="text-gray-600 font-sans leading-relaxed">
                Encontre oficinas em segundos. Interface simples e intuitiva para solicitar orçamentos sem complicação.
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

      {/* Empresas Parceiras */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            Empresas que confiam em soluções automotivas
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { src: "/images/uber-seeklogo.png", alt: "Uber" },
              { src: "/images/rappi-seeklogo.png", alt: "Rappi" },
              { src: "/images/mercado-livre-seeklogo.png", alt: "Mercado Livre" },
              { src: "/images/mercedes-benz-seeklogo.png", alt: "Mercedes-Benz" },
              { src: "/images/scania-seeklogo.png", alt: "Scania" },
              { src: "/images/volvo-seeklogo.png", alt: "Volvo" },
              { src: "/images/localiza-seeklogo.png", alt: "Localiza" },
              { src: "/images/unidas-rent-a-car-seeklogo.png", alt: "Unidas" },
              { src: "/images/correios-seeklogo.png", alt: "Correios" },
            ].map((logo) => (
              <div key={logo.alt} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa do Brasil */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Presente em todo o Brasil
              </h2>
              <p className="text-blue-100 text-lg mb-10">
                Oficinas de norte a sul do país já confiam no Instauto para gerenciar seus negócios e aumentar o faturamento.
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
            {/* Mapa */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <Image
                  src="/images/brazil-map.png"
                  alt="Mapa do Brasil"
                  width={450}
                  height={500}
                  className="opacity-90"
                />
                {/* Pontos pulsando nas cidades */}
                <div className="absolute top-[30%] left-[60%] w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute top-[45%] left-[65%] w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-[55%] left-[55%] w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[70%] left-[50%] w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-[75%] left-[45%] w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA para Oficinas */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Decoração */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-yellow-400 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 rounded-full text-yellow-400 text-sm font-medium mb-6">
                <Wrench className="w-4 h-4" />
                Para Oficinas Mecânicas
              </div>
              
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                Você é dono de oficina mecânica?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Tenha um sistema completo de gestão e apareça no marketplace para milhares de motoristas. Aumente seu faturamento com tecnologia.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/para-oficinas"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all"
                >
                  Conhecer Sistema
                </Link>
                <Link
                  href="/cadastro-oficina"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition-all"
                >
                  Começar Teste Grátis (14 dias)
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              
              {/* Benefícios */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" /> Sem cartão de crédito
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" /> Cancele quando quiser
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" /> Suporte dedicado
                </span>
              </div>
            </div>
            
            {/* Imagem */}
            <div className="hidden lg:flex justify-center">
              <Image
                src="/images/img-03.png"
                alt="Mecânico"
                width={400}
                height={400}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
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
