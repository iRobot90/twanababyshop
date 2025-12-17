'use client';

import { useCartStore } from '@/lib/store';
import CartDrawer from '@/components/cart/CartDrawer';
import { useEffect, useState } from 'react';

export default function GlobalCartDrawer() {
    const { isOpen, closeCart } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <CartDrawer isOpen={isOpen} onClose={closeCart} />;
}
