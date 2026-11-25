'use client';

import { useEffect, useState, Suspense } from 'react';
import { fetchShopProducts } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { catalogOrdering, shopHref, shopProductHref } from '@/lib/browseNavigation.mjs';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: {
        name: string;
        slug: string;
    };
}

type CatalogState =
    | { key: string; status: 'loading' | 'error' }
    | { key: string; status: 'ready'; products: Product[] };

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    const sortOrder = catalogOrdering(searchParams.get('ordering'));
    const [retry, setRetry] = useState(0);
    const requestKey = JSON.stringify([categoryParam, searchParam, sortOrder, retry]);
    const [catalog, setCatalog] = useState<CatalogState>({ key: requestKey, status: 'loading' });

    useEffect(() => {
        const controller = new AbortController();
        fetchShopProducts({
            category: categoryParam || undefined,
            search: searchParam || undefined,
            ordering: sortOrder || undefined,
        }, controller.signal).then(
            products => {
                if (!controller.signal.aborted) setCatalog({ key: requestKey, status: 'ready', products });
            },
            () => {
                if (!controller.signal.aborted) setCatalog({ key: requestKey, status: 'error' });
            },
        );
        return () => controller.abort();
    }, [categoryParam, searchParam, sortOrder, requestKey]);

    // Do not flash the previous filters' results while the next effect starts.
    const status = catalog.key === requestKey ? catalog.status : 'loading';
    const products = catalog.key === requestKey && catalog.status === 'ready' ? catalog.products : [];

    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-outfit">
                            {searchParam ? `Results for "${searchParam}"` : 'Shop Collection'}
                        </h1>
                        <p role="status" className="text-muted-foreground max-w-2xl">
                            {status === 'loading' && 'Loading products…'}
                            {status === 'ready' && `${products.length} ${products.length === 1 ? 'item' : 'items'} found`}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <SlidersHorizontal className="w-5 h-5 text-muted-foreground ml-2" />
                        <select
                            aria-label="Sort products"
                            className="bg-transparent border-none outline-none text-sm font-medium py-2 pr-4"
                            value={sortOrder}
                            onChange={(e) => window.history.replaceState(null, "", shopHref(searchParams, e.target.value))}
                        >
                            <option value="">Featured</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-created">Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {status === 'loading' ? (
                    <div aria-hidden="true" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : status === 'error' ? (
                    <div className="text-center py-20">
                        <p role="alert" className="text-xl">We couldn’t load the catalog. Please try again.</p>
                        <button type="button" onClick={() => setRetry(attempt => attempt + 1)} className="text-primary font-bold hover:underline mt-4">
                            Retry catalog
                        </button>
                    </div>
                ) : (
                    <>
                        {products.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-muted-foreground">
                                    {categoryParam || searchParam ? 'No products match those filters.' : 'No products are listed yet.'}
                                </p>
                                {(categoryParam || searchParam) && (
                                    <Link href="/shop" className="text-primary font-bold hover:underline mt-4 inline-block">Clear filters</Link>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <Link
                                    href={shopProductHref(product.slug, searchParams)}
                                    key={product.id}
                                    className="group bg-white rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                                        {product.image && <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />}

                                    </div>
                                    <div className="px-1">
                                        <h2 className="font-bold text-lg mb-1 truncate">{product.name}</h2>
                                        <div className="flex items-center justify-between">
                                            <p className="text-primary font-bold text-xl">{formatCurrency(Number(product.price))}</p>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-gray-100 px-2 py-1 rounded-md">
                                                {product.category.name}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading Store...</div>}>
            <ShopContent />
        </Suspense>
    );
}
