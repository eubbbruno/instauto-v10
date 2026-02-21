import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type") || "motorista";
  const error = requestUrl.searchParams.get("error");

  console.log("=== CALLBACK GOOGLE START ===");
  console.log("Code:", code ? "presente" : "ausente");
  console.log("Type:", type);
  console.log("Error:", error);

  if (error || !code) {
    console.error("❌ Erro ou sem code:", error);
    const redirectUrl = type === "oficina" ? "/login-oficina" : "/login-motorista";
    return NextResponse.redirect(new URL(`${redirectUrl}?error=${error || "no_code"}`, requestUrl.origin));
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
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("Session user:", data?.user?.id);
    console.log("Session error:", sessionError?.message);

    if (sessionError || !data?.user) {
      console.error("❌ Erro na sessão:", sessionError);
      const redirectUrl = type === "oficina" ? "/login-oficina" : "/login-motorista";
      return NextResponse.redirect(new URL(`${redirectUrl}?error=session`, requestUrl.origin));
    }

    const user = data.user;
    const userName = user.user_metadata?.full_name || 
                     user.user_metadata?.name ||
                     user.email?.split("@")[0] || 
                     "Usuário";

    console.log("User ID:", user.id);
    console.log("User email:", user.email);
    console.log("User name:", userName);
    console.log("User type:", type);

    // 2. Verificar se profile já existe
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("id, type")
      .eq("id", user.id)
      .maybeSingle();

    console.log("Existing profile:", existingProfile?.id || "não existe");

    // 3. Se não existe profile, CRIAR
    if (!existingProfile) {
      console.log("🔨 CRIANDO NOVO PROFILE:", { id: user.id, email: user.email, name: userName, type });

      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          name: userName,
          type: type,
        })
        .select()
        .single();

      if (insertError) {
        console.error("❌ Erro ao criar profile:", insertError);
        const redirectUrl = type === "oficina" ? "/login-oficina" : "/login-motorista";
        return NextResponse.redirect(new URL(`${redirectUrl}?error=profile_creation`, requestUrl.origin));
      }

      console.log("✅ Profile criado com sucesso!");

      // 4. Criar registro específico
      if (type === "motorista") {
        console.log("🔨 Criando motorist...");
        const { error: motoristError } = await supabase.from("motorists").insert({
          profile_id: user.id,
        });
        
        if (motoristError) {
          console.error("❌ Erro ao criar motorist:", motoristError);
        } else {
          console.log("✅ Motorist criado com sucesso!");
        }
      } else if (type === "oficina") {
        console.log("🔨 Criando workshop...");
        const { data: newWorkshop, error: workshopError } = await supabase.from("workshops").insert({
          profile_id: user.id,
          name: userName || "Minha Oficina",
          plan_type: "free",
          subscription_status: "trial",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          is_public: true,
          accepts_quotes: true,
        }).select().single();
        
        if (workshopError) {
          console.error("❌ Erro ao criar workshop:", workshopError);
        } else {
          console.log("✅ Workshop criado com sucesso:", newWorkshop?.id);
        }
      }
    } else {
      console.log("✅ Profile já existe, tipo:", existingProfile.type);
    }

    // 5. Determinar redirecionamento
    const finalType = existingProfile?.type || type;
    console.log("Final type para redirect:", finalType);

    if (finalType === "oficina") {
      console.log("✅ Redirecionando para /oficina");
      return NextResponse.redirect(new URL("/oficina?welcome=true", requestUrl.origin));
    }

    console.log("✅ Redirecionando para /motorista");
    return NextResponse.redirect(new URL("/motorista?welcome=true", requestUrl.origin));

  } catch (error) {
    console.error("❌ Erro no callback:", error);
    const redirectUrl = type === "oficina" ? "/login-oficina" : "/login-motorista";
    return NextResponse.redirect(new URL(`${redirectUrl}?error=unknown`, requestUrl.origin));
  }
}
