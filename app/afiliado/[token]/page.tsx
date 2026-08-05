"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Copy, Check, Users, DollarSign, TrendingUp, Link2 } from "lucide-react";

interface Data {
  name: string;
  code: string;
  active: boolean;
  percent: number;
  months: number;
  pixKey: string | null;
  link: string;
  signups: number;
  paying: number;
  payingInWindow: number;
  monthlyCommission: number;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AfiliadoPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/affiliate/me?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Erro ao carregar"))
      .finally(() => setLoading(false));
  }, [token]);

  const copy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-6">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 mb-1">Link inválido</p>
          <p className="text-gray-500 text-sm">{error || "Não encontramos esse painel de afiliado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Topo */}
      <div className="bg-gradient-to-br from-[#0B1120] via-[#13224a] to-[#1e3a8a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Image src="/images/instauto-amarelo-branco.svg" alt="Instauto" width={130} height={36} className="h-7 w-auto mb-6" />
          <p className="text-white/50 text-sm">Painel do afiliado</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Olá, {data.name}! 👋</h1>
          <p className="text-white/70 text-sm mt-1">
            Você ganha <strong className="text-brand-yellow">{data.percent}%</strong> de cada oficina que assinar pela sua indicação, por {data.months} meses.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Link de indicação */}
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm">
          <p className="font-bold text-gray-900 flex items-center gap-2 mb-2">
            <Link2 className="w-5 h-5 text-[#1e3a8a]" /> Seu link de indicação
          </p>
          <p className="text-sm text-gray-500 mb-3">Compartilhe com oficinas. Quem se cadastrar por ele conta como sua indicação.</p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="flex-1 min-w-0 truncate bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700">
              {data.link}
            </code>
            <button onClick={copy} className="btn-epic-blue inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold shrink-0">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Números */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.signups}</p>
            <p className="text-sm text-gray-500">Oficinas cadastradas</p>
          </div>
          <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{data.payingInWindow}</p>
            <p className="text-sm text-gray-500">Assinantes ativos</p>
          </div>
          <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 shadow-sm">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{brl(data.monthlyCommission)}</p>
            <p className="text-sm text-gray-500">Sua comissão/mês (estimada)</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm text-sm text-gray-600 space-y-2">
          <p className="font-bold text-gray-900">Como funciona o pagamento</p>
          <p>
            A comissão é paga <strong>mensalmente via Pix</strong> com base nas oficinas indicadas que estão com assinatura ativa,
            durante {data.months} meses a partir de cada indicação.
          </p>
          {data.pixKey && <p className="text-gray-500">Pix cadastrado: <strong>{data.pixKey}</strong></p>}
          {!data.active && (
            <p className="text-red-600 font-medium">Seu cadastro de afiliado está inativo no momento. Fale com a gente.</p>
          )}
        </div>
      </div>
    </div>
  );
}
