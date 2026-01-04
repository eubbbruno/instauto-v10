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

  // Refresh session se existir
  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Rotas que precisam de autenticação
  const protectedRoutes = ["/motorista", "/oficina", "/completar-cadastro"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirecionar para home se não autenticado
    console.log("Protected route without session, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Rotas de auth - redirecionar se já logado
  const authRoutes = ["/login-motorista", "/login-oficina", "/cadastro-motorista", "/cadastro-oficina"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && session) {
    // Verificar tipo e redirecionar
    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", session.user.id)
      .single();

    console.log("Auth route with session, profile type:", profile?.type);

    if (profile?.type === "oficina") {
      return NextResponse.redirect(new URL("/oficina", request.url));
    } else if (profile?.type === "motorista") {
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
