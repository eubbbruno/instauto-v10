import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll().map(c => ({ name: c.name, value: c.value })),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Rotas públicas - não precisa de auth
  const publicRoutes = [
    "/",
    "/login",
    "/auth/callback",
    "/para-oficinas",
    "/sobre",
    "/contato",
    "/como-funciona",
    "/planos",
    "/termos",
    "/privacidade",
    "/politica-privacidade",
    "/termos-uso",
    "/buscar-oficinas",
    "/motoristas",
  ];

  const isPublicRoute = publicRoutes.some(route => pathname === route) || 
                       pathname.startsWith("/api/") ||
                       pathname.startsWith("/_next/") ||
                       pathname.includes(".");

  if (isPublicRoute) {
    return res;
  }

  // Rotas protegidas - precisa de auth
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
