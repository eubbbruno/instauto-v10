"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, Wrench, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [userType, setUserType] = useState<"motorista" | "oficina">("motorista");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const supabase = createClient();

  // Login com Email/Senha
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        console.log("🔵 [Login] Fazendo login com email...");
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        console.log("✅ [Login] Login bem-sucedido:", data.user.email);

        // Se tem redirect, vai para lá
        if (redirectUrl) {
          console.log("🔀 [Login] Redirecionando para:", redirectUrl);
          router.push(redirectUrl);
          return;
        }

        // Buscar profile para saber o tipo
        const { data: profile } = await supabase
          .from("profiles")
          .select("type")
          .eq("id", data.user.id)
          .single();

        console.log("✅ [Login] Profile tipo:", profile?.type);

        if (profile?.type === "workshop") {
          router.push("/oficina");
        } else {
          router.push("/motorista");
        }
      } else {
        // CADASTRO
        console.log("🔵 [Cadastro] Criando conta...");
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
              user_type: userType === "oficina" ? "workshop" : "motorist",
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          console.log("✅ [Cadastro] Usuário criado:", data.user.email);

          // Criar profile
          const profileType = userType === "oficina" ? "workshop" : "motorist";
          
          console.log("🔨 [Cadastro] Criando profile tipo:", profileType);
          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            name: name,
            type: profileType,
          });

          // Criar workshop ou motorist
          if (profileType === "workshop") {
            console.log("🔨 [Cadastro] Criando workshop...");
            await supabase.from("workshops").insert({
              profile_id: data.user.id,
              name: name || "Minha Oficina",
              plan_type: "free",
              subscription_status: "trial",
              trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              is_public: true,
              accepts_quotes: true,
            });
            console.log("✅ [Cadastro] Workshop criado!");
            router.push("/oficina");
          } else {
            console.log("🔨 [Cadastro] Criando motorist...");
            await supabase.from("motorists").insert({
              profile_id: data.user.id,
            });
            console.log("✅ [Cadastro] Motorist criado!");
            router.push("/motorista");
          }

          toast.success("Conta criada com sucesso!");
        }
      }
    } catch (error: any) {
      console.error("❌ [Auth] Erro:", error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  // Login com Google
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      console.log("🔵 [Google] Iniciando login, tipo:", userType);
      
      // Salvar tipo no localStorage E no cookie
      localStorage.setItem("instauto_user_type", userType);
      document.cookie = `instauto_user_type=${userType}; path=/; max-age=3600`;
      
      console.log("✅ [Google] Tipo salvo no localStorage e cookie");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      console.log("✅ [Google] Redirecionando para OAuth...");
    } catch (error: any) {
      console.error("❌ [Google] Erro:", error);
      toast.error("Erro ao conectar com Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Instauto</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {isLogin ? "Entrar" : "Criar conta"}
          </h1>
          <p className="text-gray-500 text-center mb-6">
            {isLogin ? "Bem-vindo de volta!" : "Comece a usar o Instauto"}
          </p>

          {/* Seletor de Tipo */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType("motorista")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                userType === "motorista"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Car className={`w-6 h-6 mx-auto mb-2 ${userType === "motorista" ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`text-sm font-medium ${userType === "motorista" ? "text-blue-600" : "text-gray-600"}`}>
                Motorista
              </span>
            </button>
            <button
              type="button"
              onClick={() => setUserType("oficina")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                userType === "oficina"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Wrench className={`w-6 h-6 mx-auto mb-2 ${userType === "oficina" ? "text-blue-600" : "text-gray-400"}`} />
              <span className={`text-sm font-medium ${userType === "oficina" ? "text-blue-600" : "text-gray-600"}`}>
                Oficina
              </span>
            </button>
          </div>

          {/* Botão Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-4 disabled:opacity-50"
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

          {/* Divisor */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Formulário */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {userType === "oficina" ? "Nome da Oficina" : "Seu Nome"}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={userType === "oficina" ? "Auto Center Silva" : "João Silva"}
                  required={!isLogin}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? "Entrar" : "Criar conta"}
            </button>
          </form>

          {/* Toggle Login/Cadastro */}
          <p className="text-center text-gray-600 mt-6">
            {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-medium hover:underline"
            >
              {isLogin ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>

        {/* Voltar */}
        <p className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            ← Voltar para o início
          </Link>
        </p>
      </div>
    </div>
  );
}
