import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("🔵 [Callback] Iniciando...");

  if (!code) {
    console.error("❌ [Callback] Sem código");
    return NextResponse.redirect(new URL("/login?error=no_code", requestUrl.origin));
  }

  try {
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

    // 1. Trocar código por sessão
    console.log("🔄 [Callback] Trocando código por sessão...");
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !data?.user) {
      console.error("❌ [Callback] Erro na sessão:", sessionError);
      return NextResponse.redirect(new URL("/login?error=session", requestUrl.origin));
    }

    console.log("✅ [Callback] Sessão criada para:", data.user.email);

    // 2. Verificar se profile existe
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    if (existingProfile) {
      // Profile já existe, redirecionar baseado no tipo
      console.log("✅ [Callback] Profile existente:", existingProfile.type);
      const redirectUrl = existingProfile.type === "workshop" ? "/oficina" : "/motorista";
      return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
    }

    // 3. Profile não existe, criar novo
    console.log("🔨 [Callback] Criando novo profile...");

    // Pegar tipo do cookie (salvo antes do redirect)
    const userTypeCookie = cookieStore.get("instauto_user_type");
    const userType = userTypeCookie?.value === "oficina" ? "workshop" : "motorist";
    
    console.log("📝 [Callback] Tipo do usuário:", userType);

    const userName = data.user.user_metadata?.full_name ||
                    data.user.user_metadata?.name ||
                    data.user.email?.split("@")[0] ||
                    "Usuário";

    // Criar profile usando supabaseAdmin (bypassa RLS)
    console.log("🔨 [Callback] Usando supabaseAdmin para criar profile...");
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      name: userName,
      type: userType,
    });

    if (profileError) {
      console.error("❌ [Callback] Erro ao criar profile:", profileError);
      return NextResponse.redirect(new URL("/login?error=profile", requestUrl.origin));
    }

    console.log("✅ [Callback] Profile criado:", userType);

    // 4. Criar workshop ou motorist usando supabaseAdmin
    if (userType === "workshop") {
      console.log("🔨 [Callback] Criando workshop com supabaseAdmin...");
      const { error: workshopError } = await supabaseAdmin.from("workshops").insert({
        profile_id: data.user.id,
        name: userName,
        plan_type: "free",
        subscription_status: "trial",
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_public: true,
        accepts_quotes: true,
      });

      if (workshopError) {
        console.error("❌ [Callback] Erro ao criar workshop:", workshopError);
      } else {
        console.log("✅ [Callback] Workshop criado!");
      }

      return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
    } else {
      console.log("🔨 [Callback] Criando motorist com supabaseAdmin...");
      const { error: motoristError } = await supabaseAdmin.from("motorists").insert({
        profile_id: data.user.id,
      });

      if (motoristError) {
        console.error("❌ [Callback] Erro ao criar motorist:", motoristError);
      } else {
        console.log("✅ [Callback] Motorist criado!");
      }

      return NextResponse.redirect(new URL("/motorista", requestUrl.origin));
    }
  } catch (error) {
    console.error("❌ [Callback] Erro geral:", error);
    return NextResponse.redirect(new URL("/login?error=unknown", requestUrl.origin));
  }
}
