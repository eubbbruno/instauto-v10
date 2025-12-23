"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
              Termos de Uso
            </h1>
            <p className="text-lg text-blue-100 font-sans">
              Última atualização: 22 de dezembro de 2024
            </p>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-sans font-semibold mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>

            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  Bem-vindo ao Instauto! Ao utilizar nossa plataforma, você concorda 
                  com os termos e condições descritos abaixo. Leia atentamente.
                </p>
              </div>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Ao acessar e usar o Instauto, você aceita e concorda em cumprir estes 
                Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não 
                concordar com algum destes termos, está proibido de usar ou acessar este site.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                2. Descrição do Serviço
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                O Instauto é uma plataforma de gestão para oficinas mecânicas que oferece:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Sistema de gerenciamento de clientes e veículos</li>
                <li>Controle de ordens de serviço</li>
                <li>Gestão de estoque e financeiro</li>
                <li>Relatórios e análises</li>
                <li>Ferramentas de diagnóstico com IA</li>
                <li>Integração com WhatsApp</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                3. Cadastro e Conta
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Para usar o Instauto, você deve:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter a segurança da sua senha</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
                <li>Ser responsável por todas as atividades que ocorrem em sua conta</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                4. Planos e Pagamentos
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                <strong>Plano FREE:</strong> Acesso limitado ao dashboard básico e marketplace. 
                Gratuito para sempre.
              </p>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                <strong>Plano PRO:</strong> R$ 97/mês com acesso completo a todas as funcionalidades. 
                Teste grátis de 14 dias sem necessidade de cartão de crédito.
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>A cobrança é mensal e automática</li>
                <li>Você pode cancelar a qualquer momento</li>
                <li>Não há reembolso proporcional em caso de cancelamento</li>
                <li>Os preços podem ser alterados com aviso prévio de 30 dias</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                5. Uso Aceitável
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Usar o serviço para qualquer propósito ilegal</li>
                <li>Tentar obter acesso não autorizado a sistemas ou dados</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Copiar, modificar ou distribuir o conteúdo sem autorização</li>
                <li>Usar o serviço para enviar spam ou conteúdo malicioso</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                6. Propriedade Intelectual
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Todo o conteúdo, recursos e funcionalidades do Instauto são de propriedade 
                exclusiva da empresa e são protegidos por leis de direitos autorais, marcas 
                registradas e outras leis de propriedade intelectual.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                7. Proteção de Dados
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Seus dados são tratados de acordo com nossa{" "}
                <Link href="/privacidade" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Política de Privacidade
                </Link>
                . Implementamos medidas de segurança para proteger suas informações, incluindo 
                criptografia e backup automático.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                8. Limitação de Responsabilidade
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                O Instauto é fornecido "como está". Não garantimos que o serviço será 
                ininterrupto, livre de erros ou completamente seguro. Não nos responsabilizamos 
                por perdas ou danos decorrentes do uso ou incapacidade de usar o serviço.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                9. Cancelamento e Suspensão
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Reservamo-nos o direito de suspender ou encerrar sua conta se você violar 
                estes termos ou se o uso da plataforma for considerado inadequado. Você pode 
                cancelar sua conta a qualquer momento através das configurações do sistema.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                10. Alterações nos Termos
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Podemos atualizar estes Termos de Uso periodicamente. Notificaremos sobre 
                mudanças significativas por e-mail ou através de um aviso na plataforma. 
                O uso continuado após as alterações constitui aceitação dos novos termos.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                11. Lei Aplicável
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Estes termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa será resolvida nos tribunais competentes de Londrina, PR.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                12. Contato
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul className="list-none text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>E-mail:</strong> contato@instauto.com.br</li>
                <li><strong>Telefone:</strong> +55 (43) 99185-2779</li>
                <li><strong>Endereço:</strong> Londrina, PR - Brasil</li>
              </ul>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mt-12">
                <p className="text-gray-700 font-sans leading-relaxed m-0">
                  <strong>Última atualização:</strong> 22 de dezembro de 2024<br />
                  <strong>Versão:</strong> 1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

