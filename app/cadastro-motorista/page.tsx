"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, Loader2, Mail, Lock, User, Car, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CadastroMotoristaPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name, "motorista");
      
      setSuccess(true);
      setError("");
      
      // Aguardar 2 segundos para o usuário ser criado no Supabase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Criar profile e motorist imediatamente via API
      try {
        const response = await fetch("/api/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            userType: "motorista",
            email: email,
            name: name
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao criar perfil inicial:", errorData);
          // Continua mesmo com erro - será criado no login
        } else {
          console.log("Profile e motorist criados com sucesso!");
        }
      } catch (apiError) {
        console.error("Erro na API:", apiError);
        // Continua mesmo com erro - será criado no login
      }
      
      // Redireciona para login com mensagem
      setTimeout(() => {
        router.push("/login-motorista?registered=true");
      }, 1000);
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle("motorista");
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar com Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Coluna da Imagem */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-white shadow-2xl backdrop-blur-xl">
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md"></div>
                <Image
                  src="/images/motorista.png"
                  alt="Cadastro Motorista"
                  width={400}
                  height={400}
                  className="object-contain drop-shadow-2xl relative z-10 rounded-3xl"
                />
              </div>
              <h2 className="text-3xl font-heading font-bold mb-4 text-center">
                Encontre as melhores oficinas
              </h2>
              <p className="text-blue-100 text-center text-lg leading-relaxed mb-6">
                Compare preços, veja avaliações reais e solicite orçamentos grátis. Tudo 100% gratuito para motoristas!
              </p>
              <div className="space-y-3 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-blue-50">Busca de oficinas próximas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-blue-50">Orçamentos online gratuitos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-blue-50">Avaliações de clientes reais</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-blue-50">Histórico de manutenções</span>
                </div>
              </div>
            </div>

            {/* Coluna do Formulário */}
            <div>
              <Card className="border-2 shadow-2xl">
                <CardHeader className="space-y-1 pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-3xl font-heading font-bold">Criar sua conta</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    100% grátis para motoristas - sem cartão de crédito
                  </CardDescription>
                </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border-2 border-green-200 text-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-bold text-base mb-1">🎉 Bem-vindo ao Instauto!</p>
                        <p className="text-sm">
                          Enviamos um email de confirmação para <strong>{email}</strong>
                        </p>
                        <p className="text-sm mt-2">
                          Por favor, verifique sua caixa de entrada (e spam) e clique no link de confirmação.
                        </p>
                        <p className="text-sm mt-2 text-green-700">
                          Redirecionando para o login...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading || success}
                      className="pl-10 h-12 border-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading || success}
                      className="pl-10 h-12 border-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-bold text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading || success}
                      className="pl-10 h-12 border-2"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading || success}
                      className="pl-10 h-12 border-2"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Criar Conta Grátis
                    </>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t-2" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-semibold">Ou continue com</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2"
                  onClick={handleGoogleSignup}
                  disabled={loading}
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continuar com Google
                </Button>

                <div className="text-center text-sm text-gray-600 mt-6">
                  Já tem uma conta?{" "}
                  <Link href="/login-motorista" className="font-semibold text-blue-600 hover:text-blue-700">
                    Fazer login
                  </Link>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700">
                    É uma oficina?{" "}
                    <Link href="/cadastro-oficina" className="font-bold text-blue-600 hover:text-blue-700 underline">
                      Cadastre sua oficina aqui
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

