import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Ignorar arquivos estáticos
  if (pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname.includes(".")) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        }),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Rotas protegidas
  const protectedRoutes = ["/motorista", "/oficina", "/completar-cadastro"];
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Validar tipo de usuário vs rota
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("type")
      .eq("id", user.id)
      .single();

    // Redirecionar se tipo de usuário não corresponde à rota
    if (pathname.startsWith("/motorista") && profile?.type !== "motorista") {
      return NextResponse.redirect(new URL("/oficina", request.url));
    }
    
    if (pathname.startsWith("/oficina") && profile?.type !== "oficina") {
      return NextResponse.redirect(new URL("/motorista", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
