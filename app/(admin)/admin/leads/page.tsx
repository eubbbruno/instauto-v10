"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, RefreshCw, MessageCircle, MapPin } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
}

function waLink(phone: string, name: string) {
  const digits = phone.replace(/\D/g, "");
  const num = digits.startsWith("55") ? digits : `55${digits}`;
  const text = encodeURIComponent(`Olá ${name}! Aqui é do Instauto, tudo bem? Vi que você se interessou pelo nosso sistema para oficinas. Posso te ajudar a começar?`);
  return `https://wa.me/${num}?text=${text}`;
}

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      setLeads(data.leads || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#1e3a8a]" /> Leads de oficinas
          </h1>
          <p className="text-gray-600">Contatos capturados na página de captação (/parceiro).</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{leads.length} lead{leads.length === 1 ? "" : "s"}</span>
          <button onClick={load} className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" /></div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Nenhum lead ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leads.map((l) => (
              <div key={l.id} className="p-4 sm:p-5 flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900">{l.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                    <span>{l.phone}</span>
                    {l.city && (
                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {l.city}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">{new Date(l.created_at).toLocaleString("pt-BR")}</span>
                  <a href={waLink(l.phone, l.name)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
