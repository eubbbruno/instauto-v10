"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

function BemVindoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Só permite destinos internos conhecidos (evita open redirect)
  const rawNext = searchParams.get("next") || "/motorista";
  const next = ["/oficina", "/motorista", "/admin"].includes(rawNext) ? rawNext : "/motorista";

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          router.push(next);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [next, router]);

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-brand-yellow/8 blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-10">
          <Image
            src="/images/instauto-amarelo-branco.svg"
            alt="Instauto"
            width={150}
            height={42}
            className="h-9 w-auto mx-auto"
          />
        </Link>

        <div className="w-20 h-20 rounded-full bg-green-500/15 ring-1 ring-green-400/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-11 h-11 text-green-400" />
        </div>

        <p className="text-eyebrow text-brand-gold mb-3">Conta confirmada</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-black mb-3">
          Tudo certo! 🎉
        </h1>
        <p className="text-white/55 text-lg mb-8 leading-relaxed">
          Sua conta foi confirmada com sucesso. Bem-vindo ao Instauto!
        </p>

        <Link
          href={next}
          className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold w-full sm:w-auto"
        >
          Ir para o meu painel
          <ArrowRight className="w-5 h-5" />
        </Link>

        <p className="text-white/35 text-sm mt-6 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Redirecionando em {seconds}s…
        </p>
      </div>
    </div>
  );
}

export default function BemVindoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <Loader2 className="w-10 h-10 animate-spin text-brand-yellow" />
      </div>
    }>
      <BemVindoContent />
    </Suspense>
  );
}
