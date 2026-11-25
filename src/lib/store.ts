import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number; // Product ID
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string; // Selected color
    stock_quantity?: number;
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addToCart: (item: CartItem) => boolean;
    decreaseCartItem: (id: number, color?: string) => void;
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
            addToCart: (newItem) => {
                const sameItem = (item: CartItem) => item.id === newItem.id && item.color === newItem.color;
                const existing = get().items.find(sameItem);
                if (existing) {
                    const nextQuantity = existing.quantity + 1;
                    if (typeof existing.stock_quantity === 'number' && nextQuantity > existing.stock_quantity) {
                        return false;
                    }
                    set(state => ({
                        items: state.items.map(item => sameItem(item) ? { ...item, quantity: nextQuantity } : item),
                    }));
                    return true;
                }
                const stockQuantity = typeof newItem.stock_quantity === 'number' ? newItem.stock_quantity : 999;
                if (stockQuantity <= 0) return false;
                set(state => ({ items: [...state.items, { ...newItem, quantity: 1 }] }));
                return true;
            },
            decreaseCartItem: (id, color) => {
                const sameItem = (item: CartItem) => item.id === id && item.color === color;
                const item = get().items.find(sameItem);
                if (!item) return;
                set(state => ({
                    items: item.quantity <= 1
                        ? state.items.filter(current => !sameItem(current))
                        : state.items.map(current => sameItem(current)
                            ? { ...current, quantity: current.quantity - 1 }
                            : current),
                }));
            },
            removeFromCart: (id) => set((state) => ({
                items: state.items.filter(i => i.id !== id)
            })),
            clearCart: () => set({ items: [] }),
            total: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }),
        { name: 'twana-cart-storage' }
    )
);
