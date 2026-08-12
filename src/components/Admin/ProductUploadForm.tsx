'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import { useToastStore } from '@/lib/toast-store';
import { PRODUCT_CATEGORIES } from '@/lib/products/validation';

interface FieldErrors {
    [key: string]: string;
}

const INITIAL = {
    title: '',
    description: '',
    price: '',
    stock_quantity: '0',
    category: 'general',
    is_active: true,
};

export default function ProductUploadForm() {
    const showToast = useToastStore((s) => s.showToast);
    const [form, setForm] = useState(INITIAL);
    const [images, setImages] = useState<File[]>([]);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const updateField = (name: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitting(true);
        setFieldErrors({});

        const payload = new FormData();
        payload.set('title', form.title);
        payload.set('description', form.description);
        payload.set('price', form.price);
        payload.set('stock_quantity', form.stock_quantity);
        payload.set('category', form.category);
        payload.set('is_active', String(form.is_active));
        images.forEach((file) => payload.append('images', file));

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                body: payload,
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.errors && typeof data.errors === 'object') {
                    setFieldErrors(data.errors);
                }
                showToast('error', data.error || 'Failed to save product');
                return;
            }

            showToast('success', data.message || 'Product saved successfully');
            setForm(INITIAL);
            setImages([]);
        } catch {
            showToast('error', 'Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-bold">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        value={form.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                        placeholder="Cloud Nine Stroller"
                        required
                    />
                    {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-bold">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={5}
                        className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                        placeholder="Describe materials, age range, and key features..."
                    />
                    {fieldErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
                    )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="price" className="mb-2 block text-sm font-bold">
                            Price (KES) <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="price"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.price}
                            onChange={(e) => updateField('price', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                            placeholder="4500"
                            required
                        />
                        {fieldErrors.price && <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>}
                    </div>

                    <div>
                        <label htmlFor="stock_quantity" className="mb-2 block text-sm font-bold">
                            Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="stock_quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={form.stock_quantity}
                            onChange={(e) => updateField('stock_quantity', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                            required
                        />
                        {fieldErrors.stock_quantity && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors.stock_quantity}</p>
                        )}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="mb-2 block text-sm font-bold">
                            Category
                        </label>
                        <select
                            id="category"
                            value={form.category}
                            onChange={(e) => updateField('category', e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary"
                        >
                            {PRODUCT_CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category.replace('-', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <label className="inline-flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(e) => updateField('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-semibold">Visible on storefront</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <ImageUploadField files={images} onChange={setImages} error={fieldErrors.images} />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-4 text-lg font-bold text-white transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Save Product
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
