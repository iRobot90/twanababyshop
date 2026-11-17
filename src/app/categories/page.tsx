"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/lib/api";
type Category = { id: string; name: string; slug: string; image: string };
export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data);
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
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-32">
      <p className="mb-4 text-xs uppercase tracking-[.2em] text-primary">
        Find their everyday
      </p>
      <h1 className="text-4xl font-medium tracking-tight md:text-6xl">
        A little of everything.
      </h1>
      <p className="mb-12 mt-5 max-w-xl text-muted-foreground">
        Explore the collection, one little world at a time.
      </p>
      {loading ? (
        <p role="status">Getting the collections ready…</p>
      ) : error ? (
        <div role="alert">
          <p>We could not load the collections. Please try again.</p>
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="mt-5 rounded-full bg-foreground px-6 py-3 text-white"
          >
            Try again
          </button>
        </div>
      ) : categories.length === 0 ? (
        <p>
          No collections are available just yet.{" "}
          <Link href="/shop" className="underline">
            Visit the shop
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={"/shop?category=" + encodeURIComponent(c.slug)}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#EEEFE5]">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width:767px) 50vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-[1.03]"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center p-4 text-center font-serif text-3xl italic">
                    {c.name}
                  </span>
                )}
              </div>
              <h2 className="mt-4 text-xl">
                {c.name} <span aria-hidden="true">↗</span>
              </h2>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
