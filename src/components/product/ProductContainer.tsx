'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { Ruler, ShoppingCart, Check, Heart } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';
import { useCartStore } from '@/lib/store';
import { fetchShopProducts } from '@/lib/api';
import { resolveProductDetail } from './resolveProductDetail.mjs';
import { useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { shopHref } from '@/lib/browseNavigation.mjs';

// Loading State
const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full h-full p-6 animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-[3rem]" />
        <div className="flex flex-col gap-8">
            <div className="h-8 w-1/3 bg-gray-200 rounded-full" />
            <div className="h-16 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-10 w-1/4 bg-gray-200 rounded-lg" />
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
            <div className="h-14 w-full bg-gray-200 rounded-full" />
        </div>
    </div>
);

function ProductPhoto({ image, name }: { image: string; name: string }) {
    const [failed, setFailed] = useState(false);

    if (!image || failed) {
        return (
            <div className="grid h-full place-items-center p-6 text-center text-muted-foreground">
                Product photo unavailable.
            </div>
        );
    }

    return (
        <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-contain"
            onError={() => setFailed(true)}
        />
    );
}

export default function ProductContainer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    const backToShop = shopHref(searchParams);

    const [retry, setRetry] = useState(0);
    const requestKey = JSON.stringify([slug, retry]);
    const [detail, setDetail] = useState<
        { key: string; status: 'loading' | 'error' | 'missing' }
        | { key: string; status: 'ready'; product: any; relatedProducts: any[] }
    >({ key: requestKey, status: 'loading' });
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const { addToCart } = useCartStore();
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const controller = new AbortController();
        fetchShopProducts({}, controller.signal).then(
            products => {
                if (controller.signal.aborted) return;
                const result = resolveProductDetail(products, slug);
                if (result) {
                    setAdded(false);
                    setDetail({ key: requestKey, status: 'ready', ...result });
                } else {
                    setDetail({ key: requestKey, status: 'missing' });
                }
            },
            () => {
                if (!controller.signal.aborted) setDetail({ key: requestKey, status: 'error' });
            },
        );
        return () => controller.abort();
    }, [slug, requestKey]);

    // A quick navigation should never leave the previous product actionable.
    const current = detail.key === requestKey ? detail : null;
    const product = current?.status === 'ready' ? current.product : null;
    const relatedProducts = current?.status === 'ready' ? current.relatedProducts : [];

    const handleAddToCart = () => {
        if (!product || Number(product.stock_quantity ?? 0) <= 0) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.image,
            stock_quantity: Number(product.stock_quantity ?? 0),
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!slug || current?.status === 'missing' || current?.status === 'error') {
        const failed = current?.status === 'error';
        return (
            <div className="min-h-screen pt-28 px-6 text-center">
                <h1 className="text-3xl font-black" role={failed ? 'alert' : undefined}>
                    {failed ? 'We couldn’t load this product.' : 'This product isn’t available.'}
                </h1>
                <div className="mt-5 flex justify-center gap-4">
                    {failed && (
                        <button type="button" onClick={() => setRetry(attempt => attempt + 1)} className="font-bold underline">
                            Retry product
                        </button>
                    )}
                    <Link href={backToShop} className="font-bold underline">Back to the shop</Link>
                </div>
            </div>
        );
    }
    if (!product) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto">
                <p role="status" className="sr-only">Loading product…</p>
                <div aria-hidden="true"><LoadingSkeleton /></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 lg:pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <Link href={backToShop} className="mb-6 inline-block font-bold underline">Back to the shop</Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Visual Section */}
                <div className="w-full relative bg-gray-100 rounded-[2.5rem] overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] shadow-sm">
                    <ProductPhoto
                        key={JSON.stringify([product.id, product.image])}
                        image={typeof product.image === 'string' ? product.image.trim() : ''}
                        name={product.name}
                    />
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-6 lg:gap-8 px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                {product.category?.name || 'Collection'}
                            </span>
                            {typeof product.age_group === 'string' && product.age_group.trim() && (
                                <span className="text-gray-500 text-sm font-medium">{product.age_group}</span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                            {formatCurrency(Number(product.price))}
                        </p>
                        <div className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${Number(product.stock_quantity ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {Number(product.stock_quantity ?? 0) > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </div>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={added || Number(product.stock_quantity ?? 0) <= 0}
                                className={`flex-1 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${added
                                        ? 'bg-green-500 text-white'
                                        : 'bg-foreground text-white hover:bg-foreground/90'
                                    } ${Number(product.stock_quantity ?? 0) <= 0 ? 'cursor-not-allowed opacity-70' : ''}`}
                            >
                                {added ? (
                                    <>
                                        <Check className="w-6 h-6" /> Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                className="flex items-center justify-center w-full sm:w-14 h-14 rounded-full border-2 border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all font-bold"
                            >
                                <Heart className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center justify-center gap-2 text-primary font-semibold text-sm hover:underline"
                    >
                        <Ruler className="w-4 h-4" /> Size Guide
                    </button>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-black">Recommended for you</h2>
                        <span className="text-sm text-muted-foreground">Pair with your cart selection</span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {relatedProducts.map((item) => (
                            <div key={item.id} className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
                                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-gray-100">
                                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                                </div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="font-bold text-primary">{formatCurrency(Number(item.price))}</span>
                                    <button
                                        type="button"
                                        onClick={() => addToCart({ id: item.id, name: item.name, price: Number(item.price), quantity: 1, image: item.image, stock_quantity: Number(item.stock_quantity ?? 0) })}
                                        className="rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isSizeGuideOpen && <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
