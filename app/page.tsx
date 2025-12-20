"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  Users,
  ClipboardList,
  Calendar,
  Package,
  DollarSign,
  BarChart3,
  Crown,
  Check,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  Gauge,
} from "lucide-react";

const features = [
  {
    icon: <Users className="h-6 w-6" />,
    title: "Gestão de Clientes",
    description: "Cadastre e gerencie clientes com histórico completo de serviços e veículos.",
  },
  {
    icon: <Car className="h-6 w-6" />,
    title: "Controle de Veículos",
    description: "Registre todos os veículos com informações detalhadas e histórico de manutenção.",
  },
  {
    icon: <ClipboardList className="h-6 w-6" />,
    title: "Ordens de Serviço",
    description: "Crie e acompanhe OS com status em tempo real e controle total.",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Agenda Inteligente",
    description: "Calendário completo para gerenciar agendamentos e compromissos.",
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Estoque de Peças",
    description: "Controle seu estoque com alertas de reposição automáticos.",
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: "Financeiro Completo",
    description: "Receitas, despesas e relatórios financeiros detalhados.",
  },
];

const benefits = [
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Aumente seu faturamento",
    description: "Controle financeiro completo para maximizar seus lucros",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Economize tempo",
    description: "Automatize processos e foque no que realmente importa",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Tome decisões inteligentes",
    description: "Relatórios e gráficos para insights estratégicos",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Dados sempre seguros",
    description: "Criptografia e backup automático dos seus dados",
  },
];

const stats = [
  { value: "500+", label: "Oficinas ativas" },
  { value: "50k+", label: "OS gerenciadas" },
  { value: "98%", label: "Satisfação" },
  { value: "24/7", label: "Suporte" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm opacity-50"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Instauto
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="font-medium">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-lg shadow-yellow-500/30">
                Começar Grátis
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-full text-sm font-bold text-blue-900 mb-8 border border-blue-200">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Sistema completo para oficinas mecânicas
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              Transforme sua oficina em um
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                negócio digital
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Gerencie clientes, veículos, ordens de serviço, estoque e financeiro em uma única plataforma.
              <strong className="text-gray-900"> Simples, rápido e profissional.</strong>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/cadastro">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg px-8 h-14 shadow-xl shadow-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all">
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#recursos">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 h-14 font-bold">
                  Ver Como Funciona
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Teste grátis por 14 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-bold text-blue-900 mb-4">
              <Zap className="h-4 w-4" />
              Recursos Completos
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Tudo que sua oficina precisa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para gerenciar cada aspecto do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-bold text-blue-900 mb-6">
                  <Target className="h-4 w-4" />
                  Por que escolher o Instauto?
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                  Feito para oficinas que querem crescer
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Não perca mais tempo com planilhas e papéis. Tenha controle total do seu negócio
                  em uma plataforma moderna e fácil de usar.
                </p>

                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center text-gray-900 shadow-lg shadow-yellow-500/30">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{benefit.title}</h4>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl blur-3xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Gauge className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-sm font-medium opacity-90">Dashboard em tempo real</div>
                      <div className="text-2xl font-heading font-bold">Métricas que importam</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Receita do mês</span>
                        <span className="text-green-300 text-sm font-bold">+23%</span>
                      </div>
                      <div className="text-3xl font-heading font-bold">R$ 45.890</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-sm font-medium mb-1 opacity-90">OS Concluídas</div>
                        <div className="text-2xl font-heading font-bold">127</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-sm font-medium mb-1 opacity-90">Clientes Ativos</div>
                        <div className="text-2xl font-heading font-bold">89</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Sparkles className="h-4 w-4" />
                    <span>Atualizado em tempo real</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm font-bold text-blue-900 mb-4">
              <Crown className="h-4 w-4" />
              Planos e Preços
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Escolha o plano ideal
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comece grátis e faça upgrade quando precisar de mais recursos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">FREE</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-heading font-bold text-gray-900">R$ 0</span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-gray-600">Perfeito para começar</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Até 10 clientes",
                    "30 OS por mês",
                    "Gestão de veículos",
                    "Dashboard básico",
                    "Suporte por email",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/cadastro">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12">
                    Começar Grátis
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-4 border-blue-600 relative shadow-2xl shadow-blue-600/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  MAIS POPULAR
                </span>
              </div>

              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">PRO</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-5xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      R$ 97
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                  <p className="text-gray-600">Para oficinas que querem crescer</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Clientes ilimitados",
                    "OS ilimitadas",
                    "Agenda completa",
                    "Estoque de peças",
                    "Financeiro completo",
                    "Relatórios avançados",
                    "Suporte prioritário",
                    "Backup automático",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/cadastro">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold h-12 shadow-lg shadow-yellow-500/30">
                    Começar Teste Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
              Pronto para transformar sua oficina?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Junte-se a centenas de oficinas que já estão crescendo com o Instauto.
              Teste grátis por 14 dias, sem compromisso.
            </p>

            <Link href="/cadastro">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg px-10 h-14 shadow-2xl shadow-yellow-500/40">
                Começar Grátis Agora
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>

            <p className="mt-6 text-sm text-blue-200">
              Não precisa de cartão de crédito • Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">Instauto</span>
            </div>

            <div className="flex gap-8 text-sm text-gray-400">
              <Link href="#" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Suporte
              </Link>
            </div>

            <div className="text-sm text-gray-400">
              © 2024 Instauto. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
