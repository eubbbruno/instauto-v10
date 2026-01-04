"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

export default function OficinaDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login-oficina");
      return;
    }

    if (user) {
      supabase
        .from("workshops")
        .select("*")
        .eq("profile_id", user.id)
        .single()
        .then(({ data }) => {
          if (!data) {
            router.push("/completar-cadastro");
          } else {
            setWorkshop(data);
          }
          setLoading(false);
        });
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!workshop) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Olá, {workshop.name}!</h1>
        <p className="text-gray-600 mb-8">Bem-vindo ao seu painel de controle.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Orçamentos</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Clientes</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">Receita</p>
            <p className="text-3xl font-bold">R$ 0</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2">🚀 Seu plano está ativo!</h2>
          <p className="text-blue-800">
            Você tem acesso a todos os recursos da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
