"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">😕</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Algo deu errado
        </h2>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar novamente
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para início
          </Link>
        </div>
      </div>
    </div>
  );
}
