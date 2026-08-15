"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { resolveWorkshop } from "@/lib/workshop";
import { useAuth } from "@/contexts/AuthContext";
import PlanGuard from "@/components/auth/PlanGuard";
import { Loader2, Printer, ClipboardCheck, Info } from "lucide-react";

export default function ChecklistPage() {
  return (
    <PlanGuard feature="Checklist de inspeção">
      <ChecklistContent />
    </PlanGuard>
  );
}

// Itens padrão de inspeção veicular, agrupados
const GROUPS: { title: string; items: string[] }[] = [
  { title: "Motor", items: ["Nível e qualidade do óleo", "Correias e tensionadores", "Mangueiras e vazamentos", "Filtro de ar", "Fluido de arrefecimento"] },
  { title: "Freios", items: ["Pastilhas / lonas", "Discos / tambores", "Fluido de freio", "Freio de estacionamento"] },
  { title: "Suspensão e Direção", items: ["Amortecedores", "Buchas e coxins", "Terminais e pivôs", "Folgas na direção", "Alinhamento / balanceamento"] },
  { title: "Pneus e Rodas", items: ["Desgaste / profundidade dos sulcos", "Calibragem", "Estepe", "Parafusos e rodas"] },
  { title: "Elétrica", items: ["Bateria", "Faróis, lanternas e setas", "Luz de freio e ré", "Buzina", "Palhetas do limpador"] },
  { title: "Fluidos e Níveis", items: ["Óleo do motor", "Fluido de freio", "Água do radiador", "Fluido da direção hidráulica", "Água do reservatório do limpador"] },
  { title: "Geral", items: ["Escapamento", "Ar-condicionado", "Cintos de segurança", "Luzes de aviso no painel"] },
];

