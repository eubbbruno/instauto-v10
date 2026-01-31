import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type") as "motorista" | "oficina" | null;
  const error = url.searchParams.get("error");

  console.log("=== AUTH CALLBACK START ===");
  console.log("Code:", code ? "✓" : "✗");
  console.log("Type:", type);
  console.log("Error:", error);

  if (error || !code) {
    console.error("❌ Erro ou sem code:", error);
    return NextResponse.redirect(new URL(`/?error=${error || "no_code"}`, url.origin));
  }

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

  const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
  
  console.log("Session user:", data?.user?.id);
  console.log("Session error:", sessionError?.message);

  if (sessionError || !data?.user) {
    console.error("❌ Erro na sessão:", sessionError);
    return NextResponse.redirect(new URL(`/?error=session_error`, url.origin));
  }

  const user = data.user;
  const userType = type || user.user_metadata?.user_type || "motorista";
  
  console.log("User ID:", user.id);
  console.log("User email:", user.email);
  console.log("User provider:", user.app_metadata?.provider);
  console.log("User type final:", userType);

  // SEMPRE verificar e criar profile se não existir
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, type")
    .eq("id", user.id)
    .maybeSingle();

  console.log("Existing profile:", existingProfile?.id);

  // Se não existe profile, CRIAR
  if (!existingProfile) {
    const name = user.user_metadata?.name || 
                 user.user_metadata?.full_name || 
                 user.email?.split("@")[0] || 
                 "Usuário";

    console.log("🔨 CRIANDO NOVO PROFILE:", { id: user.id, email: user.email, name, type: userType });

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name,
      type: userType,
    });

    if (insertError) {
      console.error("❌ Erro ao criar profile:", insertError);
      // Tentar continuar mesmo com erro
    } else {
      console.log("✅ Profile criado com sucesso!");

      // Se motorista, criar registro em motorists
      if (userType === "motorista") {
        console.log("🔨 Criando motorist...");
        const { error: motoristError } = await supabase.from("motorists").insert({
          profile_id: user.id,
        });
        
        if (motoristError) {
          console.error("❌ Erro ao criar motorist:", motoristError);
        } else {
          console.log("✅ Motorist criado com sucesso!");
        }
      }
    }
  } else {
    console.log("✅ Profile já existe");
  }

  // Determinar redirecionamento
  const finalType = existingProfile?.type || userType;
  console.log("Final type para redirect:", finalType);

  if (finalType === "oficina") {
    // Verificar se já tem workshop
    const { data: workshop } = await supabase
      .from("workshops")
      .select("id")
      .eq("profile_id", user.id)
      .single();

    if (workshop) {
      console.log("✅ Redirecionando para /oficina");
      return NextResponse.redirect(new URL("/oficina", url.origin));
    } else {
      console.log("✅ Redirecionando para /completar-cadastro");
      return NextResponse.redirect(new URL("/completar-cadastro", url.origin));
    }
  }

  console.log("✅ Redirecionando para /motorista");
  return NextResponse.redirect(new URL("/motorista?welcome=true", url.origin));
}
