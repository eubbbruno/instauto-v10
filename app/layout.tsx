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
  metadataBase: new URL('https://www.instauto.com.br'),
  title: {
    default: "Instauto - Encontre a Melhor Oficina Mecânica",
    template: "%s | Instauto"
  },
  description: "Encontre oficinas mecânicas de confiança perto de você. Compare orçamentos, veja avaliações e agende serviços. Para oficinas: sistema completo de gestão.",
  keywords: ["oficina mecânica", "mecânico", "orçamento", "carro", "manutenção", "reparo", "auto", "veículo", "sistema para oficina", "gestão de oficina", "ERP oficina"],
  authors: [{ name: "Instauto" }],
  creator: "Instauto",
  publisher: "Instauto",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.instauto.com.br",
    siteName: "Instauto",
    title: "Instauto - Encontre a Melhor Oficina Mecânica",
    description: "Encontre oficinas mecânicas de confiança. Compare orçamentos e agende serviços.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instauto - Oficinas Mecânicas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instauto - Encontre a Melhor Oficina Mecânica",
    description: "Encontre oficinas mecânicas de confiança. Compare orçamentos e agende serviços.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://nzvvkbvmyttlixswwaqw.supabase.co" />
        <meta name="theme-color" content="#3B82F6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Instauto",
              "url": "https://www.instauto.com.br",
              "description": "Plataforma para encontrar oficinas mecânicas e sistema de gestão para oficinas",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "97",
                "priceCurrency": "BRL"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "500"
              }
            })
          }}
        />
      </head>
      <body className={`${plusJakarta.variable} ${syne.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

