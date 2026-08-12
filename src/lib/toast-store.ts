import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastStore {
    toasts: Toast[];
    showToast: (type: ToastType, message: string) => void;
    dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    showToast: (type, message) => {
        const id = crypto.randomUUID();
        set({ toasts: [...get().toasts, { id, type, message }] });
        setTimeout(() => get().dismissToast(id), 5000);
    },
    dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
