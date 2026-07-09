import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export interface LegalBlock {
  type: "p" | "ul";
  text?: string;
  items?: string[];
}

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

interface LegalPageProps {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, updatedAt, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="band-dark py-16 pt-28 sm:py-20 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 ring-1 ring-brand-yellow/25 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6 text-brand-yellow" />
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">{title}</h1>
          <p className="text-white/45 text-sm">Última atualização: {updatedAt}</p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue/80 font-semibold mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o início
          </Link>

          <p className="text-lg text-gray-500 leading-relaxed mb-10 pb-10 border-b border-gray-100">{intro}</p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy mb-4">
                  {i + 1}. {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.blocks.map((block, j) =>
                    block.type === "ul" ? (
                      <ul key={j} className="space-y-2 pl-1">
                        {block.items?.map((it, k) => (
                          <li key={k} className="flex gap-3 text-gray-700 leading-relaxed">
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={j} className="text-gray-700 leading-relaxed">{block.text}</p>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nota de contato */}
          <div className="mt-12 bg-[#F8F9FB] border border-navy/8 rounded-2xl p-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              Dúvidas sobre este documento? Fale com a gente em{" "}
              <a href="mailto:contato@instauto.com.br" className="text-brand-blue font-semibold hover:underline">contato@instauto.com.br</a>{" "}
              ou pelo WhatsApp{" "}
              <a href="https://wa.me/5543991852779" className="text-brand-blue font-semibold hover:underline">(43) 99185-2779</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
