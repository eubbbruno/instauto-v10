"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";
import { FadeIn } from "@/components/ui/motion";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = createClient();

  const redirectByProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("❌ [Login] Erro ao buscar profile:", error);
      toast.error("Erro ao carregar perfil. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(profile?.type === "workshop" ? "/oficina" : "/motorista");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Redirect explícito tem prioridade (ex.: solicitar-orçamento)
      if (redirectUrl) {
        router.push(redirectUrl);
        return;
      }

      await redirectByProfile(data.user.id);
    } catch (error: any) {
      console.error("❌ [Login] Erro:", error);
      toast.error(error.message || "Email ou senha incorretos");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error("❌ [Google] Erro:", error);
      toast.error("Erro ao conectar com Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-brand-yellow/8 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-14">
            <Image
              src="/images/instauto-amarelo-branco.svg"
              alt="Instauto"
              width={160}
              height={44}
              className="h-10 w-auto"
            />
          </Link>

          <p className="text-eyebrow text-brand-gold mb-4">Para motoristas e oficinas</p>
          <h1 className="font-heading text-4xl lg:text-5xl font-black leading-tight tracking-tight mb-6">
            Bem-vindo de<br />
            <span className="text-brand-yellow">volta.</span>
          </h1>

          <p className="text-white/55 text-lg mb-12 max-w-sm leading-relaxed">
            A maior plataforma de oficinas mecânicas do Brasil. Encontre, compare e agende.
          </p>

          <div className="space-y-5">
            {[
              { title: "Oficinas Verificadas", sub: "Avaliações reais de motoristas" },
              { title: "Orçamentos Grátis",    sub: "Compare preços sem compromisso" },
              { title: "Gestão Completa",      sub: "Para donos de oficina crescerem" },
            ].map(({ title, sub }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 ring-1 ring-brand-yellow/25 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="font-semibold text-white text-[15px]">{title}</p>
                  <p className="text-white/45 text-sm">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F8F9FB]">
        <FadeIn className="w-full max-w-md">
          <div className="w-full max-w-md">
            {/* Logo Mobile */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/">
                <div className="inline-flex items-center gap-2 bg-navy px-4 py-2 rounded-xl">
                  <Image src="/images/instauto-amarelo-branco.svg" alt="Instauto" width={120} height={32} className="h-7 w-auto" />
                </div>
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                Entrar
              </h1>
              <p className="text-sm sm:text-base text-gray-500 text-center mb-6 sm:mb-8">
                Bem-vindo de volta!
              </p>

              {/* Botão Google */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 sm:py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50 min-h-[48px]"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span className="font-medium text-gray-700">
                  {googleLoading ? "Conectando..." : "Continuar com Google"}
                </span>
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Senha *</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-epic-blue py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 min-h-[48px]"
                >
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Entrar
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem conta?{" "}
                  <Link
                    href="/cadastro"
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                  >
                    Criar conta grátis
                  </Link>
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
              >
                <span>←</span>
                <span>Voltar para o site</span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="w-10 h-10 animate-spin text-[#1e3a8a]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
