import { createPublicClient } from "@/lib/supabase-public";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO (YYYY-MM-DD)
  readingTime: string;
  emoji: string;
  content: string; // markdown
}

function mapRow(r: any): BlogPost {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category || "Dicas",
    author: r.author || "Equipe Instauto",
    date: typeof r.date === "string" ? r.date : new Date(r.date).toISOString().slice(0, 10),
    readingTime: r.reading_time || "5 min",
    emoji: r.emoji || "🔧",
    content: r.content || "",
  };
}

/** Todos os posts publicados, mais recentes primeiro. */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("date", { ascending: false });
    return (data || []).map(mapRow);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data ? mapRow(data) : undefined;
  } catch {
    return undefined;
  }
}
