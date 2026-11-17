'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PackagePlus, RefreshCw } from 'lucide-react';
import type { ProductRecord } from '@/lib/products/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/admin/products');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to load products');
            setProducts(data.products ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/admin/products', {signal: controller.signal})
            .then(async response => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to load products');
                return data;
            })
            .then(data => { if (!controller.signal.aborted) setProducts(data.products ?? []); })
            .catch(err => { if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Failed to load products'); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    return (
        <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-primary">Inventory</p>
                    <h1 className="text-4xl font-black">Product Management</h1>
                    <p className="mt-2 text-muted-foreground">
                        Upload products, track stock, and control storefront visibility.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={loadProducts}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </button>
                    <Link
                        href="/admin/products/new"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary/90"
                    >
                        <PackagePlus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 animate-pulse rounded-3xl bg-gray-200" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-lg font-semibold">No products yet</p>
                    <p className="mt-2 text-muted-foreground">Upload your first product to populate the store.</p>
                    <Link
                        href="/admin/products/new"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-bold text-white"
                    >
                        <PackagePlus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <article
                            key={product.id}
                            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                        >
                            <div className="relative aspect-[4/3] bg-gray-100">
                                {product.image_url?.[0] ? (
                                    <Image
                                        src={product.image_url[0]}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                        No image
                                    </div>
                                )}
                                {!product.is_active && (
                                    <span className="absolute left-3 top-3 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-bold text-white">
                                        Hidden
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2 p-5">
                                <h2 className="truncate text-lg font-bold">{product.title}</h2>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {product.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="font-bold text-primary">
                                        {formatCurrency(Number(product.price))}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            product.stock_quantity === 0
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {product.stock_quantity === 0
                                            ? 'Out of stock'
                                            : `${product.stock_quantity} in stock`}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
