"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const FOOTER_COLS = [
  {
    title: "Produto",
    links: [
      { href: "/buscar-oficinas", label: "Buscar Oficinas" },
      { href: "/para-oficinas", label: "Para Oficinas" },
      { href: "/planos", label: "Planos e Preços" },
      { href: "/como-funciona", label: "Como Funciona" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre Nós" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/termos", label: "Termos de Uso" },
      { href: "/privacidade", label: "Política de Privacidade" },
      { href: "/cookies", label: "Política de Cookies" },
    ],
  },
  {
    title: "Acesso",
    links: [
      { href: "/login", label: "Cadastrar Oficina" },
      { href: "/login", label: "Cadastrar Motorista" },
      { href: "/login", label: "Login Oficina" },
      { href: "/login", label: "Login Motorista" },
    ],
  },
];

const SOCIALS = [
  { href: "https://facebook.com/instauto", Icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com/instauto", Icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com/company/instauto", Icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/instauto", Icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aurora text-gray-300">
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-blue" />

      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={160}
              height={45}
              className="mb-6 h-10 w-auto"
            />
            <p className="mb-6 max-w-md text-[15px] leading-relaxed text-gray-400">
              Conectamos motoristas às melhores oficinas e damos às oficinas um
              sistema de gestão completo. Tecnologia que faz o carro — e o
              negócio — andar.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-all hover:scale-110 hover:bg-brand-yellow hover:text-navy"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-eyebrow mb-6 text-brand-yellow">{col.title}</h4>
              <ul className="space-y-3 text-[15px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-block text-gray-400 transition-all hover:translate-x-1 hover:text-brand-yellow"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">
              © {currentYear} Instauto. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/termos" className="text-gray-400 transition-colors hover:text-brand-yellow">
                Termos
              </Link>
              <Link href="/privacidade" className="text-gray-400 transition-colors hover:text-brand-yellow">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-400 transition-colors hover:text-brand-yellow">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
