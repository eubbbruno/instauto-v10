import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { data } = await admin()
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });
  return NextResponse.json({ posts: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  try {
    const b = await request.json();
    const title = String(b.title || "").trim();
    const content = String(b.content || "").trim();
    if (!title || !content) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }
    const slug = slugify(b.slug?.trim() || title);

    const { error } = await admin().from("blog_posts").insert({
      slug,
      title,
      excerpt: String(b.excerpt || "").trim() || title,
      category: b.category?.trim() || "Dicas",
      author: b.author?.trim() || "Equipe Instauto",
      emoji: b.emoji?.trim() || "🔧",
      reading_time: b.readingTime?.trim() || "5 min",
      content,
      published: b.published !== false,
      date: b.date || new Date().toISOString().slice(0, 10),
    });
    if (error) {
      const msg = error.code === "23505" ? "Já existe um post com esse endereço (slug)." : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  try {
    const b = await request.json();
    if (!b.id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const patch: Record<string, any> = { updated_at: new Date().toISOString() };
    if ("title" in b) patch.title = String(b.title).trim();
    if ("excerpt" in b) patch.excerpt = String(b.excerpt).trim();
    if ("category" in b) patch.category = String(b.category).trim();
    if ("emoji" in b) patch.emoji = String(b.emoji).trim();
    if ("readingTime" in b) patch.reading_time = String(b.readingTime).trim();
    if ("content" in b) patch.content = String(b.content).trim();
    if ("published" in b) patch.published = !!b.published;

    await admin().from("blog_posts").update(patch).eq("id", b.id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAdminUser();
  if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  await admin().from("blog_posts").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
