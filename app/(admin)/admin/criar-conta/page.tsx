"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, UserPlus, Copy, CheckCircle2 } from "lucide-react";

function genPassword() {
  return "insta" + Math.floor(1000 + Math.random() * 9000);
}

function Content() {
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setName(params.get("name") || "");
    setPhone(params.get("phone") || "");
    setCity(params.get("city") || "");
    setPassword(genPassword());
  }, [params]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/create-workshop-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erro ao criar conta");
      setDone({ email: data.email, password: data.password });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const message = done
    ? `Olá ${name}! Sua conta no Instauto já está pronta 🙌\n\nÉ só entrar aqui: https://www.instauto.com.br/login\n\nEmail: ${done.email}\nSenha: ${done.password}\n\nQualquer dúvida me chama que eu te ajudo!`
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <UserPlus className="w-7 h-7 text-[#1e3a8a]" /> Criar conta de oficina
      </h1>
      <p className="text-gray-600 mb-6">Cria a conta pronta (sem fricção) para o lead. Depois é só mandar o acesso.</p>

      {!done ? (
        <form onSubmit={submit} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nome da oficina *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email do dono *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="email@exemplo.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">WhatsApp</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cidade</label>
              <input value={city} onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Senha *</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono" />
            <p className="text-xs text-gray-400 mt-1">Senha simples gerada automaticamente — pode editar.</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading}
            className="btn-epic-blue inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Criar conta pronta
          </button>
        </form>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="font-bold text-green-800 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> Conta criada!
          </p>
          <div className="bg-white rounded-xl p-4 text-sm font-mono border border-green-100 mb-4">
            <p><strong>Login:</strong> {done.email}</p>
            <p><strong>Senha:</strong> {done.password}</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">Mensagem pronta pra mandar no WhatsApp:</p>
          <div className="bg-white rounded-xl p-3 text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 mb-3">{message}</div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={copy} className="inline-flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-semibold">
              <Copy className="w-4 h-4" /> {copied ? "Copiado!" : "Copiar mensagem"}
            </button>
            <button onClick={() => { setDone(null); setName(""); setEmail(""); setPhone(""); setCity(""); setPassword(genPassword()); }}
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Criar outra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CriarContaPage() {
  return (
    <Suspense fallback={<div className="p-8"><Loader2 className="w-6 h-6 animate-spin text-[#1e3a8a]" /></div>}>
      <Content />
    </Suspense>
  );
}
