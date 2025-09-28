import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('🔍 Middleware ejecutándose para:', req.nextUrl.pathname);

  const res = NextResponse.next();

  // Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('🔍 Variables de entorno en middleware:');
  console.log('URL:', supabaseUrl ? '✅ Presente' : '❌ Faltante');
  console.log('Key:', supabaseAnonKey ? '✅ Presente' : '❌ Faltante');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Variables de entorno faltantes en middleware');
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });

  // Verificar si la ruta es de admin (excepto login y unauthorized)
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    !req.nextUrl.pathname.startsWith('/admin/login') &&
    !req.nextUrl.pathname.startsWith('/admin/unauthorized')
  ) {
    console.log('🔍 Verificando autenticación para ruta admin');

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log('🔍 Sesión encontrada:', !!session);

      // Si no hay sesión, redirigir al login
      if (!session) {
        console.log('❌ No hay sesión, redirigiendo al login');
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      // Verificar si el usuario es admin
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

      console.log('🔍 Usuario encontrado:', !!user);
      console.log('🔍 Error usuario:', userError?.message);

      if (userError) {
        console.error('❌ Error obteniendo usuario:', userError.message);
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
      }

      if (!user || !['admin', 'super_admin'].includes(user.role)) {
        console.log('❌ Usuario no es admin, redirigiendo a unauthorized');
        return NextResponse.redirect(new URL('/admin/unauthorized', req.url));
      }

      console.log('✅ Usuario autenticado como admin');
    } catch (error) {
      console.error('❌ Error en middleware:', error.message);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
