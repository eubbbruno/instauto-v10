import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Heart, Users, Wrench, Car, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <section className="band-dark py-16 pt-28 sm:py-24 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-eyebrow text-brand-gold mb-4">Sobre nós</p>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">Sobre o Instauto</h1>
          <p className="text-white/55 text-lg">
            Conectando motoristas e oficinas de forma simples e eficiente
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <FadeIn>
            <div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Nossa História
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                O Instauto nasceu da necessidade de simplificar a conexão entre motoristas e oficinas mecânicas.
                Percebemos que motoristas perdiam tempo ligando para várias oficinas em busca de orçamentos,
                enquanto oficinas tinham dificuldade em gerenciar seu negócio e atrair novos clientes.
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                Em 2025, criamos uma plataforma que resolve ambos os problemas: motoristas encontram oficinas
                próximas e recebem orçamentos rapidamente, e oficinas ganham um sistema completo de gestão
                além de aparecerem para milhares de potenciais clientes.
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                Hoje, já conectamos mais de 2.500 motoristas e 500 oficinas em todo o Brasil, gerando
                milhares de orçamentos e ajudando oficinas a aumentarem seu faturamento em até 40%.
              </p>
            </div>
            </FadeIn>
            <FadeIn delay={0.2}>
            <div className="flex justify-center">
              <Image
                src="/images/img-03.png"
                alt="Mecânico Instauto"
                width={400}
                height={400}
                className="drop-shadow-2xl"
              />
            </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {/* Missão */}
            <StaggerItem>
            <GlassCard>
            <div className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Conectar motoristas e oficinas de forma rápida e eficiente, proporcionando
                transparência, economia de tempo e melhores resultados para ambos os lados.
              </p>
            </div>
            </GlassCard>
            </StaggerItem>

            {/* Visão */}
            <StaggerItem>
            <GlassCard>
            <div className="p-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a maior plataforma de conexão entre motoristas e oficinas do Brasil,
                reconhecida pela qualidade, confiança e inovação tecnológica.
              </p>
            </div>
            </GlassCard>
            </StaggerItem>

            {/* Valores */}
            <StaggerItem>
            <GlassCard>
            <div className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Transparência</li>
                <li>✓ Confiança</li>
                <li>✓ Inovação</li>
                <li>✓ Foco no cliente</li>
                <li>✓ Simplicidade</li>
              </ul>
            </div>
            </GlassCard>
            </StaggerItem>
          </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Números */}
      <section className="py-12 sm:py-20 band-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.1),transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Instauto em Números
            </h2>
            <p className="text-blue-100 text-base sm:text-lg">
              Resultados que comprovam nossa eficiência
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">2.500+</div>
              <p className="text-blue-100 text-xs sm:text-base">Motoristas cadastrados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">500+</div>
              <p className="text-blue-100 text-xs sm:text-base">Oficinas ativas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">50k+</div>
              <p className="text-blue-100 text-xs sm:text-base">Orçamentos gerados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-5xl font-bold text-yellow-400 mb-1 sm:mb-2">98%</div>
              <p className="text-blue-100 text-xs sm:text-base">Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quem é */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Para Quem é o Instauto?
            </h2>
          </div>
          </FadeIn>

          <StaggerContainer>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            {/* Motoristas */}
            <StaggerItem>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Motoristas</h3>
              <p className="text-gray-600 mb-6">
                Se você tem carro, moto ou caminhão e precisa de manutenção, o Instauto é para você.
                Encontre oficinas próximas, compare preços e agende serviços sem sair de casa.
              </p>
              <Link
                href="/cadastro/motorista"
                className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
              >
                Cadastrar como Motorista
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            </StaggerItem>

            {/* Oficinas */}
            <StaggerItem>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Oficinas</h3>
              <p className="text-gray-600 mb-6">
                Se você é dono de oficina mecânica, o Instauto oferece um sistema completo de gestão
                e coloca sua oficina no mapa para milhares de motoristas. Aumente seu faturamento.
              </p>
              <Link
                href="/cadastro/oficina"
                className="btn-epic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
              >
                Cadastrar Minha Oficina
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            </StaggerItem>
          </div>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Final */}
      <section className="band-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.1),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-6">
            Faça parte da nossa história
          </h2>
          <p className="text-xl text-white/55 mb-10">
            Junte-se a milhares de usuários que já confiam no Instauto
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/cadastro/motorista"
              className="btn-epic-blue inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold"
            >
              Cadastrar como Motorista
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/cadastro/oficina"
              className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold"
            >
              Cadastrar Minha Oficina
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
