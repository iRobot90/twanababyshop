import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

function normalizeRole(value: unknown): string | null {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim().toLowerCase();
    return normalized === 'admin' || normalized === 'administrator' ? normalized : null;
}

export function isAdminUser(user: User | null | undefined): boolean {
    const appMetadata = (user?.app_metadata ?? {}) as Record<string, unknown>;
    const userMetadata = (user?.user_metadata ?? {}) as Record<string, unknown>;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || process.env.NEXT_PUBLIC_ADMIN_EMAIL?.trim().toLowerCase();

    const rolesToCheck = [
        appMetadata.role,
        userMetadata.role,
        appMetadata.roles,
        userMetadata.roles,
        appMetadata.user_role,
        userMetadata.user_role,
        appMetadata.is_admin,
        userMetadata.is_admin,
        appMetadata.admin,
        userMetadata.admin,
    ];

    if (adminEmail && user?.email?.trim().toLowerCase() === adminEmail) {
        return true;
    }

    if (Array.isArray(appMetadata.roles)) {
        return appMetadata.roles.some((role) => normalizeRole(role) === 'admin');
    }

    if (Array.isArray(userMetadata.roles)) {
        return userMetadata.roles.some((role) => normalizeRole(role) === 'admin');
    }

    if (rolesToCheck.some((role) => normalizeRole(role) === 'admin')) {
        return true;
    }

    const claims = (user as User & { access_token?: string })?.access_token;
    if (typeof claims === 'string' && claims.includes('.')) {
        const [, payload] = claims.split('.');
        try {
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8')) as Record<string, unknown>;
            const tokenRole = decoded.role ?? decoded.roles ?? decoded.user_role ?? decoded.is_admin ?? decoded.admin;
            if (normalizeRole(tokenRole as string) === 'admin') {
                return true;
            }
            if (Array.isArray(tokenRole)) {
                return tokenRole.some((role) => normalizeRole(role as string) === 'admin');
            }
        } catch {
            // Ignore malformed tokens and fall back to metadata checks.
        }
    }

    return false;
}

export async function requireAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return { supabase, user: null, error: 'Authentication required' as const };
    }

    if (!isAdminUser(user)) {
        return { supabase, user: null, error: 'Admin access required' as const };
    }

    return { supabase, user, error: null };
}
