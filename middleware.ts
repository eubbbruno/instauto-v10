import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Se está na home (/) e tem um code, redirecionar para /auth/callback
  if (pathname === '/' && searchParams.has('code')) {
    const code = searchParams.get('code');
    
    if (code) {
      const callbackUrl = new URL('/auth/callback', request.url);
      callbackUrl.searchParams.set('code', code);
      
      console.log('Redirecting to callback with code:', code);
      
      return NextResponse.redirect(callbackUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

