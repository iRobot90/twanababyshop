'use client';

import { useCartStore } from '@/lib/store';
import CartDrawer from '@/components/Cart/CartDrawer';
import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export default function GlobalCartDrawer() {
    const { isOpen, closeCart } = useCartStore();
    const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

    if (!mounted) return null;

    return <CartDrawer isOpen={isOpen} onClose={closeCart} />;
}
