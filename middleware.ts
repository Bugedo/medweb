import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    },
  );

  // Verificar si la ruta es de admin (excepto login y unauthorized)
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    !req.nextUrl.pathname.startsWith('/admin/login') &&
    !req.nextUrl.pathname.startsWith('/admin/unauthorized')
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Si no hay sesión, redirigir al login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Verificar si el usuario es admin
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', session.user.email)
      .single();

    if (!user || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
