"use client";

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
              Política de Privacidade
            </h1>
            <p className="text-lg text-green-100 font-sans">
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
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-sans font-semibold mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>

            <div className="prose prose-lg max-w-none">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  No Instauto, levamos sua privacidade a sério. Esta política descreve 
                  como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
                </p>
              </div>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                1. Informações que Coletamos
              </h2>
              
              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                1.1. Informações Fornecidas por Você
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Coletamos informações que você nos fornece diretamente ao:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Criar uma conta (nome, e-mail, telefone, CPF/CNPJ)</li>
                <li>Configurar sua oficina (nome da empresa, endereço, especialidades)</li>
                <li>Cadastrar clientes e veículos</li>
                <li>Criar ordens de serviço e registros financeiros</li>
                <li>Entrar em contato com nosso suporte</li>
              </ul>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                1.2. Informações Coletadas Automaticamente
              </h3>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Endereço IP e localização geográfica</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de uso</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                2. Como Usamos Suas Informações
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar notificações importantes sobre sua conta</li>
                <li>Oferecer suporte técnico e atendimento ao cliente</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Analisar o uso da plataforma para melhorias</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                3. Compartilhamento de Informações
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Provedores de Serviço:</strong> MercadoPago (pagamentos), Supabase (banco de dados), OpenAI (IA)</li>
                <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou para proteger direitos</li>
                <li><strong>Transferência de Negócio:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                4. Segurança dos Dados
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Implementamos medidas de segurança técnicas e organizacionais para proteger 
                suas informações:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Criptografia de dados em repouso</li>
                <li>Backup automático diário</li>
                <li>Controle de acesso baseado em funções (RLS)</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Autenticação segura via Supabase Auth</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                5. Seus Direitos (LGPD)
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                <li><strong>Correção:</strong> Atualizar informações incorretas ou incompletas</li>
                <li><strong>Exclusão:</strong> Solicitar a remoção dos seus dados</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao processamento de dados</li>
                <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
              </ul>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Para exercer seus direitos, entre em contato através de{" "}
                <a href="mailto:privacidade@instauto.com.br" className="text-green-600 hover:text-green-700 font-semibold">
                  privacidade@instauto.com.br
                </a>
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                6. Retenção de Dados
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
                e cumprir obrigações legais. Após o cancelamento da conta, seus dados serão 
                mantidos por até 5 anos para fins fiscais e legais, conforme exigido pela 
                legislação brasileira.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                7. Cookies e Tecnologias Similares
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Manter você conectado à plataforma</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso do site</li>
                <li>Melhorar a experiência do usuário</li>
              </ul>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                8. Transferência Internacional de Dados
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Alguns de nossos provedores de serviço (como Supabase e OpenAI) podem estar 
                localizados fora do Brasil. Garantimos que essas transferências são feitas 
                de acordo com a LGPD e com medidas de segurança adequadas.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                9. Privacidade de Menores
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Nossos serviços são destinados a empresas e profissionais. Não coletamos 
                intencionalmente informações de menores de 18 anos. Se você acredita que 
                coletamos dados de um menor, entre em contato imediatamente.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos 
                sobre mudanças significativas por e-mail ou através de um aviso na plataforma. 
                A data da última atualização será sempre indicada no topo desta página.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                11. Encarregado de Dados (DPO)
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Nosso Encarregado de Proteção de Dados pode ser contatado em:
              </p>
              <ul className="list-none text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>E-mail:</strong> privacidade@instauto.com.br</li>
                <li><strong>Telefone:</strong> +55 (43) 99185-2779</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                12. Contato
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento 
                dos seus dados pessoais:
              </p>
              <ul className="list-none text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>E-mail:</strong> contato@instauto.com.br</li>
                <li><strong>Telefone:</strong> +55 (43) 99185-2779</li>
                <li><strong>Endereço:</strong> Londrina, PR - Brasil</li>
              </ul>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mt-12">
                <p className="text-gray-700 font-sans leading-relaxed m-0">
                  <strong>Última atualização:</strong> 22 de dezembro de 2024<br />
                  <strong>Versão:</strong> 1.0<br />
                  <strong>Base Legal:</strong> Lei nº 13.709/2018 (LGPD)
                </p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mt-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  <strong>Compromisso com a Privacidade:</strong> No Instauto, respeitamos 
                  sua privacidade e nos comprometemos a proteger seus dados pessoais. Se você 
                  tiver qualquer dúvida ou preocupação, não hesite em nos contatar.
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

