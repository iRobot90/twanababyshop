'use client';

import Hero from "@/components/layout/Hero";
import Link from "next/link";
import { ArrowRight, Star, Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface CategoryItem {
  id: number;
  slug: string;
  name: string;
  image: string;
}

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  price: string;
  image: string;
  description?: string;
  category?: { name?: string; slug?: string };
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        const rankedProducts = [...productsData]
          .sort((a: ProductItem, b: ProductItem) => Number(b.price) - Number(a.price))
          .slice(0, 6);

        setFeaturedProducts(rankedProducts);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Failed to load catalog content", err);
      }
    };
    loadContent();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center w-full overflow-x-hidden">
      <Hero />

      {/* Browse the shop */}
      <section className="w-full bg-primary/20 py-12 px-6 sm:px-12 my-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl bg-white p-8 md:p-12 shadow-sm border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="z-10 max-w-lg">
            <span className="inline-block py-1 px-3 rounded-full bg-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
              Twaana Baby Shop
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Find something for your little one
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Browse baby products and explore the details before you choose.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-3 rounded-full font-semibold hover:bg-foreground/80 transition-colors">
              Browse products <ArrowRight aria-hidden="true" className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square rounded-full bg-primary/30 flex items-center justify-center animate-float">
            <ShoppingBag aria-hidden="true" className="h-16 w-16 text-primary" />
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
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-all">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1591027480007-a42f6ef886c3?q=80&w=2160&auto=format&fit=crop'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-center group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">No categories available yet.</p>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full bg-secondary/10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold font-outfit text-center mb-12">Parent Favorites</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((prod) => (
                <Link href={`/product?slug=${prod.slug}`} key={prod.id} className="group bg-white rounded-3xl p-4 hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-white/50">
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
                    <p className="text-sm text-muted-foreground mb-2">{prod.category?.name || 'Featured item'}</p>
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
