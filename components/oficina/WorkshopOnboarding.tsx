"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Wrench, Bot, Loader2, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const UF_LIST = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
const ESPECIALIDADES = ["Freios","Motor","Suspensão","Elétrica","Ar Condicionado","Alinhamento","Balanceamento","Troca de Óleo","Revisão","Injeção Eletrônica","Funilaria","Pintura","Guincho"];

/**
 * Onboarding obrigatório da oficina: aparece enquanto faltar endereço/cidade.
 * Coleta localização (essencial p/ busca e SEO) + especialidades + base da IA
 * (para o Diagnóstico IA e o WhatsApp responderem com precisão).
 */
export function WorkshopOnboarding() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [workshopId, setWorkshopId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    address: "", city: "", state: "", specialties: [] as string[], hours: "", instructions: "",
  });

  useEffect(() => {
    if (!profile?.id) return;
    (async () => {
      const ws = await resolveWorkshop(supabase, profile.id);
      if (!ws) return;
      // Só mostra se faltar o essencial (endereço ou cidade)
      if (!ws.city || !ws.address) {
        setWorkshopId(ws.id);
        setForm((f) => ({
          ...f,
          address: ws.address || "",
          city: ws.city || "",
          state: ws.state || "",
          specialties: Array.isArray(ws.specialties) ? ws.specialties : [],
          hours: (ws as any).ai_business_hours || "",
          instructions: (ws as any).ai_instructions || "",
        }));
        setOpen(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSpec = (s: string) =>
    setForm((f) => ({ ...f, specialties: f.specialties.includes(s) ? f.specialties.filter((x) => x !== s) : [...f.specialties, s] }));

  const step1Valid = form.address.trim() && form.city.trim() && form.state;

  const save = async (finish: boolean) => {
    if (!workshopId) return;
    setSaving(true); setError(null);
    try {
      const { error } = await supabase.from("workshops").update({
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        state: form.state || null,
        specialties: form.specialties.length ? form.specialties : null,
        ai_business_hours: form.hours.trim() || null,
        ai_instructions: form.instructions.trim() || null,
      }).eq("id", workshopId);
      if (error) throw error;
      if (finish) {
        setOpen(false);
        // recarrega para o dashboard refletir os dados novos
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-br from-[#0B1120] via-[#13224a] to-[#1e3a8a] text-white p-6">
          <p className="text-white/50 text-xs mb-1">Passo {step + 1} de 2</p>
          <h2 className="text-xl font-bold">
            {step === 0 ? "Onde fica a sua oficina?" : "Deixe a IA conhecer sua oficina"}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {step === 0
              ? "Essencial para aparecer nas buscas e para os clientes te encontrarem."
              : "Assim o Diagnóstico IA e o WhatsApp respondem seus clientes com precisão."}
          </p>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 0 ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#1e3a8a]" /> Endereço *</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Rua, número, bairro"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cidade *</label>
                  <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Londrina"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent" />
                </div>
                <div className="w-24">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">UF *</label>
                  <select value={form.state} onChange={(e) => set("state", e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm">
                    <option value="">--</option>
                    {UF_LIST.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5"><Wrench className="w-4 h-4 text-[#1e3a8a]" /> Especialidades</label>
                <div className="flex flex-wrap gap-2">
                  {ESPECIALIDADES.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSpec(s)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.specialties.includes(s) ? "bg-[#1e3a8a] text-white border-[#1e3a8a]" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
                <Bot className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Opcional, mas recomendado: com essas informações a IA responde sobre horários, serviços e valores da SUA oficina.</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Horário de atendimento</label>
                <input value={form.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Seg a Sex 8h–18h, Sáb 8h–12h"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Base de conhecimento (para a IA)</label>
                <textarea value={form.instructions} onChange={(e) => set("instructions", e.target.value)} rows={5}
                  placeholder={"Ex.:\n- Fazemos troca de óleo, freios, suspensão e revisão.\n- Formas de pagamento: Pix, cartão em 3x, dinheiro.\n- 90 dias de garantia nos serviços."}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent" />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {/* Rodapé */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between gap-3">
          {step === 0 ? <span /> : (
            <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
          )}
          {step === 0 ? (
            <button onClick={() => setStep(1)} disabled={!step1Valid}
              className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-50">
              Continuar <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={() => save(true)} disabled={saving}
              className="btn-epic-blue inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold disabled:opacity-60">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Concluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
