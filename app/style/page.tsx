import {
  Wrench,
  Zap,
  TrendingUp,
  Crown,
  Car,
  Shield,
  ArrowRight,
  Sparkles,
  DollarSign,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Design System — Instauto",
};

export default function StyleShowcasePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-navy">
      {/* ===================== HERO ÉPICO ===================== */}
      <section className="relative overflow-hidden bg-aurora text-white">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles className="h-4 w-4 text-brand-yellow" />
            <span className="text-white/80">Design System • Instauto</span>
          </div>

          <h1 className="mt-8 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl">
            Gestão de oficina,
            <br />
            <span className="text-gradient-gold">nível épico.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70">
            Azul elétrico, ouro vibrante, tipografia forte. A nova cara do
            Instauto — ousada, moderna e inconfundível.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button className="btn-epic inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base">
              Começar agora <ArrowRight className="h-5 w-5" />
            </button>
            <button className="glass-dark inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10">
              <Crown className="h-5 w-5 text-brand-yellow" /> Ver planos
            </button>
          </div>

          {/* Floating glass stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Car, label: "Veículos no pátio", value: "128" },
              { icon: DollarSign, label: "Faturamento/mês", value: "R$ 84k" },
              { icon: Clock, label: "OS em andamento", value: "23" },
              { icon: TrendingUp, label: "Crescimento", value: "+37%" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`glass-dark rounded-2xl p-5 ${i % 2 === 0 ? "animate-float" : ""}`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                <s.icon className="h-6 w-6 text-brand-yellow" />
                <p className="mt-3 font-heading text-3xl font-bold text-white">
                  {s.value}
                </p>
                <p className="text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PALETA ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <SectionTitle eyebrow="Cores" title="Paleta da marca" />
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <Ramp
            name="Azul elétrico"
            stops={["#eff6ff", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"]}
          />
          <Ramp
            name="Ouro vibrante"
            stops={["#fefce8", "#fef08a", "#fde047", "#facc15", "#f59e0b"]}
          />
        </div>
      </section>

      {/* ===================== BOTÕES ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionTitle eyebrow="Componentes" title="Botões" />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button className="btn-epic rounded-xl px-7 py-3.5 text-base">
            Primário ouro
          </button>
          <button className="btn-epic-blue rounded-xl px-7 py-3.5 text-base">
            Primário azul
          </button>
          <button className="rounded-xl border-2 border-navy/15 bg-white px-7 py-3.5 text-base font-bold text-navy transition hover:border-brand-blue hover:text-brand-blue">
            Secundário
          </button>
          <button className="rounded-xl px-7 py-3.5 text-base font-bold text-brand-blue transition hover:bg-brand-blue/5">
            Ghost
          </button>
        </div>
      </section>

      {/* ===================== CARDS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionTitle eyebrow="Componentes" title="Cards" />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { icon: Wrench, title: "Ordens de Serviço", desc: "Controle total do fluxo da oficina, da entrada à entrega." },
            { icon: Zap, title: "Diagnóstico IA", desc: "IA especializada que ajuda a achar o problema do carro." },
            { icon: Shield, title: "Financeiro", desc: "Caixa, contas a pagar e receber, relatórios em tempo real." },
          ].map((c) => (
            <div
              key={c.title}
              className="card-lift rounded-3xl border border-navy/10 bg-white p-7 shadow-sm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-brand-blue-deep glow-blue">
                <c.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mt-5 font-heading text-xl font-bold text-navy">
                {c.title}
              </h3>
              <p className="mt-2 text-navy/60">{c.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue">
                Saiba mais <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Stat card destacado + card escuro */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="card-lift overflow-hidden rounded-3xl border-2 border-brand-yellow/40 bg-gradient-to-br from-yellow-50 to-white p-7 glow-gold">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-sm font-bold text-brand-gold">
                PRO • em teste
              </span>
              <Crown className="h-6 w-6 text-brand-gold" />
            </div>
            <p className="mt-6 font-heading text-5xl font-extrabold text-navy">
              R$ 97<span className="text-xl font-semibold text-navy/50">/mês</span>
            </p>
            <p className="mt-2 text-navy/60">Gestão completa, sem limites.</p>
            <button className="btn-epic mt-6 w-full rounded-xl py-3 text-base">
              Assinar PRO
            </button>
          </div>

          <div className="bg-aurora card-lift flex flex-col justify-between overflow-hidden rounded-3xl p-8 text-white">
            <div>
              <span className="text-gradient-gold font-heading text-sm font-bold uppercase tracking-widest">
                Glass sobre escuro
              </span>
              <h3 className="mt-3 font-heading text-3xl font-bold">
                Cards que brilham no escuro.
              </h3>
            </div>
            <div className="glass-dark mt-6 rounded-2xl p-5">
              <p className="text-sm text-white/60">Próxima revisão</p>
              <p className="font-heading text-2xl font-bold">Civic 2019 • 3 dias</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TIPOGRAFIA ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionTitle eyebrow="Tipografia" title="Syne + Plus Jakarta Sans" />
        <div className="mt-8 space-y-4 border-t border-navy/10 pt-8">
          <p className="font-heading text-6xl font-extrabold tracking-tight text-navy">
            Display Syne
          </p>
          <p className="font-heading text-3xl font-bold text-navy/80">
            Títulos com presença
          </p>
          <p className="max-w-2xl text-lg leading-relaxed text-navy/70">
            Corpo em Plus Jakarta Sans — legível, moderno e leve. A combinação dá
            personalidade forte nos títulos e conforto na leitura do conteúdo.
          </p>
        </div>
      </section>

      <footer className="bg-aurora py-10 text-center text-sm text-white/50">
        Instauto Design System — vitrine de direção visual
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="font-heading text-sm font-bold uppercase tracking-widest text-brand-gold">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-heading text-4xl font-extrabold tracking-tight text-navy">
        {title}
      </h2>
    </div>
  );
}

function Ramp({ name, stops }: { name: string; stops: string[] }) {
  return (
    <div>
      <p className="mb-3 font-semibold text-navy/70">{name}</p>
      <div className="flex overflow-hidden rounded-2xl shadow-sm">
        {stops.map((c) => (
          <div key={c} className="h-20 flex-1" style={{ background: c }} />
        ))}
      </div>
    </div>
  );
}
