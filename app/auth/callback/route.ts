import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type") as "motorista" | "oficina" | null;
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/", url.origin));
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
  
  if (sessionError || !data?.user) {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  const user = data.user;
  const userType = type || user.user_metadata?.user_type || "motorista";

  // Verificar se profile existe
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, type")
    .eq("id", user.id)
    .single();

  // Criar profile se não existe
  if (!profile) {
    const name = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";
    
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      name,
      type: userType,
    });

    if (userType === "motorista") {
      await supabase.from("motorists").insert({ profile_id: user.id });
    }
  }

  // Redirecionar
  const finalType = profile?.type || userType;
  
  if (finalType === "oficina") {
    const { data: workshop } = await supabase.from("workshops").select("id").eq("profile_id", user.id).single();
    return NextResponse.redirect(new URL(workshop ? "/oficina" : "/completar-cadastro", url.origin));
  }
  
  return NextResponse.redirect(new URL("/motorista", url.origin));
}
