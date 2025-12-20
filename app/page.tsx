"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

const features = [
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    title: "Gestão de Clientes",
    description: "Cadastre e gerencie seus clientes com facilidade. Histórico completo de serviços.",
  },
  {
    icon: <Car className="h-8 w-8 text-blue-600" />,
    title: "Controle de Veículos",
    description: "Registre todos os veículos dos seus clientes com informações detalhadas.",
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-blue-600" />,
    title: "Ordens de Serviço",
    description: "Crie e acompanhe OS com status em tempo real. Nunca perca o controle.",
  },
  {
    icon: <Calendar className="h-8 w-8 text-blue-600" />,
    title: "Agenda Inteligente",
    description: "Calendário completo para gerenciar agendamentos e compromissos.",
  },
  {
    icon: <Package className="h-8 w-8 text-blue-600" />,
    title: "Estoque de Peças",
    description: "Controle seu estoque com alertas de reposição automáticos.",
  },
  {
    icon: <DollarSign className="h-8 w-8 text-blue-600" />,
    title: "Financeiro Completo",
    description: "Receitas, despesas e relatórios financeiros detalhados.",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Dashboard com Gráficos",
    description: "Visualize métricas importantes com gráficos interativos.",
  },
  {
    icon: <Shield className="h-8 w-8 text-blue-600" />,
    title: "Seguro e Confiável",
    description: "Seus dados protegidos com criptografia e backup automático.",
  },
];

const plans = [
  {
    name: "FREE",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 10 clientes",
      "30 OS por mês",
      "Gestão de veículos",
      "Dashboard básico",
      "Suporte por email",
    ],
    cta: "Começar Grátis",
    href: "/cadastro",
    highlighted: false,
  },
  {
    name: "PRO",
    price: "R$ 97",
    period: "/mês",
    description: "Para oficinas que querem crescer",
    features: [
      "Clientes ilimitados",
      "OS ilimitadas",
      "Agenda completa",
      "Estoque de peças",
      "Financeiro completo",
      "Relatórios avançados",
      "Suporte prioritário",
      "Backup automático",
    ],
    cta: "Começar Teste Grátis",
    href: "/cadastro",
    highlighted: true,
  },
];

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Dono - Auto Center Silva",
    content: "O Instauto revolucionou minha oficina! Agora tenho controle total de tudo, desde agendamentos até o financeiro. Recomendo!",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Gerente - Oficina Santos",
    content: "Sistema muito completo e fácil de usar. O suporte é excelente e sempre que preciso eles me ajudam rapidamente.",
    rating: 5,
  },
  {
    name: "João Oliveira",
    role: "Proprietário - Mecânica JO",
    content: "Melhor investimento que fiz! O controle de estoque e as OS digitais economizaram muito tempo e dinheiro.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Instauto</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-blue-900 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4" />
              Sistema completo para oficinas mecânicas
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gerencie sua oficina com{" "}
              <span className="text-blue-600">eficiência total</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Controle clientes, veículos, ordens de serviço, estoque e financeiro em um só lugar. 
              Simples, rápido e profissional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cadastro">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-lg px-8 py-6">
                  Começar Grátis Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#recursos">
                <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  Ver Recursos
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              ✓ 14 dias de teste grátis • ✓ Sem cartão de crédito • ✓ Cancele quando quiser
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sistema completo com todas as ferramentas para gerenciar sua oficina com eficiência
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Por que escolher o Instauto?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Fácil de usar</h3>
                    <p className="text-gray-600">
                      Interface intuitiva que qualquer pessoa consegue usar. Sem complicação.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aumente seus lucros</h3>
                    <p className="text-gray-600">
                      Controle financeiro completo para você saber exatamente quanto está ganhando.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguro e confiável</h3>
                    <p className="text-gray-600">
                      Seus dados protegidos com a melhor tecnologia de segurança do mercado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-6">Comece hoje mesmo!</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Cadastro em menos de 2 minutos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>14 dias de teste grátis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Suporte dedicado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Sem fidelidade ou multa</span>
                </li>
              </ul>
              <Link href="/cadastro">
                <Button size="lg" className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-bold">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos simples e transparentes
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para sua oficina
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.highlighted
                    ? "border-4 border-blue-600 shadow-2xl scale-105"
                    : "border-2"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button
                      size="lg"
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Oficinas que já transformaram sua gestão com o Instauto
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base text-gray-700">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto para transformar sua oficina?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Junte-se a centenas de oficinas que já estão gerenciando seus negócios com o Instauto
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-bold text-lg px-8 py-6">
              Começar Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">
            Teste grátis por 14 dias • Sem cartão de crédito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Instauto</span>
              </div>
              <p className="text-sm">
                Sistema completo de gestão para oficinas mecânicas
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#recursos" className="hover:text-white">Recursos</Link></li>
                <li><Link href="#precos" className="hover:text-white">Preços</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Sobre</Link></li>
                <li><Link href="#" className="hover:text-white">Contato</Link></li>
                <li><Link href="#" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacidade</Link></li>
                <li><Link href="#" className="hover:text-white">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Instauto. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
