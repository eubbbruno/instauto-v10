import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data?.user) {
      // Verificar se já tem oficina ou motorista cadastrado
      const { data: workshop } = await supabase
        .from("workshops")
        .select("id")
        .eq("profile_id", data.user.id)
        .single();

      const { data: motorist } = await supabase
        .from("motorists")
        .select("id")
        .eq("profile_id", data.user.id)
        .single();

      // Se já tem cadastro completo, redirecionar para dashboard
      if (workshop) {
        return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
      }
      if (motorist) {
        return NextResponse.redirect(new URL("/motorista/garagem", requestUrl.origin));
      }

      // Se não tem, redirecionar para completar cadastro
      return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
    }
  }

  // Fallback: redirecionar para login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

