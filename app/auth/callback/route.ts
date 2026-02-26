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
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !session?.user) {
        console.error("❌ [Callback] Erro sessão:", error);
        return NextResponse.redirect(new URL("/login?error=session", requestUrl.origin));
      }

      console.log("✅ [Callback] Usuário:", session.user.email);

      // Verificar se profile existe
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (existingProfile) {
        console.log("✅ [Callback] Profile existe:", existingProfile.type);
        const redirectUrl = existingProfile.type === "workshop" ? "/oficina" : "/motorista";
        return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
      }

      // Criar novo profile
      console.log("🔨 [Callback] Criando profile...");
      
      const userTypeCookie = cookieStore.get("instauto_user_type");
      const userType = userTypeCookie?.value === "oficina" ? "workshop" : "motorist";
      const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuário";

      const { error: profileError } = await supabase.from("profiles").insert({
        id: session.user.id,
        email: session.user.email,
        name: userName,
        type: userType,
      });

      if (profileError) {
        console.error("❌ [Callback] Erro profile:", profileError);
        return NextResponse.redirect(new URL("/login?error=profile", requestUrl.origin));
      }

      // Criar workshop ou motorist
      if (userType === "workshop") {
        await supabase.from("workshops").insert({
          profile_id: session.user.id,
          name: userName,
          plan_type: "free",
          subscription_status: "trial",
          is_public: true,
          accepts_quotes: true,
        });
        console.log("✅ [Callback] Workshop criado");
        return NextResponse.redirect(new URL("/oficina", requestUrl.origin));
      } else {
        await supabase.from("motorists").insert({
          profile_id: session.user.id,
        });
        console.log("✅ [Callback] Motorist criado");
        return NextResponse.redirect(new URL("/motorista", requestUrl.origin));
      }

    } catch (error) {
      console.error("❌ [Callback] Erro:", error);
      return NextResponse.redirect(new URL("/login?error=unknown", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
