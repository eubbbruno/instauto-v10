import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";

export async function GET() {
  try {
    const auth = await getAdminUser();
    if (!auth.ok) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data } = await db
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    return NextResponse.json({ messages: data || [] });
  } catch (error: any) {
    console.error("❌ [admin/contact-messages]", error);
    return NextResponse.json({ error: error.message || "Erro" }, { status: 500 });
  }
}
