"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Car, FileText, Clock, Search } from "lucide-react";
import Link from "next/link";

export default function MotoristaDashboard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login-motorista");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const name = profile?.name?.split(" ")[0] || "Motorista";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">Olá, {name}! 👋</h1>
          <p className="text-blue-100 mt-2">Gerencie seus veículos e encontre oficinas</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Veículos", value: 0, icon: Car, color: "blue" },
            { label: "Orçamentos", value: 0, icon: FileText, color: "green" },
            { label: "Manutenções", value: 0, icon: Clock, color: "purple" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Buscar Oficinas", href: "/motorista/oficinas", icon: Search, primary: true },
            { label: "Minha Garagem", href: "/motorista/garagem", icon: Car },
            { label: "Orçamentos", href: "/motorista/orcamentos", icon: FileText },
            { label: "Histórico", href: "/motorista/historico", icon: Clock },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`rounded-xl p-6 text-center transition-all hover:-translate-y-1 ${
                action.primary
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border hover:border-blue-500"
              }`}
            >
              <action.icon className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">{action.label}</p>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-yellow-400 rounded-xl p-6">
          <p className="font-bold text-lg">🎉 Sua conta é 100% gratuita!</p>
          <p className="text-gray-800">Busque oficinas e solicite orçamentos sem pagar nada.</p>
        </div>
      </div>
    </div>
  );
}
