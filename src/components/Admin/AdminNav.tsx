'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PackagePlus, LayoutGrid, LogOut, Store } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const NAV = [
    {href:'/admin/orders',label:'Orders',icon:LayoutGrid},
    { href: '/admin/products', label: 'Inventory', icon: LayoutGrid },
    { href: '/admin/products/new', label: 'Add Product', icon: PackagePlus },
];

export default function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <div className="flex items-center gap-6">
                    <Link href="/admin/products" className="text-xl font-black tracking-tight">
                        Twaana<span className="text-primary">.</span> Admin
                    </Link>
                    <nav className="hidden items-center gap-2 md:flex">
                        {NAV.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                        active
                                            ? 'bg-primary/15 text-primary'
                                            : 'text-muted-foreground hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100"
                    >
                        <Store className="h-4 w-4" />
                        View Store
                    </Link>
                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-foreground/90"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
}
