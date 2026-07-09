"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "instauto_cookie_consent"; // "all" | "necessary"

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mostra só se ainda não houve escolha
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // pequeno atraso para não competir com o carregamento inicial
        const t = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage indisponível — não bloqueia a navegação */
    }
  }, []);

  const choose = (value: "all" | "necessary") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      document.cookie = `instauto_cookie_consent=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-4xl mx-auto bg-navy text-white border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 ring-1 ring-brand-yellow/25 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-brand-yellow" />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Usamos cookies para manter o site funcionando, medir o uso e melhorar sua experiência.
              Você pode aceitar todos ou manter apenas os essenciais. Saiba mais na{" "}
              <Link href="/cookies" className="text-brand-yellow font-semibold hover:underline">
                Política de Cookies
              </Link>.
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => choose("necessary")}
              className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              Só necessários
            </button>
            <button
              onClick={() => choose("all")}
              className="btn-epic flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold"
            >
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
