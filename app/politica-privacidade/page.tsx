export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero simples */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-blue-100">Última atualização: Janeiro de 2026</p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introdução</h2>
          <p className="text-gray-600 mb-6">
            A Instauto respeita sua privacidade e está comprometida em proteger seus dados pessoais. 
            Esta Política de Privacidade explica como coletamos, usamos, armazenamos e compartilhamos 
            suas informações quando você utiliza nossa plataforma.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Dados que Coletamos</h2>
          <p className="text-gray-600 mb-4">Coletamos os seguintes tipos de informações:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Dados de cadastro:</strong> Nome, e-mail, telefone, CPF/CNPJ, endereço</li>
            <li><strong>Dados de veículos:</strong> Marca, modelo, placa, ano (para motoristas)</li>
            <li><strong>Dados de oficina:</strong> Razão social, serviços oferecidos, fotos (para oficinas)</li>
            <li><strong>Dados de uso:</strong> Histórico de orçamentos, avaliações, mensagens</li>
            <li><strong>Dados técnicos:</strong> Endereço IP, tipo de navegador, dispositivo</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Como Usamos seus Dados</h2>
          <p className="text-gray-600 mb-4">Utilizamos seus dados para:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Criar e gerenciar sua conta na plataforma</li>
            <li>Conectar motoristas e oficinas para solicitação de orçamentos</li>
            <li>Processar pagamentos de assinaturas (para oficinas)</li>
            <li>Enviar notificações sobre orçamentos, mensagens e atualizações</li>
            <li>Melhorar nossos serviços e experiência do usuário</li>
            <li>Cumprir obrigações legais e fiscais</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Compartilhamento de Dados</h2>
          <p className="text-gray-600 mb-4">
            Seus dados podem ser compartilhados com:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Oficinas:</strong> Quando você solicita um orçamento, compartilhamos dados do seu veículo e problema relatado</li>
            <li><strong>Motoristas:</strong> Oficinas visualizam informações básicas de contato para responder orçamentos</li>
            <li><strong>Processadores de pagamento:</strong> Mercado Pago para processar assinaturas</li>
            <li><strong>Provedores de serviços:</strong> Hospedagem (Vercel), banco de dados (Supabase), e-mail</li>
          </ul>
          <p className="text-gray-600 mb-6">
            <strong>Nunca vendemos seus dados para terceiros.</strong>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Segurança dos Dados</h2>
          <p className="text-gray-600 mb-6">
            Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados, incluindo:
            criptografia SSL/TLS, autenticação segura, backups automáticos e controle de acesso restrito.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Seus Direitos (LGPD)</h2>
          <p className="text-gray-600 mb-4">De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimento</li>
            <li>Portabilidade dos dados</li>
          </ul>
          <p className="text-gray-600 mb-6">
            Para exercer seus direitos, entre em contato: <strong>privacidade@instauto.com.br</strong>
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies</h2>
          <p className="text-gray-600 mb-6">
            Utilizamos cookies essenciais para o funcionamento da plataforma (autenticação, preferências).
            Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Retenção de Dados</h2>
          <p className="text-gray-600 mb-6">
            Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política,
            ou conforme exigido por lei (geralmente 5 anos para fins fiscais).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Alterações nesta Política</h2>
          <p className="text-gray-600 mb-6">
            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças
            significativas por e-mail ou aviso na plataforma.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contato</h2>
          <p className="text-gray-600 mb-6">
            Para dúvidas sobre privacidade, entre em contato:<br />
            <strong>E-mail:</strong> privacidade@instauto.com.br<br />
            <strong>Telefone:</strong> (43) 99185-2779<br />
            <strong>Endereço:</strong> Londrina, PR, Brasil
          </p>
        </div>
      </section>
    </div>
  );
}
