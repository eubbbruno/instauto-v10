"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import UserTypeModal from "@/components/auth/UserTypeModal";

const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/buscar-oficinas", label: "Buscar Oficinas" },
  { href: "/para-oficinas", label: "Para Oficinas" },
  { href: "/planos", label: "Planos" },
  { href: "/como-funciona", label: "Como Funciona" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"login" | "cadastro">("login");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = (action: "login" | "cadastro") => {
    setModalAction(action);
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-navy shadow-lg shadow-black/30"
          : "bg-navy/90 backdrop-blur-md"
      }`}
    >
      <nav className="container mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={160}
              height={45}
              className="h-10 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-[15px] font-semibold text-white/90 transition-colors hover:text-brand-yellow"
              >
                {link.label}
              </Link>
            ))}

            <div className="h-6 w-px bg-white/20" />

            <button
              onClick={() => openModal("login")}
              className="text-[15px] font-semibold text-white/90 transition-colors hover:text-brand-yellow"
            >
              Entrar
            </button>
            <button
              onClick={() => openModal("cadastro")}
              className="btn-epic rounded-xl px-6 py-2.5 text-[15px]"
            >
              Cadastrar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-white transition-colors hover:text-brand-yellow lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/10 bg-navy shadow-2xl lg:hidden">
            <div className="space-y-1 px-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-4 py-3 font-semibold text-white/90 transition-colors hover:bg-white/5 hover:text-brand-yellow"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-white/10" />

              <button
                onClick={() => openModal("login")}
                className="block w-full rounded-lg px-4 py-3 text-center font-semibold text-white/90 transition-colors hover:bg-white/5 hover:text-brand-yellow"
              >
                Entrar
              </button>
              <button
                onClick={() => openModal("cadastro")}
                className="btn-epic w-full rounded-xl py-3.5 text-base"
              >
                Cadastrar
              </button>
            </div>
          </div>
        )}
      </nav>

      <UserTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        action={modalAction}
      />
    </header>
  );
}
