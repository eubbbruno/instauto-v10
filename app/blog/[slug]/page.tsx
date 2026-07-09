import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllPosts, getPostBySlug } from "@/lib/blog";

const BASE_URL = "https://www.instauto.com.br";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artigo não encontrado | Instauto" };

  return {
    title: `${post.title} | Blog Instauto`,
    description: post.excerpt,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const others = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Instauto",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/instauto-amarelo-branco.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/blog/${post.slug}` },
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      {/* Hero */}
      <section className="band-dark py-16 pt-28 sm:py-20 sm:pt-36 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-blue/20 blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-white/40 mb-5">
            <Link href="/" className="hover:text-white/70">Início</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white/70">Blog</Link>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/15 px-2.5 py-1 rounded-full">{post.category}</span>
            <span className="text-xs text-white/40 flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span>{post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.date)}</span>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <article className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-lg text-gray-500 leading-relaxed mb-10 pb-10 border-b border-gray-100">
            {post.excerpt}
          </p>

          <div className="space-y-8">
            {post.sections.map((section, i) => (
              <div key={i}>
                {section.heading && (
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-navy mb-3">{section.heading}</h2>
                )}
                <div className="space-y-4">
                  {section.body.map((p, j) => (
                    <p key={j} className="text-gray-700 leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 band-dark rounded-3xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(253,224,71,0.12),transparent_60%)] pointer-events-none" />
            <div className="relative">
              <h3 className="font-heading text-2xl font-black text-white mb-3">Precisa de uma oficina de confiança?</h3>
              <p className="text-white/55 mb-6 max-w-lg mx-auto">
                Compare oficinas da sua cidade por avaliação e preço, e peça orçamento grátis.
              </p>
              <Link href="/buscar-oficinas" className="btn-epic inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold">
                Encontrar oficinas
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Outros posts */}
      {others.length > 0 && (
        <section className="pb-16 sm:pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-heading text-xl font-bold text-navy mb-6">Continue lendo</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                  <div className="h-full bg-white rounded-2xl border border-navy/8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all p-5">
                    <div className="text-3xl mb-3">{p.emoji}</div>
                    <h3 className="font-heading font-bold text-navy leading-snug mb-2 group-hover:text-brand-blue transition-colors">{p.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
