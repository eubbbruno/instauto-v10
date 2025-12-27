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
  title: "Encontre Oficina Mecânica Perto de Você | Orçamento Grátis | Instauto",
  description: "Encontre oficinas mecânicas confiáveis perto de você. Solicite orçamentos grátis, compare preços e avaliações. Manutenção automotiva para carros, motos e caminhões. Sistema completo de gestão para oficinas.",
  keywords: ["oficina mecânica", "oficina mecânica perto de mim", "orçamento oficina mecânica", "solicitar orçamento oficina", "manutenção automotiva", "conserto de carro", "mecânico de confiança", "gestão de oficina", "sistema para oficina"],
  authors: [{ name: "Instauto" }],
  icons: {
    icon: [
      { url: '/images/logo.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: "Encontre Oficina Mecânica Perto de Você | Orçamento Grátis",
    description: "Solicite orçamentos grátis em oficinas mecânicas confiáveis. Compare preços e avaliações. Manutenção automotiva com transparência.",
    url: "https://www.instauto.com.br",
    siteName: "Instauto",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: '/images/img-01.png',
        width: 1200,
        height: 630,
        alt: 'Instauto - Encontre Oficinas Mecânicas e Solicite Orçamentos',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Encontre Oficina Mecânica | Orçamento Grátis | Instauto",
    description: "Solicite orçamentos grátis em oficinas mecânicas confiáveis perto de você",
    images: ['/images/img-01.png'],
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

