import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("OAuth error:", error);
        return NextResponse.redirect(new URL("/login?error=oauth_failed", requestUrl.origin));
      }

      if (data?.user) {
        // Verificar se já tem profile criado
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, type")
          .eq("id", data.user.id)
          .single();

        // Se não tem profile, criar um básico (será completado depois)
        if (!profile) {
          await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
            });
        }

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
    } catch (err) {
      console.error("Callback error:", err);
      return NextResponse.redirect(new URL("/login?error=callback_failed", requestUrl.origin));
    }
  }

  // Fallback: redirecionar para login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}

