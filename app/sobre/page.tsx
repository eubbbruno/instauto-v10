import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Eye, Heart, Users, Wrench, Car, ArrowRight } from "lucide-react";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o Instauto</h1>
          <p className="text-xl text-blue-100">
            Conectando motoristas e oficinas de forma simples e eficiente
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-gray-600 mb-4">
                O Instauto nasceu da necessidade de simplificar a conexão entre motoristas e oficinas mecânicas.
                Percebemos que motoristas perdiam tempo ligando para várias oficinas em busca de orçamentos,
                enquanto oficinas tinham dificuldade em gerenciar seu negócio e atrair novos clientes.
              </p>
              <p className="text-gray-600 mb-4">
                Em 2025, criamos uma plataforma que resolve ambos os problemas: motoristas encontram oficinas
                próximas e recebem orçamentos rapidamente, e oficinas ganham um sistema completo de gestão
                além de aparecerem para milhares de potenciais clientes.
              </p>
              <p className="text-gray-600">
                Hoje, já conectamos mais de 2.500 motoristas e 500 oficinas em todo o Brasil, gerando
                milhares de orçamentos e ajudando oficinas a aumentarem seu faturamento em até 40%.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/images/img-03.png"
                alt="Mecânico Instauto"
                width={400}
                height={400}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Conectar motoristas e oficinas de forma rápida e eficiente, proporcionando
                transparência, economia de tempo e melhores resultados para ambos os lados.
              </p>
            </div>

            {/* Visão */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser a maior plataforma de conexão entre motoristas e oficinas do Brasil,
                reconhecida pela qualidade, confiança e inovação tecnológica.
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
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
          </div>
        </div>
      </section>

      {/* Números */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Instauto em Números
            </h2>
            <p className="text-blue-100 text-lg">
              Resultados que comprovam nossa eficiência
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">2.500+</div>
              <p className="text-blue-100">Motoristas cadastrados</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <p className="text-blue-100">Oficinas ativas</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">50k+</div>
              <p className="text-blue-100">Orçamentos gerados</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2">98%</div>
              <p className="text-blue-100">Satisfação</p>
            </div>
          </div>
        </div>
      </section>

      {/* Para Quem é */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Para Quem é o Instauto?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Motoristas */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Motoristas</h3>
              <p className="text-gray-600 mb-6">
                Se você tem carro, moto ou caminhão e precisa de manutenção, o Instauto é para você.
                Encontre oficinas próximas, compare preços e agende serviços sem sair de casa.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
              >
                Cadastrar como Motorista
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Oficinas */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-8">
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-6">
                <Wrench className="w-8 h-8 text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Para Oficinas</h3>
              <p className="text-gray-600 mb-6">
                Se você é dono de oficina mecânica, o Instauto oferece um sistema completo de gestão
                e coloca sua oficina no mapa para milhares de motoristas. Aumente seu faturamento.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Cadastrar Minha Oficina
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Faça Parte da Nossa História
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Junte-se a milhares de usuários que já confiam no Instauto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro-motorista"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              Cadastrar como Motorista
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/cadastro-oficina"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all"
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
