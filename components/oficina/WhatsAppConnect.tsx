"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP_APP_ID, WHATSAPP_CONFIG_ID, WHATSAPP_ES_FEATURE_TYPE } from "@/lib/config";
import {
  Loader2, MessageCircle, ShieldCheck, Smartphone, CheckCircle2, CreditCard, HelpCircle,
} from "lucide-react";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

/**
 * Conexão via Embedded Signup (Coexistence), com passo a passo para donos de
 * oficina leigos em tecnologia. A oficina conecta o número DELA sem perder o
 * WhatsApp no celular.
 */
export function WhatsAppConnect({
  workshopId,
  onConnected,
}: {
  workshopId: string;
  onConnected?: () => void;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const session = useRef<{ phoneNumberId?: string; wabaId?: string }>({});

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.facebook.com" && event.origin !== "https://web.facebook.com") return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.type === "WA_EMBEDDED_SIGNUP" && data?.data) {
          if (data.data.phone_number_id) session.current.phoneNumberId = data.data.phone_number_id;
          if (data.data.waba_id) session.current.wabaId = data.data.waba_id;
        }
      } catch {}
    };
    window.addEventListener("message", onMessage);

    if (window.FB) {
      setSdkReady(true);
    } else {
      window.fbAsyncInit = function () {
        window.FB.init({ appId: WHATSAPP_APP_ID, autoLogAppEvents: true, xfbml: true, version: "v21.0" });
        setSdkReady(true);
      };
      if (!document.getElementById("facebook-jssdk")) {
        const js = document.createElement("script");
        js.id = "facebook-jssdk";
        js.async = true;
        js.defer = true;
        js.crossOrigin = "anonymous";
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        document.body.appendChild(js);
      }
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const finish = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const { phoneNumberId, wabaId } = session.current;
      if (!phoneNumberId || !wabaId) {
        throw new Error("Não recebemos os dados do número. Tente conectar novamente.");
      }
      const res = await fetch("/api/whatsapp/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopId, code, phoneNumberId, wabaId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Falha ao conectar");
      onConnected?.();
    } catch (e: any) {
      setError(e.message || "Erro ao conectar");
    } finally {
      setLoading(false);
    }
  };

  const launch = () => {
    setError(null);
    if (!window.FB) {
      setError("Aguarde 1 segundo (estamos carregando) e clique de novo.");
      return;
    }
    session.current = {};
    window.FB.login(
      (response: any) => {
        const code = response?.authResponse?.code;
        if (!code) {
          setError("Conexão cancelada. Você pode tentar de novo quando quiser.");
          return;
        }
        finish(code);
      },
      {
        config_id: WHATSAPP_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: { setup: {}, featureType: WHATSAPP_ES_FEATURE_TYPE, sessionInfoVersion: "3" },
      }
    );
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Cartão principal */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Conecte o WhatsApp da sua oficina</h2>
            <p className="text-sm text-gray-500">Atenda seus clientes por aqui — sem perder o WhatsApp do seu celular.</p>
          </div>
        </div>

        {/* Antes de começar */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mb-5">
          <p className="text-sm font-bold text-amber-900 mb-1.5">✅ Antes de começar, você precisa de:</p>
          <ul className="text-sm text-amber-900/90 space-y-1 list-disc pl-5">
            <li>O aplicativo <strong>WhatsApp Business</strong> instalado no celular da oficina (o app verde de empresa, não o WhatsApp comum).</li>
            <li>O celular com esse WhatsApp <strong>em mãos</strong> — você vai escanear um QR code.</li>
            <li>Uma conta do <strong>Facebook</strong> (qualquer uma sua) para autorizar — é rápido.</li>
          </ul>
        </div>

        {/* O que vai acontecer */}
        <p className="text-sm font-bold text-gray-800 mb-2">Como funciona (leva 2 minutos):</p>
        <ol className="space-y-2.5 mb-5">
          {[
            "Clique no botão “Conectar WhatsApp” abaixo.",
            "Uma janela do Facebook/Meta vai abrir. Faça login e siga confirmando.",
            "Escolha o número da sua oficina e, quando pedir, escaneie o QR code com o seu WhatsApp Business (no celular: Configurações → Aparelhos conectados → Conectar um aparelho).",
            "Pronto! Suas conversas começam a aparecer aqui no painel.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {/* Garantias */}
        <div className="space-y-2 mb-6">
          {[
            { icon: Smartphone, t: "Você continua usando o WhatsApp normalmente no celular" },
            { icon: ShieldCheck, t: "Conexão oficial da Meta — sem risco de bloqueio do número" },
            { icon: CheckCircle2, t: "Conversas e respostas automáticas com IA direto no painel" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-3 text-sm text-gray-700">
              <f.icon className="w-5 h-5 text-green-600 shrink-0" />
              <span>{f.t}</span>
            </div>
          ))}
        </div>

        <button
          onClick={launch}
          disabled={loading || !sdkReady}
          className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-base disabled:opacity-60 w-full sm:w-auto justify-center"
        >
          {loading || !sdkReady ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
          {loading ? "Conectando…" : !sdkReady ? "Carregando…" : "Conectar WhatsApp"}
        </button>

        {error && (
          <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg p-3">{error}</div>
        )}
      </div>

      {/* Cobrança — transparência */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#1e3a8a]" />
          </div>
          <div className="text-sm text-gray-600 leading-relaxed">
            <p className="font-bold text-gray-900 mb-1">Sobre a cobrança das mensagens</p>
            <p>
              As mensagens do WhatsApp são cobradas pela <strong>própria Meta</strong>, direto na sua oficina, conforme a tabela deles —
              <strong> não vem na sua mensalidade do Instauto</strong>. Conversas iniciadas pelo cliente costumam ter uma faixa gratuita todo mês.
              Durante a conexão, a Meta pode pedir para você cadastrar uma forma de pagamento na sua conta do WhatsApp Business.
            </p>
          </div>
        </div>
      </div>

      {/* Ajuda */}
      <div className="flex items-start gap-2 text-xs text-gray-400">
        <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Ficou com dúvida ou apareceu algum erro? Chame nosso suporte no WhatsApp que a gente te ajuda a conectar.</p>
      </div>
    </div>
  );
}
