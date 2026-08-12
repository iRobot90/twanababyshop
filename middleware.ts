import { type NextRequest, NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/admin/auth';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.next();
    }

    const { supabaseResponse, user } = await updateSession(request);
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isAdminApi = pathname.startsWith('/api/admin');
    const isLoginPage = pathname === '/admin/login';
    const isAuthCallback = pathname.startsWith('/auth/callback');

    if (isAuthCallback) {
        return supabaseResponse;
    }

    if ((isAdminRoute && !isLoginPage) || isAdminApi) {
        if (!user) {
            if (isAdminApi) {
                return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
            }
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (!isAdminUser(user)) {
            if (isAdminApi) {
                return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
            }
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('error', 'unauthorized');
            return NextResponse.redirect(loginUrl);
        }
    }

    if (isLoginPage && user && isAdminUser(user)) {
        return NextResponse.redirect(new URL('/admin/products', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*', '/auth/callback'],
};
