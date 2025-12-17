'use client';

import { useEffect, useState, Suspense } from 'react';
import { fetchProducts } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    image: string;
    category: {
        name: string;
        slug: string;
    };
}

function ShopContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchProducts({
                    category: categoryParam || undefined,
                    search: searchParam || undefined,
                    ordering: sortOrder || undefined
                });
                setProducts(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [categoryParam, searchParam, sortOrder]);

    const categories = Array.from(new Set(products.map(p => p.category.name)));

    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-gray-50/50">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-outfit">
                            {searchParam ? `Results for "${searchParam}"` : 'Shop Collection'}
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            {products.length} items found
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                        <SlidersHorizontal className="w-5 h-5 text-muted-foreground ml-2" />
                        <select
                            className="bg-transparent border-none outline-none text-sm font-medium py-2 pr-4"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="">Featured</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-created">Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {products.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl text-muted-foreground">No products found matching your search.</p>
                                <Link href="/shop" className="text-primary font-bold hover:underline mt-4 inline-block">Clear Filters</Link>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <Link
                                    href={`/product?slug=${product.slug}`}
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
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors">
                                                <Heart className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 bg-white rounded-full shadow-sm hover:text-primary transition-colors">
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="px-1">
                                        <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
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
