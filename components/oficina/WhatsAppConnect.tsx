"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP_APP_ID, WHATSAPP_CONFIG_ID, WHATSAPP_ES_FEATURE_TYPE } from "@/lib/config";
import { Loader2, MessageCircle, ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

/**
 * Botão de conexão via Embedded Signup (Coexistence). A oficina conecta o número
 * DELA sem perder o WhatsApp no celular. Ao concluir, manda o code + phone_number_id
 * + waba_id para /api/whatsapp/onboard.
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
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      )
        return;
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
        window.FB.init({
          appId: WHATSAPP_APP_ID,
          autoLogAppEvents: true,
          xfbml: true,
          version: "v21.0",
        });
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
        throw new Error("Não recebi os dados do número. Tente conectar de novo.");
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
      setError("Carregando… tente novamente em 1 segundo.");
      return;
    }
    session.current = {};
    window.FB.login(
      (response: any) => {
        const code = response?.authResponse?.code;
        if (!code) {
          setError("Conexão cancelada.");
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
    <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Conecte o WhatsApp da sua oficina</h2>
          <p className="text-sm text-gray-500">Atenda seus clientes por aqui — sem perder o WhatsApp no seu celular.</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { icon: Smartphone, t: "Você continua usando o WhatsApp normalmente no celular" },
          { icon: ShieldCheck, t: "Conexão oficial da Meta, sem risco de bloqueio" },
          { icon: CheckCircle2, t: "Conversas e IA direto no painel do Instauto" },
        ].map((f) => (
          <div key={f.t} className="flex items-center gap-3 text-sm text-gray-700">
            <f.icon className="w-5 h-5 text-[#1e3a8a] shrink-0" />
            <span>{f.t}</span>
          </div>
        ))}
      </div>

      <button
        onClick={launch}
        disabled={loading || !sdkReady}
        className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold disabled:opacity-60"
      >
        {loading || !sdkReady ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
        {loading ? "Conectando…" : !sdkReady ? "Carregando…" : "Conectar WhatsApp"}
      </button>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
