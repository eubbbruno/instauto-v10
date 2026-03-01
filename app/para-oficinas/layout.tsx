import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Oficinas - Cadastre sua Oficina",
  description: "Cadastre sua oficina no Instauto e receba orçamentos de clientes. Sistema completo de gestão, agenda, estoque e financeiro. Planos gratuitos e PRO disponíveis.",
  keywords: ["cadastrar oficina", "sistema para oficina", "gestão oficina", "ERP oficina", "software oficina mecânica"],
  openGraph: {
    title: "Para Oficinas - Cadastre sua Oficina | Instauto",
    description: "Cadastre sua oficina e receba orçamentos de clientes. Sistema completo de gestão.",
  },
};

export default function ParaOficinasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
