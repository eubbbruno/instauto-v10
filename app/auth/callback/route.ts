import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("🔵 [Callback] Iniciando...");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
            try { cookieStore.set(name, value, options); } catch {}
          }),
        },
      }
    );

    try {
      console.log("🔄 [Callback] Trocando código por sessão...");
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !session?.user) {
        console.error("❌ [Callback] Erro ao trocar código:", error);
        return NextResponse.redirect(new URL("/login?error=session", requestUrl.origin));
      }

      console.log("✅ [Callback] Sessão obtida para:", session.user.email);
      console.log("✅ [Callback] User ID:", session.user.id);
      console.log("✅ [Callback] User metadata:", JSON.stringify(session.user.user_metadata, null, 2));

      // Verificar se profile existe (usando maybeSingle para não dar erro)
      console.log("🔍 [Callback] Verificando se profile existe...");
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      console.log("🔍 [Callback] Profile check result:");
      console.log("   - existingProfile:", existingProfile);
      console.log("   - profileCheckError:", profileCheckError);

      if (profileCheckError) {
        console.error("❌ [Callback] Erro ao verificar profile:", profileCheckError);
      }

      if (existingProfile) {
        console.log("✅ [Callback] Profile JÁ existe, tipo:", existingProfile.type);
        const redirectUrl = existingProfile.type === "workshop" ? "/oficina" : "/motorista";
        console.log("🔀 [Callback] Redirecionando para:", redirectUrl);
        return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
      }

      // Profile não existe, criar agora
      console.log("🔨 [Callback] Profile NÃO existe, criando...");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Debug completo de cookies
      const allCookies = cookieStore.getAll();
      console.log("🍪 [Callback] TODOS os cookies:");
      allCookies.forEach(cookie => {
        console.log(`   - ${cookie.name}: ${cookie.value}`);
      });
      
      // Determinar tipo do usuário (múltiplas fontes com prioridade)
      const userTypeCookie = cookieStore.get("instauto_user_type");
      const userTypeFromMetadata = session.user.user_metadata?.user_type;
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔍 [Callback] DETERMINANDO TIPO:");
      console.log("   1. Cookie instauto_user_type:", userTypeCookie?.value || "não encontrado");
      console.log("   2. user_metadata.user_type:", userTypeFromMetadata || "não encontrado");
      console.log("   3. user_metadata.name:", session.user.user_metadata?.name || "não encontrado");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      // Lógica clara e simples com prioridade para user_metadata
      let userType: "workshop" | "motorist" = "motorist"; // padrão
      
      // Prioridade 1: user_metadata (mais confiável, vem do signUp)
      if (userTypeFromMetadata === "workshop") {
        userType = "workshop";
        console.log("✅ [Callback] TIPO DETERMINADO: WORKSHOP (via metadata)");
      } 
      // Prioridade 2: cookie
      else if (userTypeCookie?.value === "oficina") {
        userType = "workshop";
        console.log("✅ [Callback] TIPO DETERMINADO: WORKSHOP (via cookie)");
      } 
      // Padrão: motorist
      else {
        console.log("✅ [Callback] TIPO DETERMINADO: MOTORIST (padrão)");
      }
      
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      const userName = session.user.user_metadata?.name || 
                       session.user.user_metadata?.full_name || 
                       session.user.email?.split("@")[0] || 
                       "Usuário";

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔨 [Callback] CRIANDO PROFILE:");
      const profileData = {
        id: session.user.id,
        email: session.user.email,
        name: userName,
        type: userType,
      };
      console.log("📋 [Callback] Dados do profile:", JSON.stringify(profileData, null, 2));

      const { data: profileResult, error: profileError } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error("❌ [Callback] ERRO ao criar profile:");
        console.error("   - Código:", profileError.code);
        console.error("   - Mensagem:", profileError.message);
        console.error("   - Detalhes:", profileError.details);
        console.error("   - Hint:", profileError.hint);
        
        // FALLBACK: Tentar criar via API (usa service role key para bypass RLS)
        console.log("🔄 [Callback] Tentando criar profile via API fallback...");
        try {
          const apiResponse = await fetch(`${requestUrl.origin}/api/create-profile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userType: userType === "workshop" ? "oficina" : "motorista",
              email: session.user.email,
              name: userName,
            }),
          });

          const apiResult = await apiResponse.json();
          
          if (!apiResponse.ok) {
            console.error("❌ [Callback] API fallback também falhou:", apiResult);
            return NextResponse.redirect(new URL("/login?error=profile_create_failed", requestUrl.origin));
          }
          
          console.log("✅ [Callback] Profile criado via API fallback!");
        } catch (apiError) {
          console.error("❌ [Callback] Erro no API fallback:", apiError);
          return NextResponse.redirect(new URL("/login?error=profile_create_failed", requestUrl.origin));
        }
      } else {
        console.log("✅ [Callback] Profile criado com sucesso!");
        console.log("✅ [Callback] Profile ID:", profileResult?.id);
        console.log("✅ [Callback] Profile tipo:", profileResult?.type);
      }

      // Criar workshop ou motorist (já foi criado via API fallback se necessário)
      // Mas vamos tentar criar aqui também para garantir
      if (userType === "workshop") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔨 [Callback] Verificando/criando WORKSHOP...");
        
        // Verificar se já existe
        const { data: existingWorkshop } = await supabase
          .from("workshops")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();

        if (!existingWorkshop) {
          const workshopData = {
            profile_id: session.user.id,
            name: userName,
            plan_type: "free",
            subscription_status: "trial",
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_public: true,
            accepts_quotes: true,
          };
          console.log("📋 [Callback] Dados do workshop:", JSON.stringify(workshopData, null, 2));
          
          const { data: workshopResult, error: workshopError } = await supabase
            .from("workshops")
            .insert(workshopData)
            .select()
            .single();
          
          if (workshopError) {
            console.error("❌ [Callback] ERRO ao criar workshop:", workshopError);
            // Não bloquear o redirect, workshop pode ter sido criado via API
          } else {
            console.log("✅ [Callback] Workshop criado com sucesso!");
            console.log("✅ [Callback] Workshop ID:", workshopResult?.id);
          }
        } else {
          console.log("✅ [Callback] Workshop já existe!");
        }
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔀 [Callback] Redirecionando para /oficina");
        
        const response = NextResponse.redirect(new URL("/oficina", requestUrl.origin));
        response.cookies.delete("instauto_user_type");
        return response;
      } else {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔨 [Callback] Verificando/criando MOTORIST...");
        
        // Verificar se já existe
        const { data: existingMotorist } = await supabase
          .from("motorists")
          .select("id")
          .eq("profile_id", session.user.id)
          .maybeSingle();

        if (!existingMotorist) {
          const motoristData = {
            profile_id: session.user.id,
          };
          console.log("📋 [Callback] Dados do motorist:", JSON.stringify(motoristData, null, 2));
          
          const { data: motoristResult, error: motoristError } = await supabase
            .from("motorists")
            .insert(motoristData)
            .select()
            .single();
          
          if (motoristError) {
            console.error("❌ [Callback] ERRO ao criar motorist:", motoristError);
            // Não bloquear o redirect, motorist pode ter sido criado via API
          } else {
            console.log("✅ [Callback] Motorist criado com sucesso!");
            console.log("✅ [Callback] Motorist ID:", motoristResult?.id);
          }
        } else {
          console.log("✅ [Callback] Motorist já existe!");
        }
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔀 [Callback] Redirecionando para /motorista");
        
        const response = NextResponse.redirect(new URL("/motorista", requestUrl.origin));
        response.cookies.delete("instauto_user_type");
        return response;
      }

    } catch (error) {
      console.error("❌ [Callback] Erro geral:", error);
      console.error("❌ [Callback] Stack:", error instanceof Error ? error.stack : "N/A");
      return NextResponse.redirect(new URL("/login?error=callback_failed", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
