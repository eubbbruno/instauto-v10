import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como Funciona",
  description: "Saiba como usar o Instauto para encontrar oficinas mecânicas, solicitar orçamentos, avaliar serviços e gerenciar a manutenção do seu veículo.",
  keywords: ["como funciona instauto", "tutorial oficina", "solicitar orçamento", "avaliar oficina"],
  openGraph: {
    title: "Como Funciona | Instauto",
    description: "Saiba como usar o Instauto para encontrar oficinas e solicitar orçamentos.",
  },
};

export default function ComoFuncionaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
