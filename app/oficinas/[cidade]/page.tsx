import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, Phone, Wrench, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase-public";
import { slugify, titleFromSlug } from "@/lib/slug";

const BASE_URL = "https://www.instauto.com.br";

interface Workshop {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
  specialties: string[] | null;
  rating: number | null;
  reviews_count: number | null;
}

// Busca as oficinas públicas de uma cidade (match por slug do nome da cidade)
async function getCityData(cidadeSlug: string) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("workshops")
    .select("id, name, city, state, address, phone, description, specialties, rating, reviews_count")
    .eq("is_public", true)
    .not("city", "is", null);

  const all = (data || []) as Workshop[];
  const workshops = all.filter((w) => w.city && slugify(w.city) === cidadeSlug);
  const cityName = workshops[0]?.city || titleFromSlug(cidadeSlug);
  const state = workshops[0]?.state || null;

  return { workshops, cityName, state };
}

export async function generateMetadata({ params }: { params: Promise<{ cidade: string }> }): Promise<Metadata> {
  const { cidade } = await params;
  const { workshops, cityName, state } = await getCityData(cidade);
  const local = state ? `${cityName} - ${state}` : cityName;
  const count = workshops.length;

  const title = `Oficinas Mecânicas em ${cityName}${state ? ` - ${state}` : ""} | Instauto`;
  const description = count > 0
    ? `Encontre as ${count} melhores oficinas mecânicas em ${local}. Compare avaliações, peça orçamento grátis e agende serviços no Instauto.`
    : `Oficinas mecânicas em ${local}. Peça orçamento grátis e encontre profissionais de confiança no Instauto.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/oficinas/${cidade}` },
    // Não indexar páginas sem oficinas ainda (evita conteúdo raso)
    robots: count === 0 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/oficinas/${cidade}`,
      type: "website",
    },
  };
}

export default async function OficinasCidadePage({ params }: { params: Promise<{ cidade: string }> }) {
  const { cidade } = await params;
  const { workshops, cityName, state } = await getCityData(cidade);

  // Slug inválido de verdade (nenhum caractere) -> 404
  if (!cidade || cidade.length < 2) notFound();

  const local = state ? `${cityName} - ${state}` : cityName;
  const count = workshops.length;

  // JSON-LD: ItemList das oficinas + BreadcrumbList
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Oficinas mecânicas em ${local}`,
    numberOfItems: count,
    itemListElement: workshops.map((w, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "AutoRepair",
        name: w.name,
        ...(w.address ? { address: { "@type": "PostalAddress", streetAddress: w.address, addressLocality: w.city, addressRegion: w.state, addressCountry: "BR" } } : {}),
        ...(w.phone ? { telephone: w.phone } : {}),
        ...(w.rating && w.reviews_count ? {
          aggregateRating: { "@type": "AggregateRating", ratingValue: w.rating, reviewCount: w.reviews_count },
        } : {}),
      },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Oficinas", item: `${BASE_URL}/oficinas` },
      { "@type": "ListItem", position: 3, name: cityName, item: `${BASE_URL}/oficinas/${cidade}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Hero */}
      <section className="band-dark py-16 pt-28 sm:py-24 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb visível */}
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-4">
            <Link href="/" className="hover:text-white/70">Início</Link>
            <span>/</span>
            <Link href="/oficinas" className="hover:text-white/70">Oficinas</Link>
            <span>/</span>
            <span className="text-white/70">{cityName}</span>
          </nav>

          <p className="text-eyebrow text-brand-gold mb-3">
            {count > 0 ? `${count} oficina${count > 1 ? "s" : ""} encontrada${count > 1 ? "s" : ""}` : "Rede em expansão"}
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Oficinas mecânicas em {cityName}
            {state && <span className="text-brand-yellow"> - {state}</span>}
          </h1>
          <p className="text-white/55 text-lg max-w-2xl">
            Compare oficinas de confiança em {local}, veja avaliações reais e peça orçamento grátis — tudo pelo Instauto.
          </p>
        </div>
      </section>

      {/* Lista de oficinas */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {count > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {workshops.map((w) => (
                <div key={w.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-navy" />
                    </div>
                    {w.rating && w.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-900">{w.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({w.reviews_count || 0})</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{w.name}</h2>
                  {w.address && (
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      {w.address}
                    </p>
                  )}
                  {w.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{w.description}</p>
                  )}
                  {w.specialties && w.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {w.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/solicitar-orcamento?workshop=${w.id}`}
                    className="btn-epic-blue inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold"
                  >
                    Pedir orçamento
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            // Estado vazio — convida oficinas a entrarem (Doctoralia "seja a primeira")
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-8 h-8 text-navy" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ainda não há oficinas cadastradas em {cityName}
              </h2>
              <p className="text-gray-600 mb-8">
                É dono de oficina em {local}? Cadastre-se grátis e seja a primeira a aparecer para os motoristas da região.
              </p>
              <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold">
                Cadastrar minha oficina
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Bloco de confiança / conteúdo (bom pra SEO) */}
      <section className="py-12 sm:py-16 bg-[#F8F9FB] border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6">
            Como encontrar uma boa oficina em {cityName}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "Compare avaliações", text: `Veja notas e comentários reais de motoristas que usaram oficinas em ${cityName}.` },
              { icon: ShieldCheck, title: "Oficinas verificadas", text: "Perfis com dados de contato, especialidades e histórico de atendimento." },
              { icon: Phone, title: "Orçamento sem sair de casa", text: "Descreva o problema e receba orçamentos de várias oficinas de uma vez." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <div className="w-11 h-11 rounded-xl bg-brand-yellow/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-navy" />
                </div>
                <h3 className="font-bold text-navy mb-1.5">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
