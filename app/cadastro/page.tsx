import Link from "next/link";
import Image from "next/image";
import { Car, Wrench, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Criar conta | Instauto",
  description: "Escolha o tipo de conta para começar: motorista ou oficina.",
};

export default function CadastroChooserPage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-brand-yellow/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/images/instauto-amarelo-branco.svg"
              alt="Instauto"
              width={160}
              height={44}
              className="h-9 w-auto mx-auto"
            />
          </Link>
          <p className="text-eyebrow text-brand-gold mb-3">Criar conta</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-black mb-3">Como você quer usar o Instauto?</h1>
          <p className="text-white/55">Escolha o tipo de conta para começar</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {/* Motorista */}
          <Link href="/cadastro/motorista" className="group">
            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-brand-blue/20 ring-1 ring-brand-blue/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-brand-blue" />
              </div>
              <h2 className="text-xl font-bold mb-2">Sou Motorista</h2>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                Buscar oficinas, solicitar orçamentos e gerenciar meus veículos.
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-green-500/15 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                  100% Grátis
                </span>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Oficina */}
          <Link href="/cadastro/oficina" className="group">
            <div className="h-full bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-brand-yellow/30 transition-all">
              <div className="w-14 h-14 bg-brand-yellow/15 ring-1 ring-brand-yellow/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Wrench className="w-7 h-7 text-brand-yellow" />
              </div>
              <h2 className="text-xl font-bold mb-2">Sou Oficina</h2>
              <p className="text-white/50 text-sm mb-4 leading-relaxed">
                Sistema completo de gestão e visibilidade para novos clientes.
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-brand-yellow/15 text-brand-yellow px-3 py-1 rounded-full text-xs font-bold">
                  14 dias grátis
                </span>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-brand-yellow group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center text-white/50 text-sm mt-8">
          Já tem conta?{" "}
          <Link href="/login" className="text-brand-yellow font-semibold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
