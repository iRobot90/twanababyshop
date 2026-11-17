'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GlobalCartDrawer from '@/components/Cart/GlobalCartDrawer';

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    if (isAdminRoute) {
        return <>{children}</>;
    }

    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white p-3">Skip to content</a><Header />
            <div id="main-content" tabIndex={-1}>{children}</div>
            <Footer />
            <GlobalCartDrawer />
        </>
    );
}
