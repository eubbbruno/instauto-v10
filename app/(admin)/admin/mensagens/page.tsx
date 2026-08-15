"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, RefreshCw, Phone, MessageSquare } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export default function AdminMensagensPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-messages");
      const data = await res.json();
      setMessages(data.messages || []);
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
            <MessageSquare className="w-7 h-7 text-[#1e3a8a]" /> Mensagens de contato
          </h1>
          <p className="text-gray-600">Mensagens enviadas pelo formulário do site.</p>
        </div>
        <button onClick={load} className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-[#0B1120]/8 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#1e3a8a]" /></div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-2 text-gray-200" />
            <p className="text-sm">Nenhuma mensagem ainda.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map((m) => (
              <div key={m.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{m.name}</p>
                      {m.subject && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{m.subject}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                      <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-[#1e3a8a]">
                        <Mail className="w-3.5 h-3.5" /> {m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-[#1e3a8a]">
                          <Phone className="w-3.5 h-3.5" /> {m.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(m.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap bg-gray-50 rounded-xl p-3 border border-gray-100">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
