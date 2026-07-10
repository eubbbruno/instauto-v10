import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade | Instauto",
  description: "Como o Instauto coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
  alternates: { canonical: "https://www.instauto.com.br/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updatedAt="9 de julho de 2026"
      intro="A sua privacidade é prioridade para o Instauto. Esta Política explica como coletamos, utilizamos, armazenamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Ao utilizar a plataforma, você declara estar ciente das práticas aqui descritas."
      sections={[
        {
          heading: "Controlador dos dados",
          blocks: [
            { type: "p", text: "O Instauto é o controlador dos dados pessoais tratados na plataforma, responsável por decidir sobre as finalidades e os meios do tratamento. Para questões relativas à proteção de dados, entre em contato com nosso Encarregado (DPO) pelo e-mail contato@instauto.com.br." },
          ],
        },
        {
          heading: "Dados que coletamos",
          blocks: [
            { type: "p", text: "Coletamos apenas os dados necessários para prestar e melhorar nossos serviços:" },
            { type: "ul", items: [
              "Dados de cadastro: nome, e-mail, senha (armazenada de forma criptografada) e tipo de conta (motorista ou oficina).",
              "Dados da oficina: nome do estabelecimento, cidade, estado, endereço, telefone, especialidades e demais informações do perfil público.",
              "Dados de uso: veículos cadastrados, orçamentos solicitados, mensagens, avaliações e histórico de interações na plataforma.",
              "Dados técnicos: endereço IP, tipo de dispositivo, navegador e dados de navegação coletados por cookies.",
            ] },
          ],
        },
        {
          heading: "Finalidades do tratamento",
          blocks: [
            { type: "p", text: "Utilizamos seus dados para:" },
            { type: "ul", items: [
              "Criar e gerenciar sua conta e autenticar seu acesso.",
              "Conectar motoristas e oficinas e viabilizar orçamentos e negociações.",
              "Fornecer as ferramentas de gestão às oficinas (clientes, ordens de serviço, estoque, financeiro).",
              "Exibir oficinas nas buscas por cidade e melhorar a relevância dos resultados.",
              "Enviar comunicações operacionais e, mediante consentimento, comunicações de marketing.",
              "Prevenir fraudes, garantir a segurança e cumprir obrigações legais e regulatórias.",
            ] },
          ],
        },
        {
          heading: "Bases legais (art. 7º e 11 da LGPD)",
          blocks: [
            { type: "ul", items: [
              "Execução de contrato: para prestar os serviços que você contrata ao usar a plataforma.",
              "Consentimento: para envio de comunicações de marketing e uso de cookies não essenciais.",
              "Legítimo interesse: para melhorar a plataforma, prevenir fraudes e garantir a segurança.",
              "Cumprimento de obrigação legal ou regulatória: quando exigido por lei.",
            ] },
          ],
        },
        {
          heading: "Compartilhamento de dados",
          blocks: [
            { type: "p", text: "Não vendemos seus dados pessoais. O compartilhamento ocorre apenas quando necessário:" },
            { type: "ul", items: [
              "Entre motoristas e oficinas, na medida necessária para viabilizar orçamentos e serviços.",
              "Com fornecedores de tecnologia que operam a plataforma (hospedagem, autenticação, pagamentos), sob obrigações de confidencialidade e segurança.",
              "Com autoridades públicas, quando exigido por lei ou ordem judicial.",
            ] },
          ],
        },
        {
          heading: "Direitos do titular (art. 18 da LGPD)",
          blocks: [
            { type: "p", text: "Você tem direito a, a qualquer momento e mediante solicitação:" },
            { type: "ul", items: [
              "Confirmar a existência de tratamento e acessar seus dados.",
              "Corrigir dados incompletos, inexatos ou desatualizados.",
              "Solicitar a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei.",
              "Solicitar a portabilidade dos dados a outro fornecedor.",
              "Revogar o consentimento e ser informado sobre as consequências da revogação.",
              "Solicitar a eliminação dos dados tratados com base no consentimento.",
            ] },
            { type: "p", text: "Para exercer seus direitos, escreva para contato@instauto.com.br. Podemos solicitar informações para confirmar sua identidade antes de atender ao pedido." },
          ],
        },
        {
          heading: "Segurança da informação",
          blocks: [
            { type: "p", text: "Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, perda, alteração ou divulgação indevida, incluindo criptografia, controle de acesso e backups. Nenhum sistema é totalmente infalível, mas trabalhamos continuamente para mitigar riscos." },
          ],
        },
        {
          heading: "Retenção e eliminação",
          blocks: [
            { type: "p", text: "Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas ou obrigações legais. Encerrada a relação e esgotados os prazos legais, os dados são eliminados ou anonimizados com segurança." },
          ],
        },
        {
          heading: "Cookies",
          blocks: [
            { type: "p", text: "Utilizamos cookies e tecnologias semelhantes para o funcionamento, a segurança e a melhoria da plataforma. Você pode gerenciar suas preferências a qualquer momento. Saiba mais na nossa Política de Cookies." },
          ],
        },
        {
          heading: "Transferência internacional",
          blocks: [
            { type: "p", text: "Alguns de nossos fornecedores de tecnologia podem armazenar dados em servidores localizados fora do Brasil. Nesses casos, adotamos salvaguardas para assegurar que o tratamento observe os padrões de proteção previstos na LGPD." },
          ],
        },
        {
          heading: "Alterações desta Política",
          blocks: [
            { type: "p", text: "Esta Política pode ser atualizada periodicamente. Alterações relevantes serão comunicadas pelos canais da plataforma. Recomendamos a revisão regular deste documento." },
          ],
        },
      ]}
    />
  );
}
