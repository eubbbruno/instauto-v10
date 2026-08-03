"use client";

import { useEffect, useState } from "react";
import { Loader2, Bot, Stethoscope, MessageSquare, DollarSign, RefreshCw, AlertTriangle } from "lucide-react";

interface Row {
  workshopId: string;
  name: string;
  plan: string;
  diagnostico: number;
  chat: number;
  costUsd: number;
  costBrl: number;
}
interface Totals { diagnostico: number; chat: number; costUsd: number; costBrl: number; }

function monthOptions() {
  const opts: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    opts.push({ value, label: d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) });
  }
  return opts;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminIAPage() {
  const months = monthOptions();
  const [month, setMonth] = useState(months[0].value);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [totals, setTotals] = useState<Totals>({ diagnostico: 0, chat: 0, costUsd: 0, costBrl: 0 });

  const load = async (m: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ai-usage?month=${m}`);
      const data = await res.json();
      setRows(data.rows || []);
      setTotals(data.totals || { diagnostico: 0, chat: 0, costUsd: 0, costBrl: 0 });
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(month); }, [month]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Bot className="w-7 h-7 text-[#1e3a8a]" /> Uso e custo de IA
          </h1>
          <p className="text-gray-600">Consumo de IA por oficina — diagnósticos e respostas de chat.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm capitalize"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value} className="capitalize">{m.label}</option>
            ))}
          </select>
          <button onClick={() => load(month)} className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Stethoscope className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.diagnostico}</p>
          <p className="text-sm text-gray-500">Diagnósticos</p>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totals.chat}</p>
          <p className="text-sm text-gray-500">Respostas de chat</p>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{brl(totals.costBrl)}</p>
          <p className="text-sm text-gray-500">Custo estimado (R$)</p>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-gray-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${totals.costUsd.toFixed(2)}</p>
          <p className="text-sm text-gray-500">Custo estimado (USD)</p>
        </div>
      </div>

      {/* Tabela por oficina */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Consumo por oficina</h2>
          <p className="text-sm text-gray-500">Ordenado por custo estimado (maior primeiro).</p>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" /></div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Bot className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Nenhum uso de IA neste mês.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-5 py-3 font-medium">Oficina</th>
                  <th className="px-5 py-3 font-medium">Plano</th>
                  <th className="px-5 py-3 font-medium text-right">Diagnósticos</th>
                  <th className="px-5 py-3 font-medium text-right">Chat</th>
                  <th className="px-5 py-3 font-medium text-right">Custo est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((r) => (
                  <tr key={r.workshopId} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        r.plan === "free" ? "bg-gray-100 text-gray-600" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-700">{r.diagnostico}</td>
                    <td className="px-5 py-3 text-right text-gray-700">{r.chat}</td>
                    <td className="px-5 py-3 text-right font-semibold text-gray-900">{brl(r.costBrl)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aviso */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Custo estimado com base no modelo gpt-4o-mini (~$0,0012/diagnóstico e ~$0,0004/resposta), convertido a R$5,50/USD.
          O valor real na fatura da OpenAI pode variar conforme o tamanho das mensagens. Defina também um teto global de gasto na conta da OpenAI.
        </span>
      </div>
    </div>
  );
}
