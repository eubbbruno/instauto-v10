"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para início
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
