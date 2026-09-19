import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminUser } from "@/lib/api-auth";

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
    .from("oficina_leads")
    .select("*")
    .order("created_at", { ascending: false });
  return NextResponse.json({ leads: data || [] });
}
