import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, CheckCircle, Users, FileText, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Instauto</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/cadastro">
              <Button>Começar Grátis</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema de Gestão para
          <span className="text-blue-600"> Oficinas Mecânicas</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Gerencie clientes, veículos e ordens de serviço de forma simples e profissional.
          Comece grátis e transforme sua oficina.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/cadastro">
            <Button size="lg" className="text-lg px-8">
              Começar Grátis - 30 dias
            </Button>
          </Link>
          <Link href="#recursos">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Recursos
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          ✓ Sem cartão de crédito • ✓ 10 clientes grátis • ✓ 30 OS/mês
        </p>
      </section>

      {/* Features Section */}
      <section id="recursos" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tudo que sua oficina precisa
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10 text-blue-600" />}
            title="Gestão de Clientes"
            description="Cadastre e organize todos os seus clientes com histórico completo"
          />
          <FeatureCard
            icon={<Car className="h-10 w-10 text-blue-600" />}
            title="Controle de Veículos"
            description="Registre todos os veículos dos seus clientes com detalhes"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-blue-600" />}
            title="Ordens de Serviço"
            description="Crie, gerencie e finalize OS de forma profissional"
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-blue-600" />}
            title="Relatórios"
            description="Acompanhe o desempenho da sua oficina em tempo real"
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Planos simples e transparentes
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PricingCard
            title="FREE"
            price="R$ 0"
            period="/mês"
            features={[
              "Até 10 clientes",
              "30 OS por mês",
              "Gestão de veículos",
              "Suporte por email",
            ]}
            buttonText="Começar Grátis"
            buttonVariant="outline"
          />
          <PricingCard
            title="PRO"
            price="R$ 97"
            period="/mês"
            features={[
              "Clientes ilimitados",
              "OS ilimitadas",
              "Relatórios avançados",
              "Suporte prioritário",
            ]}
            buttonText="Assinar PRO"
            buttonVariant="default"
            highlighted
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para transformar sua oficina?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de oficinas que já usam o Instauto para gerenciar seu negócio
          </p>
          <Link href="/cadastro">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Começar Agora - É Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 Instauto. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  features,
  buttonText,
  buttonVariant,
  highlighted = false,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  highlighted?: boolean;
}) {
  return (
    <div
      className={`bg-white p-8 rounded-lg border-2 ${
        highlighted ? "border-blue-600 shadow-lg" : "border-gray-200"
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link href="/cadastro">
        <Button variant={buttonVariant} className="w-full" size="lg">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}

