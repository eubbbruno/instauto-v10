import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies | Instauto",
  description: "Como o Instauto utiliza cookies e como você pode gerenciar suas preferências.",
  alternates: { canonical: "https://www.instauto.com.br/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      updatedAt="9 de julho de 2026"
      intro="Esta Política de Cookies explica o que são cookies, como o Instauto os utiliza e como você pode controlar suas preferências. Ela complementa a nossa Política de Privacidade."
      sections={[
        {
          heading: "O que são cookies",
          blocks: [
            { type: "p", text: "Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles permitem que a plataforma reconheça o seu navegador, lembre preferências e funcione corretamente. Também utilizamos tecnologias semelhantes, como armazenamento local (localStorage)." },
          ],
        },
        {
          heading: "Tipos de cookies que utilizamos",
          blocks: [
            { type: "ul", items: [
              "Necessários: essenciais para o funcionamento da plataforma, como autenticação, segurança e manutenção da sessão. Não podem ser desativados.",
              "Desempenho e análise: ajudam a entender como a plataforma é utilizada, de forma agregada, para melhorarmos a experiência.",
              "Funcionais: lembram suas escolhas e preferências para personalizar a navegação.",
              "Marketing: podem ser usados para medir campanhas e apresentar conteúdo relevante, sempre mediante o seu consentimento.",
            ] },
          ],
        },
        {
          heading: "Cookies de terceiros",
          blocks: [
            { type: "p", text: "Alguns recursos dependem de serviços de parceiros (como autenticação via Google e Facebook e provedores de infraestrutura), que podem definir seus próprios cookies. Esses tratamentos seguem as políticas de privacidade dos respectivos parceiros." },
          ],
        },
        {
          heading: "Consentimento",
          blocks: [
            { type: "p", text: "Ao acessar a plataforma pela primeira vez, exibimos um aviso de cookies. Os cookies necessários são aplicados por serem indispensáveis ao funcionamento; os demais dependem do seu consentimento, que pode ser concedido ou recusado e revogado a qualquer momento." },
          ],
        },
        {
          heading: "Como gerenciar cookies",
          blocks: [
            { type: "ul", items: [
              "Você pode aceitar ou recusar cookies não essenciais no aviso exibido ao entrar no site.",
              "A maioria dos navegadores permite bloquear ou excluir cookies nas configurações. Note que desativar cookies necessários pode comprometer funcionalidades da plataforma.",
              "A revogação do consentimento não afeta a legalidade do tratamento realizado antes da revogação.",
            ] },
          ],
        },
        {
          heading: "Atualizações desta Política",
          blocks: [
            { type: "p", text: "Podemos atualizar esta Política para refletir mudanças em nossas práticas ou na legislação. A data de última atualização é sempre indicada no topo deste documento." },
          ],
        },
      ]}
    />
  );
}
