"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Users, Plus, Copy, Check, DollarSign, RefreshCw, Power, Link2,
} from "lucide-react";

interface Affiliate {
  id: string;
  code: string;
  name: string;
  email: string | null;
  pix_key: string | null;
  commission_percent: number;
  commission_months: number;
  active: boolean;
  notes: string | null;
  link: string;
  signups: number;
  paying: number;
  payingInWindow: number;
  monthlyCommission: number;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function AdminAfiliadosPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Affiliate[]>([]);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", code: "", email: "", pixKey: "", commissionPercent: 20, commissionMonths: 12,
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliates");
      const data = await res.json();
      setRows(data.rows || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setForm({ name: "", code: "", email: "", pixKey: "", commissionPercent: 20, commissionMonths: 12 });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (a: Affiliate) => {
    await fetch("/api/admin/affiliates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: a.id, active: !a.active }),
    });
    load();
  };

  const copyLink = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const totalCommission = rows.reduce((s, r) => s + r.monthlyCommission, 0);
  const totalPaying = rows.reduce((s, r) => s + r.payingInWindow, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#1e3a8a]" /> Afiliados
          </h1>
          <p className="text-gray-600">Gere links de indicação e acompanhe a comissão devida.</p>
        </div>
        <button onClick={load} className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
          <p className="text-sm text-gray-500">Afiliados</p>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{totalPaying}</p>
          <p className="text-sm text-gray-500">Indicados pagantes (na janela)</p>
        </div>
        <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-4 md:p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">{brl(totalCommission)}</p>
          <p className="text-sm text-gray-500">Comissão estimada/mês</p>
        </div>
      </div>

      {/* Novo afiliado */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-[#1e3a8a]" /> Novo afiliado
        </h2>
        <form onSubmit={create} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nome do afiliado *" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.replace(/\s/g, "") })}
            placeholder="Código (ex.: JOAO10) *" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="E-mail" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.pixKey} onChange={(e) => setForm({ ...form, pixKey: e.target.value })}
            placeholder="Chave Pix (para pagar)" className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <div className="flex items-center gap-2">
            <input type="number" value={form.commissionPercent} min={0} max={100}
              onChange={(e) => setForm({ ...form, commissionPercent: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            <span className="text-sm text-gray-500 shrink-0">% comissão</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={form.commissionMonths} min={1} max={120}
              onChange={(e) => setForm({ ...form, commissionMonths: Number(e.target.value) })}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            <span className="text-sm text-gray-500 shrink-0">meses</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3">
            <button type="submit" disabled={creating}
              className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Criar afiliado
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" /></div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Nenhum afiliado ainda. Crie o primeiro acima.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {rows.map((a) => (
              <div key={a.id} className={`p-4 sm:p-5 ${!a.active ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{a.name}</p>
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{a.code}</span>
                      {!a.active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">inativo</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {a.commission_percent}% por {a.commission_months} meses
                      {a.pix_key ? ` · Pix: ${a.pix_key}` : ""}
                      {a.email ? ` · ${a.email}` : ""}
                    </p>
                    <button
                      onClick={() => copyLink(a.link, a.id)}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#1e3a8a] hover:underline"
                    >
                      {copied === a.id ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                      {copied === a.id ? "Link copiado!" : "Copiar link de indicação"}
                    </button>
                  </div>

                  <div className="flex items-center gap-5 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{a.signups}</p>
                      <p className="text-[11px] text-gray-500">cadastros</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{a.payingInWindow}</p>
                      <p className="text-[11px] text-gray-500">pagantes</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{brl(a.monthlyCommission)}</p>
                      <p className="text-[11px] text-gray-500">comissão/mês</p>
                    </div>
                    <button
                      onClick={() => toggleActive(a)}
                      title={a.active ? "Desativar" : "Ativar"}
                      className={`p-2 rounded-lg border ${a.active ? "border-gray-200 text-gray-500 hover:bg-gray-50" : "border-green-200 text-green-600 hover:bg-green-50"}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
        <DollarSign className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Comissão estimada com base nos indicados pagantes dentro da janela (assinatura ativa × % × enquanto dentro dos meses definidos).
          Pagamento é manual via Pix. Anuais entram pelo valor mensal equivalente.
        </span>
      </div>
    </div>
  );
}
