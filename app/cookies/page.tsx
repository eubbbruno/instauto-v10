import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Cookie, ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Cookie className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 leading-tight">
              Política de Cookies
            </h1>
            <p className="text-lg text-yellow-100 font-sans">
              Última atualização: Fevereiro de 2026
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
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  Esta Política de Cookies explica como o Instauto utiliza cookies e 
                  tecnologias similares para melhorar sua experiência na plataforma.
                </p>
              </div>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                1. O que são Cookies?
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Cookies são pequenos arquivos de texto armazenados no seu navegador quando 
                você visita um site. Eles permitem que o site reconheça seu dispositivo e 
                lembre de informações sobre sua visita, como suas preferências e ações.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                2. Tipos de Cookies que Utilizamos
              </h2>
              
              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                2.1. Cookies Essenciais
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Necessários para o funcionamento básico da plataforma:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Autenticação:</strong> Mantém você conectado à sua conta</li>
                <li><strong>Segurança:</strong> Protege contra ataques e fraudes</li>
                <li><strong>Preferências:</strong> Lembra suas escolhas de idioma e configurações</li>
                <li><strong>Sessão:</strong> Gerencia sua sessão ativa na plataforma</li>
              </ul>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                2.2. Cookies de Funcionalidade
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Melhoram a experiência do usuário:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Lembrar filtros e preferências de busca</li>
                <li>Salvar estado de formulários</li>
                <li>Personalizar a interface</li>
                <li>Lembrar tipo de usuário (motorista/oficina)</li>
              </ul>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                2.3. Cookies de Análise
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Ajudam a entender como você usa a plataforma:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Google Analytics:</strong> Análise de tráfego e comportamento</li>
                <li>Páginas mais visitadas</li>
                <li>Tempo de permanência</li>
                <li>Origem do tráfego</li>
              </ul>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                2.4. Cookies de Marketing (Futuros)
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Atualmente não utilizamos cookies de marketing ou publicidade. Se isso mudar 
                no futuro, você será notificado e poderá optar por não participar.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                3. Cookies de Terceiros
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Utilizamos serviços de terceiros que podem definir cookies:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Supabase:</strong> Autenticação e banco de dados</li>
                <li><strong>Google Analytics:</strong> Análise de uso (se configurado)</li>
                <li><strong>Google OAuth:</strong> Login com Google</li>
                <li><strong>MercadoPago:</strong> Processamento de pagamentos</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                4. Gerenciar Cookies
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Você pode controlar e gerenciar cookies de várias formas:
              </p>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                4.1. Configurações do Navegador
              </h3>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                A maioria dos navegadores permite:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Ver quais cookies estão armazenados</li>
                <li>Bloquear todos os cookies</li>
                <li>Bloquear cookies de terceiros</li>
                <li>Excluir cookies ao fechar o navegador</li>
                <li>Excluir todos os cookies</li>
              </ul>

              <h3 className="text-xl font-heading font-bold text-gray-900 mt-8 mb-3">
                4.2. Links de Configuração
              </h3>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-os-cookies-que-os-sites-usam" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Safari</a></li>
                <li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Microsoft Edge</a></li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  <strong>⚠️ Atenção:</strong> Bloquear ou excluir cookies pode afetar a 
                  funcionalidade da plataforma. Alguns recursos podem não funcionar corretamente 
                  sem cookies essenciais.
                </p>
              </div>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                5. Duração dos Cookies
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Utilizamos dois tipos de cookies baseados na duração:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>Cookies de Sessão:</strong> Temporários, excluídos quando você fecha o navegador</li>
                <li><strong>Cookies Persistentes:</strong> Permanecem por um período determinado (geralmente até 1 ano)</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                6. Cookies Específicos Utilizados
              </h2>
              
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duração</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Finalidade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">sb-access-token</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Essencial</td>
                      <td className="px-6 py-4 text-sm text-gray-700">1 hora</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Autenticação do usuário</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">sb-refresh-token</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Essencial</td>
                      <td className="px-6 py-4 text-sm text-gray-700">30 dias</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Renovação de sessão</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">instauto_user_type</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Funcional</td>
                      <td className="px-6 py-4 text-sm text-gray-700">7 dias</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Tipo de usuário (motorista/oficina)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">_ga</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Análise</td>
                      <td className="px-6 py-4 text-sm text-gray-700">2 anos</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Google Analytics - identificação</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-700">_gid</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Análise</td>
                      <td className="px-6 py-4 text-sm text-gray-700">24 horas</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Google Analytics - sessão</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                7. Seus Direitos
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li>Aceitar ou recusar cookies não essenciais</li>
                <li>Excluir cookies a qualquer momento</li>
                <li>Solicitar informações sobre os cookies que usamos</li>
                <li>Retirar seu consentimento para cookies não essenciais</li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                8. Cookies de Redes Sociais
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Se você usar o login social (Google), esses serviços podem definir seus 
                próprios cookies. Recomendamos que você revise as políticas de cookies 
                desses serviços:
              </p>
              <ul className="list-disc list-inside text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-700">Política de Cookies do Google</a></li>
              </ul>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                9. Atualizações desta Política
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-6">
                Podemos atualizar esta Política de Cookies periodicamente para refletir 
                mudanças em nossas práticas ou por razões legais. A data da última 
                atualização será sempre indicada no topo desta página.
              </p>

              <h2 className="text-2xl font-heading font-bold text-gray-900 mt-12 mb-4">
                10. Contato
              </h2>
              <p className="text-gray-700 font-sans leading-relaxed mb-4">
                Se você tiver dúvidas sobre nossa Política de Cookies:
              </p>
              <ul className="list-none text-gray-700 font-sans leading-relaxed mb-6 space-y-2">
                <li><strong>E-mail:</strong> privacidade@instauto.com.br</li>
                <li><strong>Telefone:</strong> +55 (43) 99185-2779</li>
                <li><strong>Endereço:</strong> Londrina, PR - Brasil</li>
              </ul>

              <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl mt-12">
                <p className="text-gray-700 font-sans leading-relaxed m-0">
                  <strong>Última atualização:</strong> Fevereiro de 2026<br />
                  <strong>Versão:</strong> 1.0<br />
                  <strong>Base Legal:</strong> Lei nº 13.709/2018 (LGPD)
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mt-8">
                <p className="text-gray-800 font-sans leading-relaxed m-0">
                  <strong>Transparência:</strong> Acreditamos em total transparência sobre 
                  como usamos cookies. Se você tiver qualquer dúvida ou preocupação, não 
                  hesite em nos contatar.
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
