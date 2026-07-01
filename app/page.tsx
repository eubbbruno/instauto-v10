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
  Search,
  MessageSquare,
  CalendarCheck,
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
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,_rgba(37,99,235,0.06)_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 relative">
          <Reveal className="text-center mb-4 max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Para cada motor</p>
            <h2 className="h-section text-navy mb-4">
              Especialistas para todo tipo de veículo
            </h2>
            <p className="text-lg text-navy/60 px-4">
              Carro, moto ou caminhão — encontre oficinas que entendem exatamente do que o seu precisa.
            </p>
          </Reveal>

          {/* Hint interativo */}
          <Reveal className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 text-xs text-navy/40 font-sans bg-gray-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              Passe o mouse para ver a transformação
            </span>
          </Reveal>

          <Reveal stagger={0.15} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Carros */}
            <div className="group card-lift bg-gradient-to-b from-blue-50/80 to-white border border-blue-100 p-8 rounded-3xl cursor-pointer relative overflow-hidden">
              {/* Badge antes/depois */}
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-sans font-semibold text-blue-400/70 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✓ Consertado
              </div>
              <div className="relative flex justify-center mb-6 h-[140px]">
                {/* Batido (default) */}
                <Image
                  src="/images/carro-azul-batido.png"
                  alt="Carro batido"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-lg absolute inset-0 m-auto transition-all duration-500 group-hover:opacity-0 group-hover:scale-95"
                />
                {/* Novo (hover) */}
                <Image
                  src="/images/carro-azul.png"
                  alt="Carro recuperado"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-2xl absolute inset-0 m-auto opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(37,99,235,0.35)]"
                />
              </div>
              <h3 className="h-card text-navy mb-2 text-center">Carros</h3>
              <p className="text-navy/60 font-sans text-sm text-center">
                Manutenção preventiva, troca de óleo, freios, suspensão e muito mais
              </p>
            </div>

            {/* Motos */}
            <div className="group card-lift bg-gradient-to-b from-yellow-50/80 to-white border border-yellow-100 p-8 rounded-3xl cursor-pointer relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-sans font-semibold text-brand-gold/70 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✓ Consertada
              </div>
              <div className="relative flex justify-center mb-6 h-[140px]">
                <Image
                  src="/images/moto-amarela-batida.png"
                  alt="Moto batida"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-lg absolute inset-0 m-auto transition-all duration-500 group-hover:opacity-0 group-hover:scale-95"
                />
                <Image
                  src="/images/moto-amarela.png"
                  alt="Moto recuperada"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-2xl absolute inset-0 m-auto opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(234,179,8,0.45)]"
                />
              </div>
              <h3 className="h-card text-navy mb-2 text-center">Motos</h3>
              <p className="text-navy/60 font-sans text-sm text-center">
                Revisão completa, troca de corrente, pneus e serviços especializados
              </p>
            </div>

            {/* Caminhões */}
            <div className="group card-lift bg-gradient-to-b from-slate-50/80 to-white border border-slate-100 p-8 rounded-3xl cursor-pointer relative overflow-hidden">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-sans font-semibold text-slate-400/70 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ✓ Consertado
              </div>
              <div className="relative flex justify-center mb-6 h-[140px]">
                <Image
                  src="/images/caminhao-branco-batido.png"
                  alt="Caminhão batido"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-lg absolute inset-0 m-auto transition-all duration-500 group-hover:opacity-0 group-hover:scale-95"
                />
                <Image
                  src="/images/caminhao-branco.png"
                  alt="Caminhão recuperado"
                  width={200}
                  height={140}
                  className="object-contain drop-shadow-2xl absolute inset-0 m-auto opacity-0 scale-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 group-hover:drop-shadow-[0_0_24px_rgba(100,116,139,0.35)]"
                />
              </div>
              <h3 className="h-card text-navy mb-2 text-center">Caminhões</h3>
              <p className="text-navy/60 font-sans text-sm text-center">
                Manutenção pesada, motor, transmissão e serviços para frotas
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Grade sutil de fundo */}
        <div className="absolute inset-0 opacity-[0.4]" style={{backgroundImage:"radial-gradient(circle,#e2e8f0 1px,transparent 1px)",backgroundSize:"32px 32px"}} />

        <div className="container mx-auto px-4 relative">
          <Reveal className="text-center mb-20 max-w-xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">Como funciona</p>
            <h2 className="h-section text-navy mb-4">
              Tão fácil que parece mágica
            </h2>
          </Reveal>

          {/* Zigzag steps */}
          <div className="max-w-5xl mx-auto space-y-6">
            {[
              {
                num: "01",
                img: "/images/passo1.png",
                label: "Encontre oficinas",
                title: "Busque perto de você e veja quem é melhor avaliado",
                desc: "Digite seu endereço e em segundos aparece uma lista de oficinas verificadas na sua região — com nota, especialidade e distância.",
                accent: "bg-blue-50 border-blue-100",
                tag: "text-brand-blue bg-blue-50 ring-blue-200",
              },
              {
                num: "02",
                img: "/images/passo2.png",
                label: "Compare orçamentos",
                title: "Peça preço para várias oficinas sem sair do app",
                desc: "Mande a descrição do problema e receba orçamentos detalhados. Compare valores e serviços antes de decidir — sem pressão.",
                accent: "bg-yellow-50 border-yellow-100",
                tag: "text-amber-700 bg-yellow-50 ring-yellow-200",
                reverse: true,
              },
              {
                num: "03",
                img: "/images/passo3.png",
                label: "Agende o horário",
                title: "Escolha o dia e confirme em segundos",
                desc: "Com um toque você reserva o horário na oficina escolhida. Receba confirmação na hora e lembrete no dia.",
                accent: "bg-blue-50 border-blue-100",
                tag: "text-brand-blue bg-blue-50 ring-blue-200",
              },
              {
                num: "04",
                img: "/images/passo4.png",
                label: "Retire pronto",
                title: "Acompanhe tudo e pegue seu carro consertado",
                desc: "Receba atualizações do status do serviço em tempo real. Quando ficar pronto, o mecânico avisa — e você avalia.",
                accent: "bg-yellow-50 border-yellow-100",
                tag: "text-amber-700 bg-yellow-50 ring-yellow-200",
                reverse: true,
              },
            ].map(({ num, img, label, title, desc, accent, tag, reverse }) => (
              <Reveal key={num}>
                <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-16 rounded-3xl border ${accent} p-8 md:p-12`}>
                  {/* Imagem */}
                  <div className="flex-shrink-0 w-full md:w-[280px] flex justify-center">
                    <Image
                      src={img}
                      alt={title}
                      width={280}
                      height={280}
                      className="object-contain w-[220px] md:w-[280px] h-auto"
                    />
                  </div>
                  {/* Texto */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      <span className="font-heading font-black text-5xl text-navy/8 leading-none select-none">{num}</span>
                      <span className={`text-xs font-sans font-semibold px-3 py-1 rounded-full ring-1 ${tag}`}>{label}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-navy mb-3 leading-snug">{title}</h3>
                    <p className="text-navy/55 font-sans leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="text-center mt-14">
            <Link href="/buscar-oficinas" className="btn-epic inline-flex items-center gap-2">
              Buscar oficina agora <ArrowRight className="w-4 h-4" />
            </Link>
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
      <section className="band-dark py-20 relative overflow-hidden">
        {/* Aurora glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-blue/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-brand-yellow/10 blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header centralizado */}
          <Reveal className="text-center mb-16 max-w-2xl mx-auto">
            <p className="text-eyebrow text-brand-gold mb-3">De norte a sul</p>
            <h2 className="h-section text-white mb-4">
              Presente em todo o <span className="text-brand-yellow">Brasil</span>
            </h2>
            <p className="text-white/50 text-lg">
              Oficinas de todo o país já usam o Instauto para crescer e faturar mais.
            </p>
          </Reveal>

          {/* Layout: stats esquerda + mapa direita */}
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-center">

            {/* Stats tipográficos */}
            <Reveal stagger={0.12} className="grid grid-cols-2 gap-x-8 gap-y-10">
              {[
                { val: "500+", label: "Oficinas ativas", color: "text-brand-yellow" },
                { val: "15",   label: "Estados cobertos", color: "text-brand-yellow" },
                { val: "50k+", label: "OS gerenciadas",  color: "text-white" },
                { val: "98%",  label: "Satisfação",       color: "text-white" },
              ].map(({ val, label, color }) => (
                <div key={label} className="border-l-2 border-white/10 pl-5">
                  <div className={`text-5xl font-heading font-black leading-none mb-1 ${color}`}>{val}</div>
                  <p className="text-white/40 font-sans text-sm">{label}</p>
                </div>
              ))}

              {/* Pill "crescendo todo dia" */}
              <div className="col-span-2 mt-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white/60">
                  <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse" />
                  Novas oficinas entrando toda semana
                </div>
              </div>
            </Reveal>

            {/* Mapa grande com dots premium */}
            <Reveal delay={0.2}>
              <div className="relative flex justify-center">
                {/* Glow atrás do mapa */}
                <div className="absolute inset-0 bg-brand-blue/10 rounded-3xl blur-2xl" />
                <div className="relative">
                  <Image
                    src="/images/brazil-map.png"
                    alt="Mapa do Brasil — presença do Instauto"
                    width={560}
                    height={620}
                    className="w-full max-w-[560px] opacity-80 drop-shadow-2xl"
                  />
                  {/* Dots com múltiplos anéis — cidades principais */}
                  {[
                    { top: "28%", left: "52%", delay: "0s",    city: "Belém" },
                    { top: "30%", left: "67%", delay: "0.4s",  city: "Fortaleza" },
                    { top: "40%", left: "72%", delay: "0.8s",  city: "Recife" },
                    { top: "46%", left: "69%", delay: "0.2s",  city: "Salvador" },
                    { top: "49%", left: "52%", delay: "1.2s",  city: "Brasília" },
                    { top: "57%", left: "56%", delay: "0.6s",  city: "Goiânia" },
                    { top: "60%", left: "68%", delay: "1.0s",  city: "BH" },
                    { top: "65%", left: "70%", delay: "0.3s",  city: "Rio" },
                    { top: "67%", left: "64%", delay: "0.9s",  city: "São Paulo" },
                    { top: "76%", left: "57%", delay: "1.4s",  city: "Curitiba" },
                    { top: "83%", left: "53%", delay: "0.7s",  city: "Porto Alegre" },
                    { top: "32%", left: "36%", delay: "1.6s",  city: "Manaus" },
                  ].map(({ top, left, delay, city }) => (
                    <div key={city} className="absolute group" style={{ top, left }}>
                      {/* Anéis pulsantes duplos */}
                      <span className="absolute -inset-2 rounded-full bg-brand-yellow/20 animate-ping" style={{ animationDelay: delay }} />
                      <span className="absolute -inset-1 rounded-full bg-brand-yellow/30 animate-ping" style={{ animationDelay: `calc(${delay} + 0.2s)`, animationDuration: "1.5s" }} />
                      {/* Dot central */}
                      <span className="relative block w-2.5 h-2.5 rounded-full bg-brand-yellow shadow-[0_0_8px_3px_rgba(253,224,71,0.6)]" />
                      {/* Tooltip cidade */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-sans font-semibold text-white/0 group-hover:text-white/90 bg-navy/80 px-2 py-0.5 rounded-full transition-all duration-200 pointer-events-none">
                        {city}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
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
