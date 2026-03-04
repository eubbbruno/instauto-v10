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

      // Verificar se profile existe
      console.log("🔍 [Callback] Verificando se profile existe...");
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      console.log("🔍 [Callback] Profile check result:", { existingProfile, profileCheckError });

      if (existingProfile) {
        console.log("✅ [Callback] Profile JÁ existe, tipo:", existingProfile.type);
        const redirectUrl = existingProfile.type === "workshop" ? "/oficina" : "/motorista";
        console.log("🔀 [Callback] Redirecionando para:", redirectUrl);
        return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
      }

      // Profile não existe, criar agora
      console.log("🔨 [Callback] Profile NÃO existe, criando...");
      
      // Debug completo de cookies
      const allCookies = cookieStore.getAll();
      console.log("🍪 [Callback] TODOS os cookies:", JSON.stringify(allCookies, null, 2));
      
      // Determinar tipo do usuário (múltiplas fontes)
      const userTypeCookie = cookieStore.get("instauto_user_type");
      console.log("🍪 [Callback] Cookie instauto_user_type:", userTypeCookie);
      console.log("🍪 [Callback] Cookie value:", userTypeCookie?.value);
      console.log("🍪 [Callback] Cookie value === 'oficina':", userTypeCookie?.value === "oficina");
      console.log("🍪 [Callback] Cookie value === 'motorista':", userTypeCookie?.value === "motorista");
      
      const userTypeFromMetadata = session.user.user_metadata?.user_type;
      console.log("📋 [Callback] user_metadata.user_type:", userTypeFromMetadata);
      console.log("📋 [Callback] user_metadata completo:", JSON.stringify(session.user.user_metadata, null, 2));
      
      // Prioridade: cookie > metadata > padrão (motorist)
      let userType = "motorist";
      if (userTypeCookie?.value === "oficina") {
        console.log("✅ [Callback] Tipo via COOKIE: oficina → workshop");
        userType = "workshop";
      } else if (userTypeFromMetadata === "workshop") {
        console.log("✅ [Callback] Tipo via METADATA: workshop");
        userType = "workshop";
      } else if (userTypeCookie?.value === "motorista" || userTypeFromMetadata === "motorist") {
        console.log("✅ [Callback] Tipo via COOKIE/METADATA: motorist");
        userType = "motorist";
      } else {
        console.log("⚠️ [Callback] Tipo PADRÃO: motorist");
      }
      
      console.log("✅ [Callback] Tipo FINAL determinado:", userType);
      
      const userName = session.user.user_metadata?.name || 
                       session.user.user_metadata?.full_name || 
                       session.user.email?.split("@")[0] || 
                       "Usuário";

      console.log("🔨 [Callback] Criando profile:");
      console.log("   - ID:", session.user.id);
      console.log("   - Email:", session.user.email);
      console.log("   - Nome:", userName);
      console.log("   - Tipo:", userType);

      const { error: profileError } = await supabase.from("profiles").insert({
        id: session.user.id,
        email: session.user.email,
        name: userName,
        type: userType,
      });

      if (profileError) {
        console.error("❌ [Callback] Erro ao criar profile:", profileError);
        console.error("❌ [Callback] Detalhes:", JSON.stringify(profileError, null, 2));
        return NextResponse.redirect(new URL("/login?error=profile_create", requestUrl.origin));
      }

      console.log("✅ [Callback] Profile criado com sucesso!");

      // Criar workshop ou motorist
      if (userType === "workshop") {
        console.log("🔨 [Callback] Criando workshop...");
        const { error: workshopError } = await supabase.from("workshops").insert({
          profile_id: session.user.id,
          name: userName,
          plan_type: "free",
          subscription_status: "trial",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          is_public: true,
          accepts_quotes: true,
        });
        
        if (workshopError) {
          console.error("❌ [Callback] Erro ao criar workshop:", workshopError);
          console.error("❌ [Callback] Detalhes:", JSON.stringify(workshopError, null, 2));
        } else {
          console.log("✅ [Callback] Workshop criado com sucesso!");
        }
        
        console.log("🔀 [Callback] Redirecionando para /oficina");
        return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
      } else {
        console.log("🔨 [Callback] Criando motorist...");
        const { error: motoristError } = await supabase.from("motorists").insert({
          profile_id: session.user.id,
        });
        
        if (motoristError) {
          console.error("❌ [Callback] Erro ao criar motorist:", motoristError);
          console.error("❌ [Callback] Detalhes:", JSON.stringify(motoristError, null, 2));
        } else {
          console.log("✅ [Callback] Motorist criado com sucesso!");
        }
        
        console.log("🔀 [Callback] Redirecionando para /motorista");
        return NextResponse.redirect(new URL("/motorista", requestUrl.origin));
      }

    } catch (error) {
      console.error("❌ [Callback] Erro geral:", error);
      console.error("❌ [Callback] Stack:", error instanceof Error ? error.stack : "N/A");
      return NextResponse.redirect(new URL("/login?error=callback_failed", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
