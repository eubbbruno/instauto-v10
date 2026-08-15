import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Wrench, Car, ArrowRight, Sparkles, ShieldCheck,
  MessageCircle, CreditCard, MapPin, Layers,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { GlassCard } from "@/components/ui/glass-card";

const DIFERENCIAIS = [
  { icon: Layers, title: "Tudo em um só lugar", desc: "Gestão completa da oficina + um marketplace que traz clientes novos. Não é só um sistema, é crescimento." },
  { icon: Sparkles, title: "Inteligência artificial", desc: "Diagnóstico assistido por IA e respostas automáticas no WhatsApp — tecnologia de ponta, simples de usar." },
  { icon: CreditCard, title: "14 dias grátis, sem cartão", desc: "Você testa o plano PRO completo antes de decidir. Sem pegadinha, sem fidelidade." },
  { icon: MessageCircle, title: "Suporte humano", desc: "Precisou de ajuda? Fala direto com a gente no WhatsApp. Nada de robô te deixando na fila." },
  { icon: ShieldCheck, title: "Seus dados seguros", desc: "Infraestrutura profissional, backups e conformidade com a LGPD. Seus dados e os dos seus clientes protegidos." },
  { icon: MapPin, title: "Feito no Brasil", desc: "Nascido em Londrina, pensado para a realidade das oficinas brasileiras — do bairro à rodovia." },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="band-dark py-16 pt-28 sm:py-24 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-yellow/6 blur-[80px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-eyebrow text-brand-gold mb-4">Sobre nós</p>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            A ponte entre <span className="text-brand-yellow">motoristas</span> e <span className="text-brand-yellow">oficinas</span>
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            O Instauto une um sistema completo de gestão para oficinas a um marketplace onde motoristas
            encontram quem resolve o problema do carro — com transparência e sem enrolação.
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <FadeIn>
              <div>
                <p className="text-eyebrow text-brand-blue mb-3">Nossa história</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-5">
                  Nasceu de uma frustração real
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  De um lado, o motorista ligando para oficina atrás de oficina só para ter uma ideia de preço.
                  Do outro, o dono da oficina afogado em papel, WhatsApp e caderninho, sem tempo para atrair
                  novos clientes. Dois problemas que se resolvem no mesmo lugar.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Desde <strong>2019</strong>, o Instauto vem evoluindo sem parar: uma plataforma onde a oficina
                  gerencia clientes, ordens de serviço, estoque, financeiro e agenda — e ainda aparece para quem
                  está procurando um mecânico de confiança agora. A cada ano, mais recursos, ouvindo quem está na
                  graxa todo dia.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Em <strong>2025</strong>, demos o maior salto até aqui: integramos <strong>inteligência
                  artificial</strong> e <strong>WhatsApp</strong> direto no dia a dia das oficinas — diagnóstico
                  assistido por IA e atendimento automático, para a oficina trabalhar mais rápido e vender melhor.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex justify-center">
                <Image src="/images/img-03.png" alt="Mecânico Instauto" width={420} height={420} className="drop-shadow-2xl" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
              <p className="text-eyebrow text-brand-blue mb-3">Por que o Instauto</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Feito para resolver, não para complicar
              </h2>
            </div>
          </FadeIn>
          <StaggerContainer>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {DIFERENCIAIS.map(({ icon: Icon, title, desc }) => (
                <StaggerItem key={title}>
                  <div className="h-full bg-white rounded-2xl border border-navy/8 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <StaggerContainer>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
              <StaggerItem>
                <GlassCard>
                  <div className="p-8">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
                      <Image src="/images/sobre-missao.png" alt="Missão do Instauto" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Dar às oficinas as ferramentas de gestão e visibilidade que só as grandes tinham — e ao
                      motorista, transparência para escolher bem.
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
              <StaggerItem>
                <GlassCard>
                  <div className="p-8">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
                      <Image src="/images/sobre-visao.png" alt="Visão do Instauto" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Ser a plataforma que todo motorista abre quando o carro dá problema e que toda oficina usa
                      para tocar o dia a dia — em todo o Brasil.
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
              <StaggerItem>
                <GlassCard>
                  <div className="p-8">
                    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6">
                      <Image src="/images/sobre-valores.png" alt="Valores do Instauto" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Valores</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Transparência e confiança em primeiro lugar, com simplicidade em tudo que fazemos.
                      Construímos junto com quem usa a plataforma no dia a dia — sem letra miúda, sem
                      complicação, sempre do lado da oficina e do motorista.
                    </p>
                  </div>
                </GlassCard>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* Para Quem é */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Para quem é o Instauto?</h2>
            </div>
          </FadeIn>
          <StaggerContainer>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              <StaggerItem>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 md:p-8 h-full">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Motoristas</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Carro, moto ou caminhão precisando de manutenção? Encontre oficinas perto de você, peça
                    orçamentos e organize as manutenções do veículo — de graça.
                  </p>
                  <Link href="/cadastro/motorista" className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
                    Cadastrar como Motorista <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 md:p-8 h-full">
                  <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mb-6">
                    <Wrench className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Oficinas</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sistema completo de gestão + visibilidade para novos clientes. Comece com 14 dias de PRO
                    grátis, sem cartão, e veja a diferença na organização e no faturamento.
                  </p>
                  <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold">
                    Cadastrar Minha Oficina <ArrowRight className="w-5 h-5" />
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
          <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-6">Pronto para começar?</h2>
          <p className="text-xl text-white/55 mb-10 max-w-2xl mx-auto">
            Coloque sua oficina no mapa ou encontre a oficina ideal para o seu carro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cadastro/motorista" className="btn-epic-blue inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold">
              Cadastrar como Motorista <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold">
              Cadastrar Minha Oficina <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