function escapeHtml(s: string) {
  return (s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

function ChecklistContent() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [workshopName, setWorkshopName] = useState("");
  const [form, setForm] = useState({
    cliente: "", placa: "", veiculo: "", ano: "", km: "", data: new Date().toISOString().slice(0, 10), mecanico: "", extras: "",
  });

  useEffect(() => {
    (async () => {
      if (profile?.id) {
        const ws = await resolveWorkshop(supabase, profile.id);
        if (ws) setWorkshopName(ws.name || "");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const buildSheet = () => {
    const dataFmt = form.data ? new Date(form.data + "T00:00:00").toLocaleDateString("pt-BR") : "____/____/______";
    const extrasItems = form.extras.split("\n").map((s) => s.trim()).filter(Boolean);

    const row = (item: string) => `
      <tr>
        <td class="item">${escapeHtml(item)}</td>
        <td class="chk"><span class="box"></span></td>
        <td class="chk"><span class="box"></span></td>
        <td class="chk"><span class="box"></span></td>
        <td class="obs"></td>
      </tr>`;

    const group = (g: { title: string; items: string[] }) => `
      <table class="grp">
        <thead>
          <tr><th class="gtitle" colspan="5">${escapeHtml(g.title)}</th></tr>
          <tr class="hdr"><th>Item</th><th>OK</th><th>Atenção</th><th>Trocar</th><th>Observações</th></tr>
        </thead>
        <tbody>${g.items.map(row).join("")}</tbody>
      </table>`;

    const extrasBlock = extrasItems.length
      ? group({ title: "Itens adicionais", items: extrasItems })
      : "";

    const field = (label: string, value: string) => `<div class="f"><span class="fl">${label}</span><span class="fv">${escapeHtml(value) || "&nbsp;"}</span></div>`;

    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Checklist de Inspeção</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 24px; font-size: 12px; }
      .top { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 12px; }
      .brand { font-size: 20px; font-weight: 800; }
      .doc { font-size: 13px; font-weight: 700; text-align: right; }
      .info { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 14px; }
      .f { display: flex; gap: 6px; border-bottom: 1px solid #999; padding: 3px 0; }
      .fl { font-weight: 700; white-space: nowrap; }
      .fv { flex: 1; }
      table.grp { width: 100%; border-collapse: collapse; margin-bottom: 10px; page-break-inside: avoid; }
      .gtitle { background: #111; color: #fff; text-align: left; padding: 4px 8px; font-size: 12px; }
      tr.hdr th { background: #eee; border: 1px solid #999; padding: 3px 6px; font-size: 10px; }
      td { border: 1px solid #999; padding: 5px 6px; }
      td.item { width: 40%; }
      td.chk { width: 8%; text-align: center; }
      td.obs { width: 36%; }
      .box { display: inline-block; width: 14px; height: 14px; border: 1.5px solid #111; }
      .sign { display: flex; justify-content: space-between; gap: 40px; margin-top: 28px; }
      .sign div { flex: 1; border-top: 1px solid #111; padding-top: 4px; text-align: center; font-size: 11px; }
      .legend { font-size: 10px; color: #555; margin: 6px 0 14px; }
      @media print { body { margin: 12mm; } .noprint { display: none; } }
    </style></head><body>
      <div class="top">
        <div class="brand">${escapeHtml(workshopName) || "Oficina"}</div>
        <div class="doc">CHECKLIST DE INSPEÇÃO<br><span style="font-weight:400">Data: ${dataFmt}</span></div>
      </div>
      <div class="info">
        ${field("Cliente:", form.cliente)}
        ${field("Placa:", form.placa)}
        ${field("Veículo:", form.veiculo)}
        ${field("Ano:", form.ano)}
        ${field("KM:", form.km)}
        ${field("Mecânico:", form.mecanico)}
      </div>
      <div class="legend">Marque <b>OK</b> (em ordem), <b>Atenção</b> (monitorar) ou <b>Trocar</b> (reparo necessário). Use "Observações" para anotar detalhes.</div>
      ${GROUPS.map(group).join("")}
      ${extrasBlock}
      <div class="sign">
        <div>Assinatura do mecânico</div>
        <div>Assinatura do cliente</div>
      </div>
      <script>window.onload = function(){ window.print(); }</script>
    </body></html>`;
  };

  const handlePrint = () => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) { alert("Permita pop-ups para imprimir o checklist."); return; }
    w.document.write(buildSheet());
    w.document.close();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <p className="text-xs sm:text-sm text-gray-400 mb-1">Dashboard / Checklist</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardCheck className="w-7 h-7 text-[#1e3a8a]" /> Checklist de inspeção
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Preencha os dados do veículo, imprima e o mecânico marca item por item na mão.
        </p>
      </div>

      <div className="bg-white border border-[#0B1120]/8 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { k: "cliente", label: "Cliente", ph: "Nome do cliente" },
            { k: "placa", label: "Placa", ph: "ABC-1D23" },
            { k: "veiculo", label: "Veículo (marca/modelo)", ph: "Ex.: VW Gol" },
            { k: "ano", label: "Ano", ph: "2018" },
            { k: "km", label: "Quilometragem", ph: "85000" },
            { k: "mecanico", label: "Mecânico responsável", ph: "Nome do mecânico" },
          ].map((f) => (
            <div key={f.k}>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{f.label}</label>
              <input
                value={(form as any)[f.k]}
                onChange={(e) => set(f.k, e.target.value)}
                placeholder={f.ph}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Data</label>
            <input
              type="date" value={form.data} onChange={(e) => set("data", e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Itens adicionais (um por linha, opcional)</label>
          <textarea
            value={form.extras} onChange={(e) => set("extras", e.target.value)} rows={3}
            placeholder={"Ex.:\nRevisar embreagem\nVerificar sensor de estacionamento"}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1e3a8a]/30 focus:border-transparent text-sm resize-none"
          />
        </div>

        <div className="flex items-start gap-2 text-xs text-gray-400">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>O checklist já vem com os itens essenciais (motor, freios, suspensão, pneus, elétrica, fluidos…). Ele abre numa nova aba pronto para impressão.</span>
        </div>

        <button
          onClick={handlePrint}
          className="btn-epic-blue inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
        >
          <Printer className="w-4 h-4" /> Gerar e imprimir checklist
        </button>
      </div>
    </div>
  );
}
