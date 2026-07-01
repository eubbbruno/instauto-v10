"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const FAQS = [
  {
    q: "Como encontrar uma oficina mecânica de confiança perto de mim?",
    a: "Pelo Instauto, você busca oficinas verificadas na sua região, vê avaliações reais de outros motoristas e pede orçamento gratuito para várias oficinas ao mesmo tempo — sem precisar ligar para ninguém. Basta digitar sua cidade e selecionar o estado.",
  },
  {
    q: "O Instauto é gratuito para motoristas?",
    a: "Sim, para motoristas é 100% gratuito, sempre. Você busca oficinas, compara orçamentos e agenda serviços sem pagar nada. A plataforma é sustentada pela assinatura das oficinas parceiras.",
  },
  {
    q: "Em quais estados e cidades o Instauto está disponível?",
    a: "O Instauto já está presente em mais de 15 estados brasileiros, com oficinas cadastradas nas principais capitais e cidades do interior — de São Paulo e Rio de Janeiro a Manaus, Fortaleza, Salvador, Curitiba e Porto Alegre. A rede cresce toda semana.",
  },
  {
    q: "Como funciona o sistema de avaliações das oficinas?",
    a: "Após cada serviço concluído, o motorista recebe uma notificação para avaliar a oficina com nota de 1 a 5 estrelas e um comentário. Todas as avaliações são vinculadas a um serviço real — não é possível avaliar sem ter usado o serviço.",
  },
  {
    q: "Como cadastro minha oficina mecânica no Instauto?",
    a: "Acesse a página 'Para Oficinas', clique em 'Testar 14 dias grátis' e preencha o cadastro em menos de 5 minutos. Sua oficina já aparece para motoristas na sua região no mesmo dia. Não é necessário cartão de crédito para começar.",
  },
  {
    q: "Consigo agendar o serviço diretamente pelo Instauto?",
    a: "Sim. Depois de escolher a oficina e aprovar o orçamento, você agenda diretamente pela plataforma — escolhendo o dia e horário disponível. Você recebe a confirmação imediata e um lembrete antes do serviço.",
  },
  {
    q: "Quais tipos de veículos as oficinas do Instauto atendem?",
    a: "As oficinas cadastradas no Instauto atendem carros, motos, caminhões e utilitários. Ao buscar uma oficina, você pode filtrar por especialidade e tipo de veículo para encontrar exatamente quem entende do que você precisa.",
  },
  {
    q: "O Instauto tem aplicativo para celular?",
    a: "O Instauto funciona completamente pelo navegador, tanto no computador quanto no celular — sem precisar instalar nada. A plataforma é otimizada para mobile para que você possa buscar oficinas, pedir orçamentos e agendar de qualquer lugar.",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white border-t border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Reveal className="mb-12">
          <p className="text-eyebrow text-brand-gold mb-3">Dúvidas frequentes</p>
          <h2 className="h-section text-navy leading-tight">
            Perguntas e<br className="sm:hidden" /> respostas
          </h2>
          <p className="mt-4 text-navy/55 text-lg">
            Tudo que você precisa saber antes de começar.
          </p>
        </Reveal>

        <Reveal stagger={0.05} className="space-y-3">
          {FAQS.map(({ q, a }, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-200 ${
                  open
                    ? "border-brand-yellow/40 bg-yellow-50/50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="font-heading font-bold text-[15px] text-navy leading-snug">
                    {q}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-200 ${open ? "bg-brand-yellow text-navy" : "bg-white border border-gray-200 text-navy/40"}`}>
                    {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-48" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-navy/60 font-sans text-[14px] leading-relaxed">
                    {a}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
