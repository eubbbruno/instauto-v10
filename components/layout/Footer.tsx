"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight, MapPin, Mail } from "lucide-react";

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
      { href: "/blog", label: "Blog" },
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
      { href: "/login?tipo=oficina", label: "Cadastrar Oficina" },
      { href: "/login?tipo=motorista", label: "Cadastrar Motorista" },
      { href: "/login", label: "Login Oficina" },
      { href: "/login", label: "Login Motorista" },
    ],
  },
];

const SOCIALS = [
  { href: "https://instagram.com/instauto", Icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com/instauto", Icon: Facebook, label: "Facebook" },
  { href: "https://linkedin.com/company/instauto", Icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/instauto", Icon: Twitter, label: "Twitter" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#080E1A] text-gray-400 relative overflow-hidden">
      {/* Aurora fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-brand-yellow/5 blur-[80px] pointer-events-none" />

      {/* Mini CTA banner */}
      <div className="relative border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <p className="text-eyebrow text-brand-gold mb-3">Comece agora</p>
          <h3 className="text-3xl md:text-4xl font-heading font-black text-white mb-8 leading-tight">
            Faça parte da maior rede<br className="hidden sm:block" /> de oficinas e motoristas do Brasil
          </h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/buscar-oficinas"
              className="btn-epic inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold"
            >
              Buscar oficina grátis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login?tipo=oficina"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white/8 text-white ring-1 ring-white/15 hover:bg-white/15 transition-colors"
            >
              Cadastrar minha oficina <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link href="/">
              <Image
                src="/images/instauto-amarelo-branco.svg"
                alt="Instauto"
                width={148}
                height={42}
                className="h-9 w-auto mb-6 opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-[14px] leading-relaxed text-white/40 mb-7 max-w-[260px]">
              Tecnologia que conecta motoristas às melhores oficinas — e dá às oficinas um sistema de gestão completo.
            </p>

            {/* Socials */}
            <div className="flex gap-2 mb-7">
              {SOCIALS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/6 text-white/50 ring-1 ring-white/8 transition-all hover:bg-brand-yellow hover:text-navy hover:scale-110 hover:ring-brand-yellow"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Contato rápido */}
            <div className="space-y-2 text-[13px] text-white/35">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-yellow/60 flex-shrink-0" />
                contato@instauto.com.br
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-yellow/60 flex-shrink-0" />
                Brasil · 15 estados atendidos
              </div>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-sans font-bold tracking-widest uppercase text-brand-yellow/80 mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/40 hover:text-white transition-colors hover:translate-x-0.5 inline-block"
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
      <div className="relative border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-white/25">
            <p>© {currentYear} Instauto Tecnologia. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <Link href="/termos" className="hover:text-white/60 transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-white/60 transition-colors">Privacidade</Link>
              <Link href="/cookies" className="hover:text-white/60 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
