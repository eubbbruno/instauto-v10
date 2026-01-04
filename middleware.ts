import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANTE: Usar getUser() ao invés de getSession() - mais seguro e não usa cache
  const { data: { user }, error } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/motorista", "/oficina", "/completar-cadastro"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && (!user || error)) {
    console.log("🔒 Protected route without user, redirecting to /");
    
    // Limpar cookies e redirecionar
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));
    
    // Deletar cookies de sessão do Supabase
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.startsWith("sb-")) {
        redirectResponse.cookies.delete(cookie.name);
      }
    });
    
    return redirectResponse;
  }

  // Rotas de auth - redirecionar se já logado
  const authRoutes = ["/login-motorista", "/login-oficina", "/cadastro-motorista", "/cadastro-oficina"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && user && !error) {
    console.log("🔑 Auth route with user, checking profile...");
    
    // Verificar tipo e redirecionar
    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", user.id)
      .single();

    console.log("👤 Profile type:", profile?.type);

    if (profile?.type === "oficina") {
      console.log("🏢 Redirecting to /oficina");
      return NextResponse.redirect(new URL("/oficina", request.url));
    } else if (profile?.type === "motorista") {
      console.log("🚗 Redirecting to /motorista");
      return NextResponse.redirect(new URL("/motorista", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
