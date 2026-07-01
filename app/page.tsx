"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQSection from "@/components/sections/FAQSection";
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

function VehicleCard({
  batidoSrc, fixedSrc, batidoAlt, fixedAlt,
  title, desc, badgeLabel, badgeClass, glowClass,
}: {
  batidoSrc: string; fixedSrc: string; batidoAlt: string; fixedAlt: string;
  title: string; desc: string; badgeLabel: string; badgeClass: string; glowClass: string;
}) {
  const [showFixed, setShowFixed] = useState(false);
  return (
    <div
      className="group card-lift bg-white/60 backdrop-blur-md border border-white/80 shadow-lg p-8 pb-10 rounded-3xl cursor-pointer relative overflow-hidden select-none"
      onClick={() => setShowFixed(v => !v)}
    >
      <div className={`absolute top-4 right-4 flex items-center gap-1 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full border transition-opacity duration-300 ${badgeClass} ${showFixed ? "opacity-100" : "opacity-0"} md:group-hover:opacity-100`}>
        {badgeLabel}
      </div>
      <p className="absolute bottom-3 inset-x-0 text-center text-[10px] text-navy/40 font-sans md:hidden">
        {showFixed ? "↺ toque para ver antes" : "toque para ver depois →"}
      </p>
      <div className="relative flex justify-center mb-6 h-[140px]">
        <Image
          src={batidoSrc} alt={batidoAlt} width={200} height={140}
          className={`object-contain drop-shadow-lg absolute inset-0 m-auto transition-all duration-500 md:opacity-100 md:group-hover:opacity-0 md:group-hover:scale-95 ${showFixed ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        />
        <Image
          src={fixedSrc} alt={fixedAlt} width={200} height={140}
          className={`object-contain drop-shadow-2xl absolute inset-0 m-auto transition-all duration-500 md:opacity-0 md:scale-95 md:group-hover:opacity-100 md:group-hover:scale-105 ${glowClass} ${showFixed ? "opacity-100 scale-105" : "opacity-0 scale-95"}`}
        />
      </div>
      <h3 className="h-card text-navy mb-2 text-center">{title}</h3>
      <p className="text-navy/60 font-sans text-sm text-center">{desc}</p>
    </div>
  );
}

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
                <h1 className="font-heading text-[2.4rem] sm:text-5xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight mb-5">
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
                <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 glow-gold animate-float-slow">
                  <Star className="w-5 h-5 text-yellow-900" fill="currentColor" />
                  <span className="font-bold text-yellow-900">5,0</span>
                </div>
                {/* pílula verificada */}
                <div className="absolute -bottom-5 right-4 z-20 hidden sm:flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-xl ring-1 ring-navy/5 animate-float">
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
      <section className="py-14 md:py-20 relative overflow-hidden" style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef9c3 40%,#fefce8 100%)"}}>
        {/* Blobs glassmorphism amarelos */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-yellow-300/30 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-200/40 blur-[60px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,_rgba(253,224,71,0.15)_0%,_transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
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
              <span className="md:hidden">Toque no card para ver a transformação</span>
              <span className="hidden md:inline">Passe o mouse para ver a transformação</span>
            </span>
          </Reveal>

          <Reveal stagger={0.15} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <VehicleCard
              batidoSrc="/images/carro-azul-batido.png" batidoAlt="Carro batido"
              fixedSrc="/images/carro-azul.png"         fixedAlt="Carro recuperado"
              title="Carros"
              desc="Manutenção preventiva, troca de óleo, freios, suspensão e muito mais"
              badgeLabel="✓ Consertado"
              badgeClass="text-blue-400/70 bg-blue-50 border-blue-100"
              glowClass="md:group-hover:drop-shadow-[0_0_24px_rgba(37,99,235,0.35)]"
            />
            <VehicleCard
              batidoSrc="/images/moto-amarela-batida.png" batidoAlt="Moto batida"
              fixedSrc="/images/moto-amarela.png"         fixedAlt="Moto recuperada"
              title="Motos"
              desc="Revisão completa, troca de corrente, pneus e serviços especializados"
              badgeLabel="✓ Consertada"
              badgeClass="text-brand-gold/70 bg-yellow-50 border-yellow-100"
              glowClass="md:group-hover:drop-shadow-[0_0_24px_rgba(234,179,8,0.45)]"
            />
            <VehicleCard
              batidoSrc="/images/caminhao-branco-batido.png" batidoAlt="Caminhão batido"
              fixedSrc="/images/caminhao-branco.png"         fixedAlt="Caminhão recuperado"
              title="Caminhões"
              desc="Manutenção pesada, motor, transmissão e serviços para frotas"
              badgeLabel="✓ Consertado"
              badgeClass="text-slate-400/70 bg-slate-50 border-slate-100"
              glowClass="md:group-hover:drop-shadow-[0_0_24px_rgba(100,116,139,0.35)]"
            />
          </Reveal>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
        {/* Grade sutil de fundo */}
        <div className="absolute inset-0 opacity-[0.4]" style={{backgroundImage:"radial-gradient(circle,#e2e8f0 1px,transparent 1px)",backgroundSize:"32px 32px"}} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <Reveal className="text-center mb-12 md:mb-20 max-w-xl mx-auto">
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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Link href="/buscar-oficinas" className="btn-epic inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold">
              Sou motorista — quero orçamento <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/para-oficinas" className="btn-epic-blue inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold">
              Tenho oficina — quero crescer <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mapa do Brasil */}
      <section className="band-dark py-14 md:py-20 relative overflow-hidden">
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
            <Reveal stagger={0.12} className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-10">
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

              {/* Pill */}
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
                <div className="absolute inset-0 bg-brand-blue/10 rounded-3xl blur-2xl" />
                <div className="relative">
                  <Image
                    src="/images/brazil-map.png"
                    alt="Mapa do Brasil — presença do Instauto"
                    width={560}
                    height={620}
                    className="w-full max-w-[560px] opacity-80 drop-shadow-2xl"
                  />
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
                      <span className="absolute -inset-2 rounded-full bg-brand-yellow/20 animate-ping" style={{ animationDelay: delay }} />
                      <span className="absolute -inset-1 rounded-full bg-brand-yellow/30 animate-ping" style={{ animationDelay: `calc(${delay} + 0.2s)`, animationDuration: "1.5s" }} />
                      <span className="relative block w-2.5 h-2.5 rounded-full bg-brand-yellow shadow-[0_0_8px_3px_rgba(253,224,71,0.6)]" />
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-sans font-semibold text-white/0 group-hover:text-white/90 bg-navy/80 px-2 py-0.5 rounded-full transition-all duration-200 pointer-events-none">
                        {city}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* CTAs — abaixo do grid mapa+stats */}
          <div className="flex flex-col sm:flex-row gap-3 mt-12 justify-center">
            <Link href="/para-oficinas" className="btn-epic inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold">
              Cadastrar minha oficina <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/buscar-oficinas" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/10 text-white hover:bg-white/20 transition-colors ring-1 ring-white/20">
              Buscar oficinas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Por que Instauto — Bento Grid */}
      <section className="py-16 md:py-24 bg-[#F8F9FB]">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="mb-14">
            <p className="text-eyebrow text-brand-gold mb-3">Por que Instauto</p>
            <h2 className="h-section text-navy leading-tight">
              Sem enrolação.<br />Só o carro pronto.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Card grande — orçamentos */}
            <Reveal className="sm:col-span-2">
              <div className="min-h-[240px] rounded-3xl bg-white border border-gray-100 p-8 flex flex-col justify-between overflow-hidden relative card-lift">
                <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-brand-blue/5 pointer-events-none" />
                <div>
                  <span className="text-xs font-sans font-semibold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">Grátis pra você</span>
                  <h3 className="text-2xl font-heading font-bold text-navy mt-4 mb-1">Compare orçamentos<br/>sem ligar pra ninguém</h3>
                  <p className="text-navy/50 text-sm">Peça para várias oficinas ao mesmo tempo. Receba no app, compare na hora.</p>
                </div>
                <div className="flex gap-3 mt-6">
                  {[
                    { name: "Auto Silva", price: "R$ 280", tag: "Mais barata", accent: "bg-green-50 text-green-700 ring-1 ring-green-200" },
                    { name: "Oficina JB",  price: "R$ 340", tag: "Mais próxima", accent: "bg-blue-50 text-brand-blue ring-1 ring-blue-200" },
                  ].map(q => (
                    <div key={q.name} className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <p className="text-[11px] text-navy/40 font-sans mb-1">{q.name}</p>
                      <p className="text-lg font-heading font-bold text-navy">{q.price}</p>
                      <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${q.accent}`}>{q.tag}</span>
                    </div>
                  ))}
                  <div className="flex-1 rounded-xl bg-gray-50 border border-gray-100 p-3 flex items-center justify-center">
                    <span className="text-navy/25 text-[11px] font-sans text-center">+3 oficinas<br/>responderam</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card — avaliações */}
            <Reveal delay={0.1}>
              <div className="min-h-[240px] rounded-3xl bg-brand-yellow p-8 flex flex-col justify-between card-lift">
                <span className="text-xs font-sans font-semibold text-yellow-900/50">Avaliações reais</span>
                <div>
                  <div className="text-8xl font-heading font-black text-yellow-900 leading-none">4,9</div>
                  <div className="flex gap-0.5 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-700" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-yellow-900/55 text-sm font-sans">de 2.500+ avaliações de motoristas reais</p>
                </div>
              </div>
            </Reveal>

            {/* Card — grátis */}
            <Reveal delay={0.15}>
              <div className="min-h-[200px] rounded-3xl bg-navy p-8 flex flex-col justify-between card-lift relative overflow-hidden">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-brand-yellow/10 pointer-events-none" />
                <span className="text-xs font-sans font-semibold text-white/40">Para motoristas</span>
                <div>
                  <div className="text-7xl font-heading font-black text-brand-yellow leading-none">R$0</div>
                  <p className="text-white/50 text-sm font-sans mt-2">Motorista nunca paga nada. Sempre.</p>
                </div>
              </div>
            </Reveal>

            {/* Card grande — resposta rápida */}
            <Reveal delay={0.2} className="sm:col-span-2">
              <div className="min-h-[200px] rounded-3xl bg-white border border-gray-100 p-8 flex flex-col justify-between card-lift relative overflow-hidden">
                <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-brand-blue/5 pointer-events-none" />
                <div className="flex flex-col gap-2 mb-4">
                  <div className="self-start bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-navy/70 max-w-[75%]">
                    Qual o preço pra trocar o freio traseiro? 🚗
                  </div>
                  <div className="self-end bg-brand-blue rounded-2xl rounded-tr-sm px-4 py-2 text-sm text-white max-w-[75%]">
                    Olá! R$ 320 com garantia. Agendar amanhã às 9h? ✓
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-600 font-sans font-medium">Respondido em 8 minutos</span>
                  </div>
                </div>
                <div>
                  <p className="text-xl font-heading font-bold text-navy">Sem esperar. Sem telefonema.</p>
                  <p className="text-navy/50 text-sm">A oficina responde direto no app, na hora.</p>
                </div>
              </div>
            </Reveal>

          </div>

          {/* CTA duplo pós-bento */}
          <div className="mt-14 rounded-3xl bg-navy p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white font-heading font-bold text-xl mb-1">Pronto pra começar?</p>
              <p className="text-white/50 text-sm">É grátis pra motorista. Pra oficina, 14 dias sem cartão.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link href="/buscar-oficinas" className="btn-epic inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap">
                Buscar oficina <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/para-oficinas" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap bg-white/10 text-white hover:bg-white/20 transition-colors ring-1 ring-white/20">
                Sou dono de oficina <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA para Oficinas */}
      <section className="py-16 md:py-24 bg-navy relative overflow-hidden">
        {/* Aurora dourada subindo do fundo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(253,224,71,0.18),transparent_65%)] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        {/* "14" decorativo gigante */}
        <span className="absolute -right-8 top-0 text-[22rem] font-heading font-black text-white/[0.025] leading-none select-none pointer-events-none hidden md:block">14</span>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">

            {/* Esquerda — pitch */}
            <Reveal>
              <span className="text-eyebrow text-brand-gold mb-4 block">Para donos de oficina</span>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight mb-6">
                Gerencie tudo.<br/>
                Fature <span className="text-brand-yellow">muito mais.</span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-lg leading-relaxed">
                Sistema completo de gestão + marketplace com milhares de motoristas buscando oficinas agora. 14 dias grátis, sem cartão.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/login?tipo=oficina" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold">
                  Testar 14 dias grátis <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/para-oficinas" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-white/8 text-white ring-1 ring-white/20 hover:bg-white/15 transition-colors">
                  Ver como funciona
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {["Sem cartão de crédito", "Cancele quando quiser", "Suporte dedicado"].map(t => (
                  <span key={t} className="flex items-center gap-2 text-sm text-white/45">
                    <Check className="w-4 h-4 text-brand-yellow flex-shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* Direita — card PRO */}
            <Reveal delay={0.2}>
              <div className="relative">
                {/* Glow atrás do card */}
                <div className="absolute -inset-4 rounded-[2rem] bg-brand-yellow/10 blur-2xl" />
                <div className="relative rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/12 p-8">
                  {/* Header do card */}
                  <div className="flex items-start justify-between mb-7">
                    <div>
                      <p className="text-eyebrow text-brand-gold text-xs mb-2">Plano PRO</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-5xl font-heading font-black text-white leading-none">R$97</span>
                        <span className="text-white/35 text-sm pb-1.5">/mês</span>
                      </div>
                    </div>
                    <span className="bg-brand-yellow text-navy text-xs font-heading font-black px-3 py-1.5 rounded-full animate-float-slow">
                      14 dias grátis
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/8 mb-7" />

                  {/* Features */}
                  <div className="space-y-3.5 mb-8">
                    {[
                      "Perfil no marketplace Instauto",
                      "Gestão de ordens de serviço",
                      "Orçamentos digitais online",
                      "Clientes e histórico ilimitados",
                      "Relatórios financeiros",
                      "Suporte via WhatsApp",
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-brand-yellow/15 ring-1 ring-brand-yellow/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-brand-yellow" />
                        </div>
                        <span className="text-white/65 text-sm font-sans">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/login?tipo=oficina"
                    className="btn-epic w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold"
                  >
                    Começar agora — é grátis <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-center text-white/25 text-xs mt-3 font-sans">Sem cartão. Cancele a qualquer momento.</p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* FAQ — SEO */}
      <FAQSection />

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
