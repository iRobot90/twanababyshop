'use client';

import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '@/lib/toast-store';

const ICONS = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
};

const STYLES = {
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    info: 'border-blue-200 bg-blue-50 text-blue-900',
};

export default function ToastContainer() {
    const { toasts, dismissToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
            {toasts.map((toast) => {
                const Icon = ICONS[toast.type];
                return (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 rounded-2xl border p-4 shadow-lg ${STYLES[toast.type]}`}
                        role="status"
                    >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            className="rounded-full p-1 hover:bg-black/5"
                            aria-label="Dismiss notification"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
