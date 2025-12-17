'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import ProductScene from '@/components/three/ProductScene';
import BabyStroller from '@/components/three/BabyStroller';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, ShoppingCart, Star, Check, Heart, ImageOff, Box, ShieldCheck, Leaf } from 'lucide-react';
import SizeGuideModal from './SizeGuideModal';
import { useCartStore } from '@/lib/store';
import { fetchProducts, fetchProduct } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

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

export default function ProductContainer() {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');

    const [product, setProduct] = useState<any>(null);
    const [selectedColor, setSelectedColor] = useState<any>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'3d' | 'image'>('3d');
    const { addToCart } = useCartStore();
    const [added, setAdded] = useState(false);

    // Mock colors for the 3D model since DB might not have hex codes yet
    const PRODUCT_COLORS = [
        { name: 'Mist Blue', value: '#A5C8E4', hex: 'bg-[#A5C8E4]' },
        { name: 'Blush Pink', value: '#F4C2C2', hex: 'bg-[#F4C2C2]' },
        { name: 'Sage Green', value: '#9DC183', hex: 'bg-[#9DC183]' },
    ];

    useEffect(() => {
        const loadProduct = async () => {
            try {
                if (slug) {
                    const data = await fetchProduct(slug);
                    setProduct(data);
                    setSelectedColor(PRODUCT_COLORS[0]);
                } else {
                    // Fallback to default if no slug
                    const products = await fetchProducts({ category: 'strollers' });
                    const foundProduct = products.find((p: any) => p.slug === 'cloud-nine-stroller') || products[0];
                    if (foundProduct) {
                        setProduct(foundProduct);
                        setSelectedColor(PRODUCT_COLORS[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to load product", error);
            }
        };
        loadProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product || !selectedColor) return;

        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity: 1,
            image: product.image,
            color: selectedColor.name
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (!product) return <div className="min-h-screen pt-24 pb-12 px-6 container mx-auto"><LoadingSkeleton /></div>;

    const COLORS = PRODUCT_COLORS; // Alias for compatibility with the new layout code

    return (
        <div className="min-h-screen pt-20 lg:pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Visual Section */}
                <div className="w-full relative bg-gray-100 rounded-[2.5rem] overflow-hidden h-[400px] md:h-[500px] lg:h-[600px] shadow-sm">
                    <button
                        onClick={() => setViewMode(viewMode === '3d' ? 'image' : '3d')}
                        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-sm hover:scale-110 transition-transform"
                    >
                        {viewMode === '3d' ? <ImageOff className="w-5 h-5 text-gray-700" /> : <Box className="w-5 h-5 text-gray-700" />}
                    </button>

                    {viewMode === '3d' ? (
                        <div className="w-full h-full">
                            <ProductScene>
                                <Center>
                                    <BabyStroller color={selectedColor?.value} />
                                </Center>
                            </ProductScene>
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            {product.image && <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col gap-6 lg:gap-8 px-2">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                {product.category?.name || 'Collection'}
                            </span>
                            <span className="text-gray-400 text-sm font-medium">|</span>
                            <span className="text-gray-500 text-sm font-medium">{product.age_group || '0+'}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-2xl md:text-3xl font-bold text-primary">
                            {formatCurrency(Number(product.price))}
                        </p>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="space-y-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">Certified Safe</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-500 rounded-lg">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">Eco-Friendly</span>
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <span className="block text-sm font-bold text-gray-900 mb-3">Select Color</span>
                            <div className="flex gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor?.name === color.name
                                                ? 'border-primary ring-2 ring-primary/20 scale-110'
                                                : 'border-transparent hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">{selectedColor?.name}</p>
                        </div>

                        <div className="h-px bg-gray-100 my-4" />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`flex-1 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${added
                                        ? 'bg-green-500 text-white'
                                        : 'bg-foreground text-white hover:bg-foreground/90'
                                    }`}
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

            <AnimatePresence>
                {isSizeGuideOpen && <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />}
            </AnimatePresence>
        </div>
    );
}
