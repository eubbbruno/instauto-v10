"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import UserTypeModal from "@/components/auth/UserTypeModal";

const NAV_LINKS = [
  { href: "/buscar-oficinas", label: "Buscar Oficinas" },
  { href: "/para-oficinas",   label: "Para Oficinas"   },
  { href: "/planos",          label: "Planos"           },
  { href: "/sobre",           label: "Sobre"            },
  { href: "/contato",         label: "Contato"          },
];

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [modalAction, setModalAction] = useState<"login" | "cadastro">("login");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openModal = (action: "login" | "cadastro") => {
    setModalAction(action);
    setModalOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-navy transition-all duration-300 ${
          scrolled ? "shadow-[0_1px_0_rgba(255,255,255,0.07),0_4px_24px_rgba(0,0,0,0.35)]" : "border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/instauto-amarelo-branco.svg"
              alt="Instauto"
              width={140} height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-[14px] font-semibold text-white/60 rounded-lg hover:text-white hover:bg-white/6 transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTAs — desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-[14px] font-semibold text-white/60 rounded-lg hover:text-white hover:bg-white/6 transition-all duration-150"
            >
              Entrar
            </Link>
            <button
              onClick={() => openModal("cadastro")}
              className="btn-epic px-5 py-2.5 rounded-xl text-[14px] font-bold"
            >
              Começar grátis
            </button>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu — dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[480px] border-t border-white/8" : "max-h-0"}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-semibold text-white/70 hover:text-white hover:bg-white/6 transition-all"
                onClick={() => setMobileOpen(false)}
              >
                {label}
                <ArrowRight className="w-4 h-4 opacity-30" />
              </Link>
            ))}
            <div className="pt-3 pb-1 space-y-2 border-t border-white/8 mt-3">
              <button
                onClick={() => openModal("cadastro")}
                className="btn-epic w-full py-3.5 rounded-xl text-[15px] font-bold"
              >
                Começar grátis
              </button>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center w-full py-3 rounded-xl text-[15px] font-semibold text-white/50 hover:text-white hover:bg-white/6 transition-all"
              >
                Já tenho conta — Entrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <UserTypeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
      />
    </>
  );
}
