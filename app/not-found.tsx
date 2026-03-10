import Link from "next/link";
import Image from "next/image";
import { Home, Search, Wrench, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Ilustração 404 */}
          <div className="mb-8 relative">
            <div className="text-[180px] sm:text-[240px] font-bold text-gray-100 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-blue-100 rounded-full flex items-center justify-center animate-bounce">
                <Wrench className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Mensagem */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ops! Página não encontrada
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-lg mx-auto">
            Parece que você pegou o caminho errado... Mas não se preocupe, vamos te ajudar a voltar ao rumo!
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              <Home className="w-5 h-5" />
              Voltar para Home
            </Link>
            
            <Link
              href="/buscar-oficinas"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold rounded-xl transition-all shadow-lg shadow-yellow-500/30"
            >
              <Search className="w-5 h-5" />
              Buscar Oficinas
            </Link>
          </div>

          {/* Links Úteis */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Links Úteis
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/como-funciona"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Como Funciona
              </Link>
              <Link
                href="/para-oficinas"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Para Oficinas
              </Link>
              <Link
                href="/planos"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Planos
              </Link>
              <Link
                href="/contato"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
              >
                Contato
              </Link>
            </div>
          </div>

          {/* Mensagem de Ajuda */}
          <p className="mt-8 text-sm text-gray-500">
            Precisa de ajuda?{" "}
            <Link href="/contato" className="text-blue-600 hover:text-blue-700 font-medium">
              Entre em contato
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
