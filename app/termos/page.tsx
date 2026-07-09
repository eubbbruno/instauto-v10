import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso | Instauto",
  description: "Termos e condições de uso da plataforma Instauto para motoristas e oficinas.",
  alternates: { canonical: "https://www.instauto.com.br/termos" },
};

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      updatedAt="9 de julho de 2026"
      intro="Estes Termos de Uso regem o acesso e a utilização da plataforma Instauto. Ao criar uma conta ou utilizar nossos serviços, você declara ter lido, compreendido e aceito integralmente as condições abaixo. Caso não concorde, não utilize a plataforma."
      sections={[
        {
          heading: "Definições",
          blocks: [
            { type: "ul", items: [
              "\"Instauto\", \"plataforma\", \"nós\": o serviço on-line que conecta motoristas a oficinas mecânicas.",
              "\"Motorista\": pessoa física que utiliza a plataforma para buscar oficinas e solicitar orçamentos.",
              "\"Oficina\": pessoa física ou jurídica que oferece serviços de manutenção automotiva e utiliza a plataforma para gestão e captação de clientes.",
              "\"Usuário\": qualquer pessoa que acesse ou utilize a plataforma, seja Motorista ou Oficina.",
            ] },
          ],
        },
        {
          heading: "Objeto e natureza do serviço",
          blocks: [
            { type: "p", text: "O Instauto é uma plataforma de intermediação tecnológica que aproxima Motoristas e Oficinas, além de oferecer ferramentas de gestão para Oficinas. O Instauto não presta serviços de manutenção automotiva, não é parte nos contratos firmados entre Motoristas e Oficinas e não se responsabiliza pela execução, qualidade ou garantia dos serviços contratados diretamente entre as partes." },
          ],
        },
        {
          heading: "Cadastro e conta",
          blocks: [
            { type: "ul", items: [
              "Para utilizar recursos da plataforma é necessário criar uma conta com informações verdadeiras, completas e atualizadas.",
              "O Usuário é o único responsável pela guarda e confidencialidade de suas credenciais de acesso, respondendo por todas as atividades realizadas em sua conta.",
              "É proibido criar contas com dados falsos, de terceiros sem autorização ou com o intuito de fraudar a plataforma.",
              "O Instauto pode recusar, suspender ou encerrar contas que violem estes Termos.",
            ] },
          ],
        },
        {
          heading: "Responsabilidades do Motorista",
          blocks: [
            { type: "ul", items: [
              "Fornecer informações corretas sobre o veículo e o serviço desejado ao solicitar orçamentos.",
              "Avaliar e contratar Oficinas por sua própria conta e risco, verificando reputação e condições antes de fechar negócio.",
              "Tratar as Oficinas com respeito e boa-fé nas negociações e avaliações.",
            ] },
          ],
        },
        {
          heading: "Responsabilidades da Oficina",
          blocks: [
            { type: "ul", items: [
              "Manter dados cadastrais, endereço, especialidades e informações de contato precisos e atualizados.",
              "Prestar os serviços contratados com qualidade, segurança e em conformidade com a legislação aplicável, incluindo normas de defesa do consumidor.",
              "Emitir documentação fiscal quando exigido por lei e honrar os orçamentos e prazos acordados com o Motorista.",
              "Responder diretamente por eventuais garantias, defeitos ou danos decorrentes dos serviços prestados.",
            ] },
          ],
        },
        {
          heading: "Planos, assinatura e pagamento",
          blocks: [
            { type: "ul", items: [
              "O Instauto oferece um plano gratuito (FREE) e um plano pago (PRO), com recursos descritos na página de planos.",
              "O plano PRO inclui período de teste gratuito, sem cobrança e sem necessidade de cartão de crédito. Ao final do teste, a conta permanece como FREE caso não haja contratação.",
              "As assinaturas são mensais e podem ser canceladas a qualquer momento pelo painel, sem multa ou fidelidade. O cancelamento encerra a renovação seguinte, mantendo o acesso até o fim do período já pago.",
              "Valores e condições podem ser alterados mediante aviso prévio.",
            ] },
          ],
        },
        {
          heading: "Uso permitido e condutas proibidas",
          blocks: [
            { type: "p", text: "É vedado ao Usuário:" },
            { type: "ul", items: [
              "Utilizar a plataforma para fins ilícitos, fraudulentos ou que violem direitos de terceiros.",
              "Publicar conteúdo falso, difamatório, ofensivo ou avaliações não correspondentes a experiências reais.",
              "Tentar acessar áreas restritas, burlar mecanismos de segurança ou sobrecarregar a infraestrutura.",
              "Coletar dados de outros Usuários sem autorização ou base legal.",
            ] },
          ],
        },
        {
          heading: "Propriedade intelectual",
          blocks: [
            { type: "p", text: "A marca, o logotipo, o software, o design, os textos e demais elementos da plataforma são de titularidade do Instauto ou licenciados a ele, protegidos pela legislação de propriedade intelectual. O acesso à plataforma não transfere qualquer direito sobre esses elementos ao Usuário." },
          ],
        },
        {
          heading: "Limitação de responsabilidade",
          blocks: [
            { type: "p", text: "O Instauto atua exclusivamente como intermediário tecnológico. Não nos responsabilizamos por: (i) a qualidade, prazo, preço ou garantia dos serviços prestados pelas Oficinas; (ii) negociações, pagamentos e acordos firmados diretamente entre Motoristas e Oficinas; (iii) danos decorrentes de indisponibilidades temporárias, falhas técnicas ou fatores fora do nosso controle razoável. A plataforma é fornecida \"no estado em que se encontra\"." },
          ],
        },
        {
          heading: "Suspensão e encerramento",
          blocks: [
            { type: "p", text: "O Instauto poderá suspender ou encerrar o acesso do Usuário que descumprir estes Termos, sem prejuízo das medidas legais cabíveis. O Usuário pode encerrar sua conta a qualquer momento, observadas as obrigações pendentes." },
          ],
        },
        {
          heading: "Alterações dos Termos",
          blocks: [
            { type: "p", text: "Estes Termos podem ser atualizados a qualquer tempo. Alterações relevantes serão comunicadas pelos canais da plataforma. O uso continuado após a publicação das mudanças representa concordância com a nova versão." },
          ],
        },
        {
          heading: "Legislação aplicável e foro",
          blocks: [
            { type: "p", text: "Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Londrina/PR para dirimir controvérsias, salvo disposição legal que assegure foro diverso ao consumidor." },
          ],
        },
      ]}
    />
  );
}
