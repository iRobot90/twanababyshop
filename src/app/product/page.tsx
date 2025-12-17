import { Suspense } from 'react';
import ProductContainer from '@/components/product/ProductContainer';

export default function ProductPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
            <main className="bg-gradient-to-b from-white to-secondary/30 min-h-screen">
                <ProductContainer />
            </main>
        </Suspense>
    );
}
