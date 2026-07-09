"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Car, Wrench, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface UserTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: "login" | "cadastro";
}

export default function UserTypeModal({
  isOpen,
  onClose,
}: UserTypeModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl my-auto bg-navy border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Glow decor */}
        <div className="pointer-events-none absolute -top-32 -right-24 w-[380px] h-[380px] rounded-full bg-brand-blue/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 w-[320px] h-[320px] rounded-full bg-brand-yellow/8 blur-[90px]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <p className="text-eyebrow text-brand-gold mb-2">Criar conta grátis</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mb-2">
              Como você quer usar o Instauto?
            </h2>
            <p className="text-white/50 text-sm sm:text-base">Escolha o tipo de conta para começar</p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Motorista */}
            <Link href="/cadastro/motorista" onClick={onClose} className="group">
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.08] hover:border-brand-blue/40 transition-all">
                <div className="w-14 h-14 bg-brand-blue/20 ring-1 ring-brand-blue/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Car className="h-7 w-7 text-brand-blue" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sou Motorista</h3>
                <ul className="space-y-1.5 mb-5">
                  {["Orçamentos grátis", "Oficinas verificadas", "Garagem digital"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/55 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-green-500/15 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                    100% Grátis
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>

            {/* Oficina */}
            <Link href="/cadastro/oficina" onClick={onClose} className="group">
              <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.08] hover:border-brand-yellow/40 transition-all">
                <div className="w-14 h-14 bg-brand-yellow/15 ring-1 ring-brand-yellow/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wrench className="h-7 w-7 text-brand-yellow" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Sou Oficina</h3>
                <ul className="space-y-1.5 mb-5">
                  {["Gestão completa", "Novos clientes", "14 dias de PRO"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-white/55 text-sm">
                      <Check className="w-4 h-4 text-brand-yellow flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-brand-yellow/15 text-brand-yellow px-3 py-1 rounded-full text-xs font-bold">
                    14 dias grátis
                  </span>
                  <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-white/40 text-sm mt-6">
            Já tem conta?{" "}
            <Link href="/login" onClick={onClose} className="text-brand-yellow font-semibold hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
