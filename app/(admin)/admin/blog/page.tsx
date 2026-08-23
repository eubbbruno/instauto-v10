"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Sparkles, Save, Trash2, Pencil, Eye, EyeOff, RefreshCw, FileText, X,
} from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  emoji: string;
  reading_time: string;
  content: string;
  published: boolean;
  date: string;
}

const EMPTY = { id: "", title: "", excerpt: "", category: "Dicas", emoji: "🔧", readingTime: "5 min", content: "", published: true };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<"motorista" | "oficina">("motorista");
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const resetForm = () => { setForm({ ...EMPTY }); setEditingId(null); setError(null); };

  const generate = async () => {
    if (!topic.trim()) { setError("Informe um tema para a IA."); return; }
    setGenerating(true); setError(null);
    try {
      const res = await fetch("/api/admin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience }),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      setForm({
        id: "", title: d.title, excerpt: d.excerpt, category: d.category,
        emoji: d.emoji, readingTime: d.readingTime, content: d.content, published: true,
      });
      setEditingId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const method = editingId ? "PATCH" : "POST";
      const body = editingId ? { ...form, id: editingId } : form;
      const res = await fetch("/api/admin/blog", {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const d = await res.json();
      if (d.error) throw new Error(d.error);
      resetForm();
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const editPost = (p: Post) => {
    setEditingId(p.id);
    setForm({ id: p.id, title: p.title, excerpt: p.excerpt, category: p.category, emoji: p.emoji, readingTime: p.reading_time, content: p.content, published: p.published });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const togglePublish = async (p: Post) => {
    await fetch("/api/admin/blog", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, published: !p.published }) });
    load();
  };

  const del = async (p: Post) => {
    if (!confirm(`Excluir o post "${p.title}"?`)) return;
    await fetch(`/api/admin/blog?id=${p.id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <FileText className="w-7 h-7 text-[#1e3a8a]" /> Blog
          </h1>
          <p className="text-gray-600">Crie artigos com IA e publique direto no blog do site.</p>
        </div>
        <button onClick={load} className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Gerar com IA */}
      <div className="bg-gradient-to-br from-[#0B1120] via-[#13224a] to-[#1e3a8a] rounded-2xl p-5 sm:p-6 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="font-bold text-lg">Gerar artigo com IA</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Tema (ex.: como saber a hora de trocar a correia dentada)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-yellow-400/40 focus:outline-none text-sm"
          />
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
          >
            <option className="text-gray-900" value="motorista">Para motoristas</option>
            <option className="text-gray-900" value="oficina">Para oficinas</option>
          </select>
          <button
            onClick={generate}
            disabled={generating}
            className="btn-epic inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60 shrink-0"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Gerar rascunho
          </button>
        </div>
        <p className="text-white/50 text-xs mt-2">A IA cria o rascunho — você revisa e publica abaixo.</p>
      </div>

      {/* Editor */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">{editingId ? "Editar post" : "Novo post"}</h2>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
              <X className="w-4 h-4" /> Cancelar edição
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Título *"
            className="sm:col-span-4 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Resumo (aparece no card)"
            className="sm:col-span-4 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Categoria"
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.emoji} onChange={(e) => set("emoji", e.target.value)} placeholder="Emoji"
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <input value={form.readingTime} onChange={(e) => set("readingTime", e.target.value)} placeholder="Tempo de leitura"
            className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
          <label className="flex items-center gap-2 text-sm text-gray-700 px-2">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} />
            Publicado
          </label>
        </div>

        <textarea
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          rows={14}
          placeholder="Conteúdo em Markdown (## subtítulos, listas com -, **negrito**)"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono leading-relaxed resize-y"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving || !form.title.trim() || !form.content.trim()}
            className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editingId ? "Salvar alterações" : "Publicar post"}
          </button>
          {!editingId && <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">Limpar</button>}
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Posts ({posts.length})</h2>
        </div>
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" /></div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">Nenhum post ainda.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((p) => (
              <div key={p.id} className="p-4 flex items-center gap-3">
                <span className="text-2xl shrink-0">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                    {!p.published && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">rascunho</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">/{p.slug} · {p.category} · {p.date}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => togglePublish(p)} title={p.published ? "Despublicar" : "Publicar"} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50">
                    {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => editPost(p)} title="Editar" className="p-2 rounded-lg text-gray-400 hover:bg-gray-50"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(p)} title="Excluir" className="p-2 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
