import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number; // Product ID
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string; // Selected color
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    total: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            addToCart: (newItem) => set((state) => {
                const existingItem = state.items.find(i => i.id === newItem.id && i.color === newItem.color);
                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            (i.id === newItem.id && i.color === newItem.color)
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        )
                    };
                }
                return { items: [...state.items, { ...newItem, quantity: 1 }] };
            }),
            removeFromCart: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }),
        { name: 'twana-cart-storage' }
    )
);
