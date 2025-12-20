"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, Loader2, Mail, Lock, Building2, Sparkles } from "lucide-react";

export default function CadastroPage() {
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
      await signUp(email, password, name, "oficina");
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar com Google.");
      setLoading(false);
    }
  };

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-3xl font-heading font-bold">Criar sua conta</CardTitle>
        <CardDescription className="text-base">
          Comece grátis - teste por 14 dias sem compromisso
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
            <div className="bg-green-50 border-2 border-green-200 text-green-800 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm font-medium">
                Conta criada com sucesso! Redirecionando...
              </span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold text-gray-700">
              Nome da Oficina
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Oficina do João"
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
              Confirmar Senha
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

          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-gray-900">Plano FREE inclui:</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                Até 10 clientes grátis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                30 OS por mês
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                Sem cartão de crédito
              </li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-lg shadow-yellow-500/30"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar Conta Grátis"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t-2" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-bold">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-2 font-bold"
            onClick={handleGoogleSignup}
            disabled={loading || success}
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
            Google
          </Button>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
