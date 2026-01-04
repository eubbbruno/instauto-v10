import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const typeFromUrl = requestUrl.searchParams.get("type") as "motorista" | "oficina" | null;

  console.log("========== AUTH CALLBACK ==========");
  console.log("Code:", code ? "SIM" : "NÃO");
  console.log("Type:", typeFromUrl);
  console.log("Error:", error);

  if (error || !code) {
    return NextResponse.redirect(new URL(`/?error=${error || "no_code"}`, requestUrl.origin));
  }

  // IMPORTANTE: Criar response primeiro para poder setar cookies
  const response = NextResponse.redirect(new URL("/", requestUrl.origin));

  try {
    const cookieStore = await cookies();
    
    // Criar cliente com cookieStore E response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Setar no cookieStore
              try {
                cookieStore.set(name, value, options);
              } catch (e) {
                // Ignore
              }
              // IMPORTANTE: Setar também no response
              response.cookies.set(name, value, options as CookieOptions);
            });
          },
        },
      }
    );

    // Trocar código por sessão
    console.log("Exchanging code for session...");
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData?.user) {
      console.error("Session error:", sessionError);
      return NextResponse.redirect(new URL(`/?error=session_error`, requestUrl.origin));
    }

    const user = sessionData.user;
    const session = sessionData.session;
    
    console.log("✅ User:", user.id, user.email);
    console.log("✅ Session access_token exists:", !!session?.access_token);

    // FORÇAR cookies de sessão no response
    if (session) {
      const cookieOptions: CookieOptions = {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      };

      response.cookies.set("sb-access-token", session.access_token, cookieOptions);
      response.cookies.set("sb-refresh-token", session.refresh_token, cookieOptions);
      
      // Cookie específico do projeto Supabase
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/(.+)\.supabase/)?.[1];
      if (projectRef) {
        response.cookies.set(
          `sb-${projectRef}-auth-token`,
          JSON.stringify({ 
            access_token: session.access_token, 
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          }),
          cookieOptions
        );
        console.log("✅ Set project-specific cookie:", `sb-${projectRef}-auth-token`);
      }
      
      console.log("✅ Session cookies set in response");
    }

    // Criar admin client para bypass RLS
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

    // Determinar tipo
    const userType = typeFromUrl || user.user_metadata?.user_type || "motorista";
    console.log("User type:", userType);

    // Verificar/criar profile
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, type")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário";
      
      console.log("Creating profile...");
      // Criar profile
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        id: user.id,
        email: user.email,
        name: userName,
        type: userType,
      });

      if (profileError) {
        console.error("Profile error:", profileError);
      } else {
        console.log("✅ Profile created");
      }

      // Se motorista, criar motorist
      if (userType === "motorista") {
        console.log("Creating motorist...");
        const { error: motoristError } = await supabaseAdmin.from("motorists").insert({
          profile_id: user.id,
        });

        if (motoristError) {
          console.error("Motorist error:", motoristError);
        } else {
          console.log("✅ Motorist created");
        }
      }
    }

    // Definir URL de redirecionamento
    const finalType = existingProfile?.type || userType;
    let redirectUrl: string;

    if (finalType === "oficina") {
      // Verificar se workshop existe
      const { data: workshop } = await supabaseAdmin
        .from("workshops")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!workshop) {
        // Criar workshop básico se não existir
        console.log("Creating basic workshop entry...");
        const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Oficina";
        
        const { error: workshopError } = await supabaseAdmin.from("workshops").insert({
          profile_id: user.id,
          name: userName,
          plan_type: "free",
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 dias
        });

        if (workshopError) {
          console.error("Workshop creation error:", workshopError);
        } else {
          console.log("✅ Basic workshop created");
        }
      }

      // Sempre redireciona para completar cadastro (para preencher dados completos)
      redirectUrl = "/completar-cadastro";
    } else {
      // Verificar se motorist existe
      const { data: motorist } = await supabaseAdmin
        .from("motorists")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      if (!motorist) {
        // Criar motorist se não existir
        console.log("Creating motorist (fallback)...");
        const { error: motoristError } = await supabaseAdmin.from("motorists").insert({
          profile_id: user.id,
        });

        if (motoristError) {
          console.error("Motorist creation error:", motoristError);
        } else {
          console.log("✅ Motorist created (fallback)");
        }
      }

      redirectUrl = "/motorista?welcome=true";
    }

    console.log("Redirecting to:", redirectUrl);

    // Atualizar URL de redirecionamento na response
    const finalResponse = NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
    
    // Copiar todos os cookies da response original
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      });
    });

    return finalResponse;

  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/?error=internal", requestUrl.origin));
  }
}
