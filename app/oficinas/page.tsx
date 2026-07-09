import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Wrench } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase-public";
import { slugify } from "@/lib/slug";

const BASE_URL = "https://www.instauto.com.br";

export const metadata: Metadata = {
  title: "Oficinas Mecânicas por Cidade | Instauto",
  description: "Encontre oficinas mecânicas de confiança na sua cidade. Compare avaliações e peça orçamento grátis no Instauto.",
  alternates: { canonical: `${BASE_URL}/oficinas` },
};

interface CityInfo {
  slug: string;
  city: string;
  state: string | null;
  count: number;
}

async function getCities(): Promise<CityInfo[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("workshops")
    .select("city, state")
    .eq("is_public", true)
    .not("city", "is", null);

  const map = new Map<string, CityInfo>();
  (data || []).forEach((w: { city: string | null; state: string | null }) => {
    if (!w.city) return;
    const slug = slugify(w.city);
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { slug, city: w.city, state: w.state, count: 1 });
  });

  return [...map.values()].sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
}

export default async function OficinasHubPage() {
  const cities = await getCities();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="band-dark py-16 pt-28 sm:py-24 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-eyebrow text-brand-gold mb-3">Rede de oficinas</p>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Oficinas mecânicas por cidade
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Escolha sua cidade e encontre oficinas de confiança perto de você.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {cities.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cities.map((c) => (
                <Link key={c.slug} href={`/oficinas/${c.slug}`} className="group">
                  <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-navy/15 transition-all p-5">
                    <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{c.city}{c.state ? ` - ${c.state}` : ""}</p>
                      <p className="text-sm text-gray-500">{c.count} oficina{c.count > 1 ? "s" : ""}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-navy/5 flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-8 h-8 text-navy" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Rede em expansão</h2>
              <p className="text-gray-600 mb-8">
                Estamos crescendo por todo o Brasil. É dono de oficina? Cadastre-se grátis e apareça para os motoristas da sua cidade.
              </p>
              <Link href="/cadastro/oficina" className="btn-epic inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold">
                Cadastrar minha oficina
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
