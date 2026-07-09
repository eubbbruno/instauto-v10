import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.instauto.com.br";

export const metadata: Metadata = {
  title: "Blog Instauto | Dicas de manutenção e cuidados com o carro",
  description:
    "Guias práticos sobre manutenção, freios, troca de óleo, revisão e economia para o seu carro. Conteúdo do Instauto para motoristas.",
  alternates: { canonical: `${BASE_URL}/blog` },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="band-dark py-16 pt-28 sm:py-24 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-eyebrow text-brand-gold mb-3">Blog</p>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Cuide melhor do seu carro
          </h1>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Dicas práticas de manutenção, economia e segurança — sem enrolação.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="h-full flex flex-col bg-white rounded-3xl border border-navy/8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
                  <div className="h-36 bg-navy flex items-center justify-center text-5xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(37,99,235,0.25),transparent_60%)]" />
                    <span className="relative">{post.emoji}</span>
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2.5 py-1 rounded-full">{post.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}</span>
                    </div>
                    <h2 className="font-heading font-bold text-navy text-lg mb-2 leading-snug group-hover:text-brand-blue transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
