import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero simples */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 py-20 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-blue-100">Última atualização: Janeiro de 2026</p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-gray-600 mb-6">
            Ao acessar e usar a plataforma Instauto, você concorda com estes Termos de Uso.
            Se você não concorda com algum termo, não utilize nossos serviços.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Descrição do Serviço</h2>
          <p className="text-gray-600 mb-6">
            O Instauto é uma plataforma que conecta motoristas e oficinas mecânicas, permitindo:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Para motoristas:</strong> Buscar oficinas, solicitar orçamentos, avaliar serviços (gratuito)</li>
            <li><strong>Para oficinas:</strong> Receber solicitações, gerenciar negócio com sistema completo (plano pago)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cadastro e Conta</h2>
          <p className="text-gray-600 mb-4">Para usar a plataforma, você deve:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Ter pelo menos 18 anos de idade</li>
            <li>Fornecer informações verdadeiras e atualizadas</li>
            <li>Manter a confidencialidade de sua senha</li>
            <li>Notificar-nos imediatamente sobre uso não autorizado da sua conta</li>
          </ul>
          <p className="text-gray-600 mb-6">
            Você é responsável por todas as atividades realizadas em sua conta.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Planos e Pagamentos (Oficinas)</h2>
          <p className="text-gray-600 mb-4">
            <strong>Plano FREE:</strong> Acesso gratuito ao marketplace (receber orçamentos).
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Plano PRO (R$ 97/mês):</strong> Sistema completo de gestão + marketplace.
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Teste grátis de 14 dias (sem cartão de crédito)</li>
            <li>Pagamento mensal via PIX, cartão ou boleto</li>
            <li>Renovação automática (pode cancelar a qualquer momento)</li>
            <li>Sem multa de cancelamento ou fidelidade</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Cancelamento e Reembolso</h2>
          <p className="text-gray-600 mb-6">
            Você pode cancelar sua assinatura a qualquer momento pelo painel de configurações.
            O cancelamento entra em vigor no próximo ciclo de cobrança. Não há reembolso proporcional
            do período já pago. Após o cancelamento, sua conta será convertida para o plano FREE.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Responsabilidades do Usuário</h2>
          <p className="text-gray-600 mb-4">Você concorda em NÃO:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Usar a plataforma para fins ilegais ou fraudulentos</li>
            <li>Publicar conteúdo ofensivo, difamatório ou enganoso</li>
            <li>Tentar acessar áreas restritas ou contas de outros usuários</li>
            <li>Fazer engenharia reversa ou copiar o código da plataforma</li>
            <li>Enviar spam ou mensagens não solicitadas</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Responsabilidades do Instauto</h2>
          <p className="text-gray-600 mb-6">
            O Instauto atua como intermediário entre motoristas e oficinas. NÃO somos responsáveis por:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li>Qualidade dos serviços prestados pelas oficinas</li>
            <li>Veracidade das informações fornecidas por usuários</li>
            <li>Disputas entre motoristas e oficinas</li>
            <li>Danos causados por uso inadequado da plataforma</li>
          </ul>
          <p className="text-gray-600 mb-6">
            Recomendamos que você verifique avaliações e escolha oficinas confiáveis.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Propriedade Intelectual</h2>
          <p className="text-gray-600 mb-6">
            Todo o conteúdo da plataforma (código, design, logotipos, textos) é propriedade do Instauto
            e protegido por leis de direitos autorais. Você não pode copiar, modificar ou distribuir
            sem autorização prévia.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Suspensão e Encerramento de Conta</h2>
          <p className="text-gray-600 mb-6">
            Podemos suspender ou encerrar sua conta se você violar estes Termos de Uso, sem aviso prévio
            e sem reembolso. Você também pode encerrar sua conta a qualquer momento pelo painel de configurações.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Limitação de Responsabilidade</h2>
          <p className="text-gray-600 mb-6">
            A plataforma é fornecida "como está". Não garantimos que estará sempre disponível ou livre de erros.
            Em nenhuma circunstância seremos responsáveis por danos indiretos, lucros cessantes ou perda de dados.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Alterações nos Termos</h2>
          <p className="text-gray-600 mb-6">
            Podemos atualizar estes Termos de Uso periodicamente. Notificaremos você sobre mudanças significativas
            por e-mail. O uso contínuo da plataforma após as alterações constitui aceitação dos novos termos.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Lei Aplicável e Foro</h2>
          <p className="text-gray-600 mb-6">
            Estes Termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro
            da comarca de Londrina, PR.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contato</h2>
          <p className="text-gray-600 mb-6">
            Para dúvidas sobre os Termos de Uso, entre em contato:<br />
            <strong>E-mail:</strong> contato@instauto.com.br<br />
            <strong>Telefone:</strong> (43) 99185-2779<br />
            <strong>Endereço:</strong> Londrina, PR, Brasil
          </p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
