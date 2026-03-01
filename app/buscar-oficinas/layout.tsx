import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buscar Oficinas Mecânicas",
  description: "Encontre oficinas mecânicas avaliadas perto de você. Compare preços, veja avaliações de clientes e solicite orçamentos grátis.",
  keywords: ["buscar oficina", "oficina perto de mim", "mecânico confiável", "orçamento oficina", "avaliação oficina"],
  openGraph: {
    title: "Buscar Oficinas Mecânicas | Instauto",
    description: "Encontre oficinas mecânicas avaliadas perto de você. Compare preços e solicite orçamentos grátis.",
  },
};

export default function BuscarOficinasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
