"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchProducts, fetchProduct } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  description: string;
  stock_quantity: number;
  category: { name: string; slug: string };
};
export default function ProductContainer() {
  const slug = useSearchParams().get("slug");
  return <ProductDetails key={slug || "missing"} slug={slug} />;
}
function ProductDetails({ slug }: { slug: string | null }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [message, setMessage] = useState("");
  const add = useCartStore((s) => s.addToCart);
  const open = useCartStore((s) => s.openCart);
  useEffect(() => {
    let active = true;
    Promise.all([
      slug ? fetchProduct(slug) : Promise.resolve(null),
      fetchProducts().catch(() => []),
    ])
      .then(([found, all]: [Product | null, Product[]]) => {
        if (!active) return;
        setProduct(found);
        setRelated(
          found
            ? all
                .filter(
                  (p) =>
                    p.id !== found.id &&
                    p.category.slug === found.category.slug,
                )
                .slice(0, 3)
            : [],
        );
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
  }, [slug, attempt]);
  if (loading)
    return (
      <main className="mx-auto max-w-7xl px-6 py-32" aria-busy="true">
        <p role="status">Finding your little favourite…</p>
        <div className="mt-6 h-80 animate-pulse rounded-3xl bg-gray-100" />
      </main>
    );
  if (error)
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">A small hiccup.</h1>
        <p className="my-4">
          We couldn’t load this product. Your cart is safe.
        </p>
        <button
          className="rounded-full bg-primary px-6 py-3 text-white"
          onClick={() => { setLoading(true); setError(false); setMessage(""); setAttempt((a) => a + 1); }}
        >
          Try again
        </button>
      </main>
    );
  if (!product)
    return (
      <main className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">This little find isn’t here.</h1>
        <p className="my-4">It may have moved or is no longer available.</p>
        <Link href="/shop" className="text-primary underline">
          Back to the shop
        </Link>
      </main>
    );
  const stock = Math.max(0, product.stock_quantity);
  return (
    <main className="mx-auto max-w-7xl px-6 pb-20 pt-28">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm">
        <Link href="/shop" className="underline">
          Shop
        </Link>
        <span> / </span>
        <Link
          href={"/shop?category=" + encodeURIComponent(product.category.slug)}
          className="underline"
        >
          {product.category.name}
        </Link>
      </nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#F1EDE7]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width:768px) 100vw,50vw"
              className="object-contain p-6"
            />
          ) : (
            <p className="grid h-full place-items-center text-muted-foreground">
              Product photograph coming soon
            </p>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            {product.category.name}
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            {product.name}
          </h1>
          <p className="my-5 text-3xl font-bold">
            {formatCurrency(product.price)}
          </p>
          <p className={stock ? "text-green-800" : "text-red-800"}>
            {stock ? stock + " available" : "Currently out of stock"}
          </p>
          <p className="my-6 whitespace-pre-line leading-relaxed text-muted-foreground">
            {product.description ||
              "More product details are being prepared. Check the specifications before purchasing."}
          </p>
          <button
            disabled={!stock}
            onClick={() => {
              const ok = add({
                ...product,
                quantity: 1,
                price: Number(product.price),
              });
              setMessage(
                ok
                  ? "Added to your basket."
                  : "You’ve reached the available quantity for this item.",
              );
            }}
            className="rounded-full bg-primary p-4 text-lg font-bold text-white"
          >
            {stock ? "Add to your basket" : "Out of stock"}
          </button>
          <p role="status" className="mt-3 min-h-6">
            {message}
          </p>
          {message.startsWith("Added") && (
            <button onClick={open} className="text-left text-primary underline">
              View basket
            </button>
          )}
          <details className="mt-6 border-t py-4">
            <summary className="cursor-pointer font-bold">
              Before you choose
            </summary>
            <p className="mt-3 text-sm leading-relaxed">
              Check the product description for dimensions, materials, care and
              age guidance. Do not assume an age rating or safety certification
              where none is listed.
            </p>
          </details>
          <Link href="/support" className="text-sm text-primary underline">
            Questions about this item?
          </Link>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-bold">More little finds</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={"/product?slug=" + encodeURIComponent(p.slug)}
                className="rounded-2xl border bg-white p-5"
              >
                <h3 className="font-bold">{p.name}</h3>
                <p className="mt-3">{formatCurrency(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
