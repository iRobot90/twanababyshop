import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

// Only server-managed metadata is authoritative; user_metadata is editable by users.
// Match the database RLS policy exactly.
export function isAdminUser(user: User | null | undefined): boolean {
    return user?.app_metadata?.role === 'admin';
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
