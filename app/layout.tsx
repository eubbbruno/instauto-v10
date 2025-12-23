import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";

const syne = Syne({ 
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Instauto - Sistema de Gestão para Oficinas Mecânicas",
  description: "Sistema completo de gestão para oficinas mecânicas. Controle clientes, ordens de serviço, estoque, financeiro e muito mais. Teste grátis por 14 dias.",
  keywords: ["oficina mecânica", "gestão de oficina", "sistema para oficina", "ordem de serviço", "controle de estoque"],
  authors: [{ name: "Instauto" }],
  openGraph: {
    title: "Instauto - Sistema de Gestão para Oficinas Mecânicas",
    description: "Sistema completo de gestão para oficinas mecânicas. Teste grátis por 14 dias.",
    url: "https://www.instauto.com.br",
    siteName: "Instauto",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instauto - Sistema de Gestão para Oficinas",
    description: "Sistema completo de gestão para oficinas mecânicas",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${plusJakarta.variable} ${syne.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

