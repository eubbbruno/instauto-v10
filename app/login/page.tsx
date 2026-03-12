"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Car, Wrench, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const tipoParam = searchParams.get("tipo"); // "motorista" ou "oficina"
  
  const [userType, setUserType] = useState<"motorista" | "oficina">(
    tipoParam === "oficina" ? "oficina" : "motorista"
  );
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

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
        console.log("🔍 [Login] Buscando profile para user:", data.user.id);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("type")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("❌ [Login] Erro ao buscar profile:", profileError);
          toast.error("Erro ao carregar perfil. Tente novamente.");
          setLoading(false);
          return;
        }

        console.log("✅ [Login] Profile encontrado:", profile);
        console.log("✅ [Login] Profile tipo:", profile?.type);

        if (profile?.type === "workshop") {
          console.log("🔀 [Login] Redirecionando para /oficina");
          router.push("/oficina");
        } else {
          console.log("🔀 [Login] Redirecionando para /motorista");
          router.push("/motorista");
        }
      } else {
        // CADASTRO
        console.log("🔵 [Cadastro] Criando conta...");
        console.log("🔵 [Cadastro] Email:", email);
        console.log("🔵 [Cadastro] Nome:", name);
        console.log("🔵 [Cadastro] Tipo:", userType);

        if (!name || name.trim().length < 2) {
          toast.error("Por favor, preencha seu nome");
          setLoading(false);
          return;
        }

        // Salvar tipo no cookie ANTES do signUp (para o callback ler depois)
        const userTypeValue = userType === "oficina" ? "oficina" : "motorista";
        document.cookie = `instauto_user_type=${userTypeValue}; path=/; max-age=3600`;
        console.log("🍪 [Cadastro] Cookie salvo:", userTypeValue);
        console.log("🍪 [Cadastro] Cookies atuais:", document.cookie);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              name: name,
              user_type: userType === "oficina" ? "workshop" : "motorist",
            },
          },
        });

        console.log("🔵 [Cadastro] Resposta signUp:", { 
          user: data.user?.email, 
          session: data.session ? "EXISTS" : "NULL",
          error 
        });

        if (error) {
          console.error("❌ [Cadastro] Erro no signUp:", error);
          throw error;
        }

        if (!data.user) {
          console.error("❌ [Cadastro] Nenhum usuário retornado");
          throw new Error("Erro ao criar conta. Tente novamente.");
        }

        console.log("✅ [Cadastro] Usuário criado:", data.user.email);
        console.log("✅ [Cadastro] User ID:", data.user.id);
        console.log("✅ [Cadastro] Session:", data.session ? "Existe" : "Null - precisa confirmar email");

        // Se não tem session, significa que precisa confirmar email
        if (!data.session) {
          console.log("⚠️ [Cadastro] Sem session - confirmação de email necessária");
          setRegisteredEmail(email);
          setShowEmailConfirmation(true);
          setLoading(false);
          return;
        }

        // Se tem session, continuar com criação de profile
        const profileType = userType === "oficina" ? "workshop" : "motorist";
        
        console.log("🔨 [Cadastro] Criando profile tipo:", profileType);
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          type: profileType,
        });

        if (profileError) {
          console.error("❌ [Cadastro] Erro ao criar profile:", profileError);
          throw new Error("Erro ao criar perfil: " + profileError.message);
        }
        console.log("✅ [Cadastro] Profile criado!");

        // Criar workshop ou motorist
        if (profileType === "workshop") {
          console.log("🔨 [Cadastro] Criando workshop...");
          const { error: workshopError } = await supabase.from("workshops").insert({
            profile_id: data.user.id,
            name: name || "Minha Oficina",
            plan_type: "free",
            subscription_status: "trial",
            trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            is_public: true,
            accepts_quotes: true,
          });

          if (workshopError) {
            console.error("❌ [Cadastro] Erro ao criar workshop:", workshopError);
            throw new Error("Erro ao criar oficina: " + workshopError.message);
          }
          console.log("✅ [Cadastro] Workshop criado!");
          
          toast.success("Conta criada com sucesso!");
          console.log("🔀 [Cadastro] Redirecionando para /oficina");
          setTimeout(() => router.push("/oficina"), 500);
        } else {
          console.log("🔨 [Cadastro] Criando motorist...");
          const { error: motoristError } = await supabase.from("motorists").insert({
            profile_id: data.user.id,
          });

          if (motoristError) {
            console.error("❌ [Cadastro] Erro ao criar motorist:", motoristError);
            throw new Error("Erro ao criar motorista: " + motoristError.message);
          }
          console.log("✅ [Cadastro] Motorist criado!");
          
          toast.success("Conta criada com sucesso!");
          console.log("🔀 [Cadastro] Redirecionando para /motorista");
          setTimeout(() => router.push("/motorista"), 500);
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
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-12">
            <Image
              src="/images/logo.svg"
              alt="Instauto"
              width={220}
              height={60}
              className="h-14 w-auto"
            />
          </Link>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Bem-vindo ao<br />
            <span className="text-yellow-400">Instauto</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-12">
            A plataforma que conecta motoristas e oficinas mecânicas de forma simples e eficiente.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Oficinas Verificadas</h3>
                <p className="text-blue-200 text-sm">Encontre profissionais confiáveis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Orçamentos Grátis</h3>
                <p className="text-blue-200 text-sm">Compare preços sem compromisso</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Gestão Completa</h3>
                <p className="text-blue-200 text-sm">Controle total dos seus veículos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Instauto</span>
            </Link>
          </div>

          {/* Card do Formulário */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Mensagem de Confirmação de Email */}
            {showEmailConfirmation ? (
              <div className="text-center py-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Verifique seu email! 📧
                </h2>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">
                  Enviamos um link de confirmação para:
                </p>
                <p className="font-semibold text-blue-600 mb-6 text-sm sm:text-base break-all px-4">
                  {registeredEmail}
                </p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-900 font-medium mb-2">
                    📬 Próximos passos:
                  </p>
                  <ol className="text-sm text-blue-800 text-left space-y-2">
                    <li>1. Abra seu email</li>
                    <li>2. Clique no link de confirmação</li>
                    <li>3. Você será redirecionado automaticamente</li>
                  </ol>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowEmailConfirmation(false);
                      setIsLogin(true);
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Entendi, vou verificar
                  </button>
                  <p className="text-xs text-gray-400">
                    Não recebeu? Verifique a pasta de spam ou tente novamente.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
                  {isLogin ? "Entrar" : "Criar conta"}
                </h1>
                <p className="text-gray-500 text-center mb-8">
                  {isLogin ? "Bem-vindo de volta!" : "Comece a usar o Instauto"}
                </p>

                {/* Tabs Motorista/Oficina */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setUserType("motorista")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  userType === "motorista"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Car className="w-5 h-5" />
                <span>Motorista</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType("oficina")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  userType === "oficina"
                    ? "bg-white shadow-sm text-yellow-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Wrench className="w-5 h-5" />
                <span>Oficina</span>
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
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {userType === "oficina" ? "Nome da Oficina" : "Seu Nome"} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={userType === "oficina" ? "Auto Center Silva" : "João Silva"}
                      required
                      minLength={2}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}

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
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 mt-6"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLogin ? "Entrar" : "Criar conta"}
              </button>
            </form>

            {/* Toggle Login/Cadastro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                >
                  {isLogin ? "Criar conta grátis" : "Fazer login"}
                </button>
              </p>
            </div>
              </>
            )}
          </div>

          {/* Voltar */}
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
      </div>
    </div>
  );
}
