'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Suspense } from 'react';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/admin/products';
    const authError = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            router.push(redirect);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to initialize Supabase. Check your environment settings.');
            setLoading(false);
        }


    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#FFF9F5] px-6 py-12">
            <div className="w-full max-w-md rounded-[2rem] border border-gray-100 bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Lock className="h-7 w-7" />
                    </div>
                    <h1 className="text-3xl font-black">Twana Admin</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Sign in to upload and manage store inventory.
                    </p>
                </div>

                {(error || authError) && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <p>{error || (authError === 'unauthorized' ? 'This account does not have admin access.' : 'Authentication failed. Please try again.')}</p>
                        {!error && !authError && (
                            <p className="mt-2">Create an admin user in Supabase Auth and sign in with those credentials.</p>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-bold">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-bold">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 font-bold text-white hover:bg-foreground/90 disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    <Link href="/" className="font-semibold text-primary hover:underline">
                        Back to storefront
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFF9F5]" />}>
            <LoginForm />
        </Suspense>
    );
}
