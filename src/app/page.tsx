"use client";
import Hero from "@/components/layout/Hero";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock_quantity: number;
  category: { name: string; slug: string };
};
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt]);
  const categories = Array.from(
    new Map(
      products.map((p) => [p.category.slug, { ...p.category, image: p.image }]),
    ).values(),
  );
  return (
    <main>
      <Hero
        image={products.find((p) => p.image)?.image}
        name={products.find((p) => p.image)?.name}
      />
      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[.2em] text-muted-foreground">
              The collection
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
              Their next little favourite.
            </h2>
          </div>
          <Link
            className="border-b border-foreground pb-1 text-sm"
            href="/shop"
          >
            Explore everything ↗
          </Link>
        </div>
        {loading ? (
          <p role="status" className="py-12 text-muted-foreground">
            Getting the little things ready…
          </p>
        ) : error ? (
          <div role="alert" className="border-y border-foreground/15 py-10">
            <h3 className="text-xl">A little hiccup, not an empty shop.</h3>
            <p className="mt-2 text-muted-foreground">
              We could not load the collection. Please try again.
            </p>
            <button
              onClick={() => { setLoading(true); setError(false); setAttempt((n) => n + 1); }}
              className="mt-5 rounded-full bg-foreground px-6 py-3 text-white"
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <p className="py-12 text-muted-foreground">
            Our next little finds are on their way. There are no products to
            browse just yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 md:gap-x-6">
            {products.slice(0, 8).map((p) => (
              <Link
                key={p.id}
                href={"/product?slug=" + encodeURIComponent(p.slug)}
                className="group"
              >
                <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[#F2EEE9]">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1023px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center p-4 text-sm text-muted-foreground">
                      Photo coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {p.category.name}
                </p>
                <h3 className="mt-1 text-base font-medium">{p.name}</h3>
                <p className="mt-2 text-sm">{formatCurrency(p.price)}</p>
                {p.stock_quantity < 1 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Currently out of stock
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
      {categories.length > 0 && (
        <section className="border-y border-foreground/10 bg-[#EEEFE5] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-7 text-2xl font-medium">
              A place for every little thing.
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={"/shop?category=" + encodeURIComponent(c.slug)}
                  className="rounded-full border border-foreground/20 px-6 py-3 text-sm hover:bg-white"
                >
                  {c.name} ↗
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
        <h2 className="font-serif text-4xl italic leading-tight md:text-5xl">
          Big feelings.
          <br />
          Little everyday rituals.
        </h2>
        <div>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            A fresh outfit. A favourite toy. The bag packed for a day out.
            Twaana is here for the small things that make up family life.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block border-b border-foreground pb-1 text-sm"
          >
            A little about us ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
