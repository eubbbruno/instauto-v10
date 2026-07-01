"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, Wrench, Search } from "lucide-react";
import UserTypeModal from "@/components/auth/UserTypeModal";

const NAV_LINKS = [
  { href: "/buscar-oficinas", label: "Buscar Oficinas" },
  { href: "/para-oficinas", label: "Para Oficinas" },
  { href: "/planos", label: "Planos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"login" | "cadastro">("login");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const openModal = (action: "login" | "cadastro") => {
    setModalAction(action);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-navy/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.07),0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-navy/80 backdrop-blur-md"
      }`}>
        {/* Linha amarela decorativa no topo */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-brand-yellow/70 to-transparent" />

        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <Image
                src="/images/instauto-amarelo-branco.svg"
                alt="Instauto"
                width={148}
                height={42}
                className="h-8 w-auto transition-all duration-300 group-hover:opacity-85"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-[14px] font-semibold text-white/70 transition-colors hover:text-white group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-brand-yellow scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => openModal("login")}
                className="text-[14px] font-semibold text-white/70 hover:text-white transition-colors px-3 py-2"
              >
                Entrar
              </button>
              <div className="w-px h-5 bg-white/15" />
              <button
                onClick={() => openModal("cadastro")}
                className="btn-epic rounded-xl px-5 py-2.5 text-[14px] font-bold"
              >
                Cadastrar grátis
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 text-white hover:bg-white/15 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-navy flex flex-col transition-transform duration-300 ease-out lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <Image
            src="/images/instauto-amarelo-branco.svg"
            alt="Instauto"
            width={120}
            height={34}
            className="h-7 w-auto"
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/8 text-white hover:bg-white/15 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 font-semibold hover:bg-white/8 hover:text-white transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
              <ArrowRight className="w-4 h-4 ml-auto opacity-30" />
            </Link>
          ))}
        </nav>

        {/* Drawer CTAs */}
        <div className="px-4 py-6 border-t border-white/8 space-y-3">
          <button
            onClick={() => openModal("cadastro")}
            className="btn-epic w-full rounded-xl py-3.5 text-[15px] font-bold inline-flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4" /> Cadastrar grátis
          </button>
          <button
            onClick={() => openModal("login")}
            className="w-full rounded-xl py-3 text-[15px] font-semibold text-white/70 hover:text-white hover:bg-white/8 transition-colors inline-flex items-center justify-center gap-2"
          >
            Já tenho conta — Entrar
          </button>
        </div>
      </div>

      <UserTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={modalAction}
      />
    </>
  );
}
