'use client';

import Hero from "@/components/layout/Hero";
import Link from "next/link";
import { ArrowRight, Star, Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

// Static categories for now
const CATEGORIES = [
  { id: 'strollers', name: 'Strollers', image: 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop', color: 'bg-blue-100' },
  { id: 'nursery', name: 'Nursery', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2670&auto=format&fit=crop', color: 'bg-pink-100' },
  { id: 'clothing', name: 'Soft Wear', image: 'https://images.unsplash.com/photo-1519238263496-63f82a0ef963?q=80&w=2670&auto=format&fit=crop', color: 'bg-yellow-100' },
  { id: 'toys', name: 'Play Time', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2670&auto=format&fit=crop', color: 'bg-green-100' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        // Take first 3 products as featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    loadProducts();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full overflow-x-hidden">
      <Hero />

      {/* Seasonal Promo Banner */}
      <section className="w-full bg-primary/20 py-12 px-6 sm:px-12 my-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-white p-8 md:p-12 shadow-sm border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="z-10 max-w-lg">
            <span className="inline-block py-1 px-3 rounded-full bg-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
              Winter Season Sale
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Cozy Snuggles Up To <span className="text-primary">40% Off</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Keep your little ones warm with our premium organic cotton layers. Limited time seasonal offers.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-3 rounded-full font-semibold hover:bg-foreground/80 transition-colors">
              Shop Winter Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square rounded-full bg-primary/30 flex items-center justify-center animate-float">
            <span className="text-6xl">❄️</span>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold font-outfit">Shop by Category</h2>
          <Link href="/categories" className="text-primary font-semibold hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.id}`} className="group cursor-pointer">
              <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all`}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-center group-hover:text-primary transition-colors">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full bg-secondary/10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold font-outfit text-center mb-12">Parent Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((prod) => (
                <Link href="/product" key={prod.id} className="group bg-white rounded-3xl p-4 hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-white/50">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                    {prod.image && <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />}
                    <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white text-gray-400 hover:text-red-400 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="px-2">
                    <div className="flex gap-1 text-accent mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold mb-1 line-clamp-1">{prod.name}</h3>
                    <p className="text-lg text-muted-foreground">{formatCurrency(Number(prod.price))}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-3 text-center text-muted-foreground">Loading favorites...</p>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
