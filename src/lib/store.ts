import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // Product ID
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
  setQuantity: (
    id: string,
    color: string | undefined,
    quantity: number,
  ) => void;
  removeFromCart: (id: string, color?: string) => void;
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
        const all = get().items;
        const count = all
          .filter((i) => i.id === newItem.id)
          .reduce((sum, i) => sum + i.quantity, 0);
        const limit = Math.min(20, Math.max(0, newItem.stock_quantity ?? 0));
        if (count >= limit) return false;
        const existing = all.find(
          (i) => i.id === newItem.id && i.color === newItem.color,
        );
        set({
          items: existing
            ? all.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + 1 } : i,
              )
            : [...all, { ...newItem, quantity: 1 }],
        });
        return true;
      },
      setQuantity: (id, color, quantity) =>
        set((state) => {
          const item = state.items.find(
            (i) => i.id === id && i.color === color,
          );
          if (!item || !Number.isInteger(quantity)) return state;
          if (quantity <= 0)
            return { items: state.items.filter((i) => i !== item) };
          const others = state.items
            .filter((i) => i.id === id && i !== item)
            .reduce((sum, i) => sum + i.quantity, 0);
          const max = Math.max(
            0,
            Math.min(20, item.stock_quantity ?? 0) - others,
          );
          return {
            items: state.items
              .map((i) =>
                i === item ? { ...i, quantity: Math.min(quantity, max) } : i,
              )
              .filter((i) => i.quantity > 0),
          };
        }),
      removeFromCart: (id, color) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.color === color)),
        })),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "twana-cart-storage",
      partialize: (state) => ({ items: state.items }),
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            return window.localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            window.localStorage.setItem(key, value);
          } catch {
            /* Cart stays in memory when storage is unavailable. */
          }
        },
        removeItem: (key) => {
          try {
            window.localStorage.removeItem(key);
          } catch {
            /* No persistent storage. */
          }
        },
      })),
    },
  ),
);
