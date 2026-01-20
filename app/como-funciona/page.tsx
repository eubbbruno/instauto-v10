import Image from "next/image";
import Link from "next/link";
import { Search, FileText, CheckCircle, Car, Wrench, Star, ArrowRight } from "lucide-react";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero simples */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona o Instauto</h1>
          <p className="text-xl text-blue-100">
            Conectamos motoristas e oficinas de forma simples e rápida
          </p>
        </div>
      </section>

      {/* Para Motoristas */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold mb-4">
              <Car className="w-5 h-5" />
              Para Motoristas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Encontre oficinas próximas em 3 passos
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-blue-600" />
              </div>
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Busque por CEP ou endereço</h3>
              <p className="text-gray-600">
                Digite seu CEP ou endereço e veja oficinas próximas a você em segundos.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="w-12 h-12 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Solicite orçamentos grátis</h3>
              <p className="text-gray-600">
                Descreva o problema do seu veículo e receba orçamentos de várias oficinas.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Escolha e agende</h3>
              <p className="text-gray-600">
                Compare preços, avaliações e escolha a melhor oficina para você.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/buscar-oficinas"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Buscar Oficinas Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Para Oficinas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold mb-4">
              <Wrench className="w-5 h-5" />
              Para Oficinas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gerencie sua oficina e aumente o faturamento
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cadastre sua oficina</h3>
              <p className="text-gray-600">
                Crie sua conta grátis em 5 minutos. Adicione fotos, serviços e horários.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Receba solicitações</h3>
              <p className="text-gray-600">
                Motoristas próximos vão encontrar sua oficina e solicitar orçamentos.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gerencie tudo em um lugar</h3>
              <p className="text-gray-600">
                Ordens de serviço, estoque, financeiro, clientes. Tudo organizado.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/cadastro-oficina"
              className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold rounded-xl transition-all shadow-lg"
            >
              Cadastrar Minha Oficina Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que usar o Instauto?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">100% Gratuito para motoristas</h3>
                <p className="text-gray-600">
                  Busque oficinas, solicite orçamentos e compare preços sem pagar nada.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Oficinas verificadas</h3>
                <p className="text-gray-600">
                  Todas as oficinas são verificadas e avaliadas por outros motoristas.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Economia de tempo</h3>
                <p className="text-gray-600">
                  Receba vários orçamentos de uma vez. Não precisa ligar para cada oficina.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sistema completo para oficinas</h3>
                <p className="text-gray-600">
                  Gestão de OS, estoque, financeiro, clientes. Tudo em um só lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Cadastre-se grátis e comece a usar agora mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cadastro-motorista"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
            >
              Sou Motorista
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/cadastro-oficina"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl hover:bg-yellow-300 transition-all"
            >
              Sou Oficina
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
