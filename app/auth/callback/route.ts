import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  const typeFromUrl = requestUrl.searchParams.get("type") as 'motorista' | 'oficina' | null;

  console.log("=== AUTH CALLBACK ===");
  console.log("Code:", code ? "exists" : "missing");
  console.log("Type from URL:", typeFromUrl);
  console.log("Error:", error);

  // Erro do OAuth
  if (error) {
    console.error("Auth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", requestUrl.origin));
  }

  try {
    const supabase = await createClient();
    
    // Criar admin client para bypassing RLS
    const supabaseAdmin = createSupabaseAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Trocar código por sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(sessionError.message)}`, requestUrl.origin)
      );
    }

    const user = sessionData?.user;
    if (!user) {
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    }

    console.log("User ID:", user.id);
    console.log("User email:", user.email);
    console.log("User metadata:", user.user_metadata);

    // Determinar tipo: URL > metadados > default motorista
    const userType = typeFromUrl || user.user_metadata?.user_type || 'motorista';
    console.log("Final user type:", userType);

    // Verificar se já existe profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, type")
      .eq("id", user.id)
      .single();

    console.log("Existing profile:", existingProfile);

    // Se não existe profile, criar
    if (!existingProfile) {
      const userName = user.user_metadata?.name || 
                      user.user_metadata?.full_name || 
                      user.email?.split("@")[0] || 
                      "Usuário";

      console.log("Creating profile:", { id: user.id, email: user.email, name: userName, type: userType });

      // Criar profile
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          name: userName,
          type: userType,
        });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        // Continua mesmo com erro - pode já existir
      } else {
        console.log("Profile created successfully");
      }

      // Se for motorista, criar registro em motorists
      if (userType === 'motorista') {
        const { error: motoristError } = await supabaseAdmin
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
      }
    }

    // Redirecionar baseado no tipo
    const finalType = existingProfile?.type || userType;
    
    if (finalType === "oficina") {
      // Verificar se já tem workshop
      const { data: existingWorkshop } = await supabaseAdmin
        .from("workshops")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (existingWorkshop) {
        // Já completou cadastro, vai pro dashboard
        console.log("Workshop exists, redirecting to /oficina");
        return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
      } else {
        // Precisa completar cadastro
        console.log("Workshop missing, redirecting to /completar-cadastro");
        return NextResponse.redirect(new URL("/completar-cadastro", requestUrl.origin));
      }
    } else {
      // Motorista vai direto pro dashboard
      console.log("Motorista, redirecting to /motorista");
      return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));
    }

  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(
      new URL("/?error=Erro+ao+processar+autenticacao", requestUrl.origin)
    );
  }
}
