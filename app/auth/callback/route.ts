import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const next = requestUrl.searchParams.get("next") || "/";

  console.log("=== AUTH CALLBACK ===");
  console.log("Code:", code ? "exists" : "missing");
  console.log("Error:", error);
  console.log("Error Description:", errorDescription);

  // Se veio com erro, redireciona com mensagem
  if (error) {
    console.error("Auth error:", error, errorDescription);
    const redirectUrl = new URL("/login-motorista", requestUrl.origin);
    redirectUrl.searchParams.set("error", errorDescription || error);
    return NextResponse.redirect(redirectUrl);
  }

  if (code) {
    try {
      const supabase = await createClient();
      
      // Trocar código por sessão
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        const redirectUrl = new URL("/login-motorista", requestUrl.origin);
        redirectUrl.searchParams.set("error", sessionError.message);
        return NextResponse.redirect(redirectUrl);
      }

      const user = sessionData?.user;
      console.log("User:", user?.id, user?.email);

      if (user) {
        console.log("User authenticated:", user.id, user.email);
        console.log("User metadata:", user.user_metadata);
        
        // Verificar se já existe profile
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from("profiles")
          .select("id, type")
          .eq("id", user.id)
          .single();

        console.log("Existing profile:", existingProfile);
        console.log("Profile check error:", profileCheckError);

        // Se não existe profile, criar
        if (!existingProfile && profileCheckError?.code === "PGRST116") {
          const userName = user.user_metadata?.name || 
                          user.user_metadata?.full_name || 
                          user.email?.split("@")[0] || 
                          "Usuário";

          console.log("Creating profile for:", userName);

          // Criar profile
          const { data: newProfile, error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email,
              name: userName,
              type: "motorista",
            })
            .select()
            .single();

          if (profileError) {
            console.error("Error creating profile:", profileError);
          } else {
            console.log("Profile created:", newProfile);

            // Verificar se o trigger criou o motorist
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const { data: existingMotorist } = await supabase
              .from("motorists")
              .select("id")
              .eq("profile_id", user.id)
              .single();

            // Se o trigger não criou, criar manualmente
            if (!existingMotorist) {
              console.log("Creating motorist manually...");
              const { error: motoristError } = await supabase
                .from("motorists")
                .insert({
                  profile_id: user.id,
                  name: userName,
                });

              if (motoristError) {
                console.error("Error creating motorist:", motoristError);
              } else {
                console.log("Motorist created successfully");
              }
            } else {
              console.log("Motorist already exists (created by trigger)");
            }
          }
          
          // Redirecionar para dashboard do motorista
          return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));
        }

        // Se já tem profile, verificar tipo
        if (existingProfile) {
          // Verificar se tem motorista ou oficina
          const { data: motorist } = await supabase
            .from("motorists")
            .select("id")
            .eq("profile_id", user.id)
            .single();

          const { data: workshop } = await supabase
            .from("workshops")
            .select("id")
            .eq("profile_id", user.id)
            .single();

          console.log("Motorist:", motorist, "Workshop:", workshop);

          if (workshop) {
            return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
          } else if (motorist) {
            return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));
          } else {
            // Tem profile mas não tem motorista nem workshop
            return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
          }
        }

        // Fallback: redirecionar para completar cadastro
        return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
      }
    } catch (err) {
      console.error("Callback error:", err);
      const redirectUrl = new URL("/login-motorista", requestUrl.origin);
      redirectUrl.searchParams.set("error", "Erro ao processar autenticação");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Fallback
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

