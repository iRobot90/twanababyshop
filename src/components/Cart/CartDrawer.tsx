"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
export default function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { items, total, setQuantity, removeFromCart } = useCartStore();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    const old = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [isOpen]);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="cart-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-y-0 left-auto right-0 m-0 h-[100svh] max-h-none w-full max-w-md bg-white p-0 shadow-xl"
    >
      <div
        className="flex h-full flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b p-6">
          <h2 id="cart-title" className="text-2xl font-bold">
            Your little finds
          </h2>
          <button onClick={onClose} className="p-3" aria-label="Close cart">
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-2xl font-bold">
                A little room for something lovely.
              </p>
              <p className="my-4 text-muted-foreground">
                Your basket is waiting for its first find.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-primary underline"
              >
                Explore essentials
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id + "-" + item.color}
                className="flex gap-4 border-b py-5"
              >
                <div className="relative h-20 w-20 shrink-0 rounded-xl bg-gray-100">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="rounded-xl object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  {item.color && (
                    <p className="text-sm">Preference: {item.color}</p>
                  )}
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      className="h-10 w-10 rounded-full border disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={"Decrease " + item.name}
                      onClick={() =>
                        setQuantity(item.id, item.color, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      className="h-10 w-10 rounded-full border disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={"Increase " + item.name}
                      disabled={
                        items
                          .filter((i) => i.id === item.id)
                          .reduce((n, i) => n + i.quantity, 0) >=
                        Math.min(20, item.stock_quantity ?? 0)
                      }
                      title="Quantity is limited by stock and a maximum of 20 per product"
                      onClick={() =>
                        setQuantity(item.id, item.color, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="ml-auto text-sm underline"
                      onClick={() => removeFromCart(item.id, item.color)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
        {items.length > 0 && (
          <footer className="border-t bg-background p-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Subtotal</span>
              <span>{formatCurrency(total())}</span>
            </div>
            <p className="my-3 text-sm text-muted-foreground">
              Confirm availability and delivery arrangements before payment.
            </p>
            <Link
              onClick={onClose}
              href="/checkout"
              className="block rounded-full bg-primary p-4 text-center font-bold text-white"
            >
              Continue to checkout
            </Link>
          </footer>
        )}
      </div>
    </dialog>
  );
}
