import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o Instauto",
  description: "Conheça a história do Instauto, a plataforma que conecta motoristas e oficinas mecânicas de forma simples e transparente.",
  keywords: ["sobre instauto", "quem somos", "história instauto"],
  openGraph: {
    title: "Sobre o Instauto",
    description: "Conheça a plataforma que conecta motoristas e oficinas mecânicas.",
  },
};

export default function SobreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
