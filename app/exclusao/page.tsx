import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Exclusão de dados",
  description: "Como solicitar a exclusão da sua conta e dos seus dados pessoais no Instauto.",
  alternates: { canonical: "https://www.instauto.com.br/exclusao" },
};

export default function ExclusaoPage() {
  return (
    <LegalPage
      title="Exclusão de dados"
      updatedAt="9 de julho de 2026"
      intro="Você pode solicitar a exclusão da sua conta e dos seus dados pessoais a qualquer momento. Esta página explica como fazer e o que acontece com os seus dados, em conformidade com a LGPD (Lei nº 13.709/2018)."
      sections={[
        {
          heading: "Como solicitar a exclusão",
          blocks: [
            { type: "p", text: "Há duas formas de solicitar a exclusão dos seus dados:" },
            { type: "ul", items: [
              "Pelo aplicativo: acesse Configurações na sua conta e utilize a opção de exclusão de conta, quando disponível.",
              "Por e-mail: envie uma mensagem para contato@instauto.com.br a partir do e-mail cadastrado, com o assunto \"Exclusão de dados\". Podemos solicitar informações para confirmar a sua identidade antes de processar o pedido.",
            ] },
          ],
        },
        {
          heading: "O que é excluído",
          blocks: [
            { type: "p", text: "Ao confirmar a exclusão, removemos ou anonimizamos os dados pessoais associados à sua conta, incluindo:" },
            { type: "ul", items: [
              "Dados de cadastro (nome, e-mail, telefone) e credenciais de acesso.",
              "Dados de perfil (motorista ou oficina), veículos, orçamentos e mensagens vinculados à conta.",
              "Preferências e histórico de uso associados a você.",
            ] },
          ],
        },
        {
          heading: "Dados que podem ser retidos",
          blocks: [
            { type: "p", text: "Alguns dados podem ser mantidos por período limitado quando houver obrigação legal, regulatória ou necessidade de exercício de direitos (por exemplo, registros fiscais e financeiros de transações já realizadas). Nesses casos, os dados são guardados apenas pelo tempo exigido e com acesso restrito, sendo eliminados ao término do prazo." },
          ],
        },
        {
          heading: "Prazo",
          blocks: [
            { type: "p", text: "Processamos as solicitações de exclusão em até 15 dias, salvo prazos legais aplicáveis. Você receberá uma confirmação por e-mail quando o processo for concluído." },
          ],
        },
        {
          heading: "Login social (Google/Facebook)",
          blocks: [
            { type: "p", text: "Se você criou a conta usando login do Google ou Facebook, a exclusão remove os dados armazenados no Instauto. Isso não afeta a sua conta no Google ou Facebook — a revogação de acesso a esses provedores deve ser feita nas configurações de cada um." },
          ],
        },
      ]}
    />
  );
}
