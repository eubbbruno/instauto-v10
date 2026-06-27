"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AddressAutocomplete from "@/components/search/AddressAutocomplete";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Reveal } from "@/components/ui/Reveal";
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
  DollarSign,
  Clock,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedState) params.set('estado', selectedState);
    if (city) params.set('cidade', city);
    
    router.push(`/buscar-oficinas?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - Busca de Oficinas */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-yellow-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-24 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <FadeIn>
              <div className="text-navy">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-blue mb-6">
                  <span className="w-2 h-2 bg-brand-gold rounded-full" />
                  Mais de 500 oficinas cadastradas
                </div>

                {/* Título pôster com marca-texto */}
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight mb-5">
                  Encontre a oficina{" "}
                  <span className="marker-underline">certa</span>{" "}
                  perto de você
                </h1>

                <p className="text-lg md:text-xl text-navy/60 mb-8 max-w-xl">
                  Peça orçamentos grátis, compare preços e avaliações de oficinas confiáveis na sua região — em minutos.
                </p>

              {/* CAMPO DE BUSCA - PRINCIPAL com Glassmorphism */}
              <div className="bg-white border border-navy/10 rounded-2xl shadow-xl shadow-navy/5 p-4 mb-6 max-w-2xl">
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Select de Estado */}
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>

                    {/* Input de cidade */}
                    <input
                      type="text"
                      placeholder="Digite a cidade (opcional)"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Botão buscar */}
                  <button
                    type="submit"
                    className="btn-epic-blue w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base"
                  >
                    Buscar Oficinas
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Badges de benefícios */}
              <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-navy/70 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>100% Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span>Orçamento em minutos</span>
                </div>
              </div>
              </div>
            </FadeIn>

            {/* Imagem 3D com elementos decorativos */}
            <FadeIn delay={0.2}>
              <div className="relative mx-auto max-w-sm sm:max-w-md">
                {/* halo suave atrás da foto */}
                <div className="absolute -inset-5 rounded-[2.75rem] bg-gradient-to-tr from-brand-blue/25 to-brand-yellow/30 blur-2xl" />
                <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-navy/10 shadow-2xl">
                  <Image
                    src="/images/mecanico-hero.png"
                    alt="Mecânico parceiro do Instauto em uma oficina"
                    width={1133}
                    height={1416}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* pílula 5,0 */}
                <div className="absolute -top-4 -left-4 z-20 flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 glow-gold animate-float-slow">
                  <Star className="w-5 h-5 text-yellow-900" fill="currentColor" />
                  <span className="font-bold text-yellow-900">5,0</span>
                </div>
                {/* pílula verificada */}
                <div className="absolute -bottom-5 right-4 z-20 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-xl ring-1 ring-navy/5 animate-float">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue" />
                  <span className="text-sm font-bold text-navy">Oficina verificada</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

      </section>

      {/* Prova social honesta (sem implicar parcerias inexistentes) */}
      <section className="border-y border-navy/5 bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="font-heading text-3xl font-extrabold text-navy">+500</p>
            <p className="text-sm text-navy/60">Oficinas cadastradas</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-extrabold text-navy">+2.500</p>
            <p className="text-sm text-navy/60">Motoristas ativos</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-extrabold text-navy">15</p>
            <p className="text-sm text-navy/60">Estados atendidos</p>
          </div>
          <div>
            <p className="font-heading text-3xl font-extrabold text-navy">4,9★</p>
            <p className="text-sm text-navy/60">Avaliação média</p>
          </div>
        </div>
      </section>

      {/* Tipos de Veículos */}
      <section className="py-16 bg-gray-50 relative">
        {/* Pattern sutil */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="container mx-auto px-4 relative">
          <Reveal className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Para cada motor</p>
            <h2 className="h-section text-navy mb-4">
              Especialistas para todo tipo de veículo
            </h2>
            <p className="text-lg text-navy/60 px-4">
              Carro, moto ou caminhão — encontre oficinas que entendem exatamente do que o seu precisa.
            </p>
          </Reveal>

          <Reveal stagger={0.15} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Carros */}
            <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/car-3d.png"
                  alt="Oficina Mecânica para Carros"
                  width={150}
                  height={150}
                  className="object-contain animate-float drop-shadow-2xl"
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
                  className="object-contain animate-float-slow drop-shadow-2xl"
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
                  className="object-contain animate-float-fast drop-shadow-2xl"
                />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2 text-center">
                Caminhões
              </h3>
              <p className="text-gray-600 font-sans text-sm text-center">
                Manutenção pesada, motor, transmissão e serviços para frotas
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <Reveal className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Simples assim</p>
            <h2 className="h-section text-navy mb-4">
              Orçamento de oficina em 3 passos
            </h2>
            <p className="text-lg text-navy/60 px-4">
              Encontre oficinas confiáveis e compare preços sem sair de casa.
            </p>
          </Reveal>

          <Reveal stagger={0.15} className="grid md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Passo 1 */}
            <div className="relative text-center bg-white p-4 sm:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
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
            <div className="relative text-center bg-white p-4 sm:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
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
            <div className="relative text-center bg-white p-4 sm:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
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
          </Reveal>
        </div>
      </section>

      {/* Por que escolher o Instauto */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Por que Instauto</p>
            <h2 className="h-section text-navy mb-4">
              A forma mais fácil de cuidar do seu carro
            </h2>
            <p className="text-lg text-navy/60">
              Tudo num lugar só: ache a oficina certa, peça orçamento e acompanhe seu veículo.
            </p>
          </Reveal>

          <Reveal stagger={0.12} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: DollarSign, tint: "bg-blue-50", ring: "ring-blue-100", ic: "text-brand-blue", title: "Orçamentos grátis", desc: "Peça e compare quantos quiser — sem pagar nada e sem compromisso." },
              { icon: Star, tint: "bg-yellow-50", ring: "ring-yellow-100", ic: "text-brand-gold", title: "Avaliações reais", desc: "Veja nota e comentários de outros motoristas antes de escolher." },
              { icon: Clock, tint: "bg-blue-50", ring: "ring-blue-100", ic: "text-brand-blue", title: "Resposta rápida", desc: "Receba respostas das oficinas direto no seu painel, em minutos." },
              { icon: Car, tint: "bg-yellow-50", ring: "ring-yellow-100", ic: "text-brand-gold", title: "Garagem digital", desc: "Veículos, histórico de manutenção e lembretes num só lugar." },
            ].map((c) => (
              <div key={c.title} className={`card-lift card-pastel ${c.tint} ring-1 ${c.ring} p-6`}>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <c.icon className={`h-7 w-7 ${c.ic}`} />
                </div>
                <h3 className="h-card text-navy mb-2">{c.title}</h3>
                <p className="text-navy/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </Reveal>
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
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Conteúdo */}
            <Reveal>
              <p className="text-eyebrow text-brand-yellow mb-3">De norte a sul</p>
              <h2 className="h-section text-white mb-5">
                Presente em todo o Brasil
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Oficinas do país inteiro já usam o Instauto para gerenciar o negócio e faturar mais.
              </p>
              <Reveal stagger={0.1} className="grid grid-cols-2 gap-6">
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
              </Reveal>
            </Reveal>
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
      <section className="py-20 bg-[#0F172A] relative overflow-hidden">
        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent" />
        
        {/* Linha amarela decorativa no topo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
        
        {/* Elementos decorativos amarelos */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Conteúdo */}
            <Reveal>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-400/20 rounded-full text-yellow-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Wrench className="w-3 h-3 sm:w-4 sm:h-4" />
                Para Oficinas Mecânicas
              </div>
              
              <h2 className="h-section text-white mb-5">
                Você é dono de oficina mecânica?
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">
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
                  href="/login?tipo=oficina"
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
            </Reveal>

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
