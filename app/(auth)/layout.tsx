"use client";

import { Car, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-sm opacity-50"></div>
              <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                <Car className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Instauto
            </span>
          </Link>

          {/* Form Card */}
          {children}
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-bold mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Sistema completo para oficinas
          </div>

          <h2 className="text-4xl font-heading font-bold mb-6 leading-tight">
            Gerencie sua oficina com eficiência total
          </h2>

          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Clientes, veículos, ordens de serviço, estoque e financeiro em uma única plataforma moderna.
          </p>

          <div className="space-y-4">
            {[
              "✓ Teste grátis por 14 dias",
              "✓ Sem cartão de crédito",
              "✓ Cancele quando quiser",
              "✓ Suporte em português",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-blue-50">{item}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl font-heading font-bold text-yellow-400">500+</div>
              <div className="text-sm text-blue-200">Oficinas ativas</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-yellow-400">50k+</div>
              <div className="text-sm text-blue-200">OS gerenciadas</div>
            </div>
            <div>
              <div className="text-3xl font-heading font-bold text-yellow-400">98%</div>
              <div className="text-sm text-blue-200">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
