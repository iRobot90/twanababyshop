'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchCategories } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen pt-24 pb-12 px-6 bg-gray-50">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-outfit">Twana Collections</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore our thoughtfully curated categories for every step of your parenting journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.slug}`}
                            className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <Image
                                src={category.image || 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                <h2 className="text-3xl font-bold text-white mb-2">{category.name}</h2>
                                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                                    <span className="font-medium">Explore Collection</span>
                                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
