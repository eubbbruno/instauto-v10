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
        console.log("✅ Email confirmado para:", data.user.email);
        
        // Aguardar 2 segundos para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verificar se já tem profile criado
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, type")
          .eq("id", data.user.id)
          .single();

        console.log("Profile encontrado:", profile);

        // Se não tem profile, criar um básico
        if (!profile) {
          console.log("Criando profile básico...");
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
              type: "motorista",
            });
          
          if (insertError) {
            console.error("Erro ao criar profile:", insertError);
          }
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

        console.log("Workshop:", workshop, "Motorist:", motorist);

        // Se não tem motorista, criar agora
        if (!motorist && !workshop) {
          console.log("Criando motorista...");
          const { error: motoristError } = await supabase
            .from("motorists")
            .insert({
              profile_id: data.user.id,
              name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
            });
          
          if (motoristError) {
            console.error("Erro ao criar motorista:", motoristError);
          }
        }

        // Se já tem cadastro completo, redirecionar para dashboard
        if (workshop) {
          return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
        }
        if (motorist || !workshop) {
          return NextResponse.redirect(new URL("/motorista?confirmed=true", requestUrl.origin));
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

