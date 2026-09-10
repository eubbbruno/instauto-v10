"use client";

import { useState } from "react";
import { Loader2, Send, FileText, ListChecks, Video } from "lucide-react";

type Result = { ok?: boolean; error?: string; [k: string]: unknown };

export default function WhatsAppReviewPage() {
  const [to, setTo] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const call = async (action: string, body: Record<string, unknown> = {}) => {
    setLoading(action);
    setResult(null);
    try {
      const res = await fetch("/api/admin/whatsapp-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      setResult(await res.json());
    } catch (e: any) {
      setResult({ ok: false, error: e?.message || "Erro" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Admin / WhatsApp</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Análise do App — Gravação</h1>
        <p className="text-sm text-gray-600 mt-1">
          Use os botões abaixo para gravar os 2 vídeos que a Meta pede. Grave a tela (ex.: Loom, Xbox Game Bar Win+G, ou o próprio celular).
        </p>
      </div>

      {/* Roteiro */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 space-y-2">
        <p className="flex items-center gap-2 font-bold"><Video className="w-4 h-4" /> Roteiro rápido</p>
        <p><strong>Vídeo 1 (whatsapp_business_messaging):</strong> deixe o WhatsApp aberto ao lado (celular ou WhatsApp Web). Clique em <strong>“Enviar mensagem de teste”</strong> e filme a mensagem <strong>chegando</strong> no WhatsApp.</p>
        <p><strong>Vídeo 2 (whatsapp_business_management):</strong> clique em <strong>“Criar template”</strong> e depois em <strong>“Listar templates”</strong>, mostrando o modelo criado aparecendo na lista.</p>
      </div>

      {/* Vídeo 1 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <p className="font-bold text-gray-900 flex items-center gap-2"><Send className="w-4 h-4 text-[#1e3a8a]" /> Vídeo 1 — Enviar mensagem</p>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Seu WhatsApp verificado (ex.: 5543996466446)"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
        />
        <button
          onClick={() => call("send", { to })}
          disabled={loading === "send"}
          className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60"
        >
          {loading === "send" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Enviar mensagem de teste
        </button>
        <p className="text-xs text-gray-400">Envia o template <code>hello_world</code>. O número precisa estar na lista de destinatários verificados do número de teste.</p>
      </div>

      {/* Vídeo 2 */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3">
        <p className="font-bold text-gray-900 flex items-center gap-2"><FileText className="w-4 h-4 text-[#1e3a8a]" /> Vídeo 2 — Gerenciar templates</p>
        <input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Nome do template (opcional, ex.: instauto_atendimento)"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
        />
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => call("create-template", { name: templateName })}
            disabled={loading === "create-template"}
            className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60"
          >
            {loading === "create-template" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Criar template
          </button>
          <button
            onClick={() => call("list-templates")}
            disabled={loading === "list-templates"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {loading === "list-templates" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
            Listar templates
          </button>
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div className={`rounded-2xl p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-words ${result.ok ? "bg-green-50 border border-green-200 text-green-900" : "bg-red-50 border border-red-200 text-red-900"}`}>
          {JSON.stringify(result, null, 2)}
        </div>
      )}
    </div>
  );
}
