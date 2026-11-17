"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    postal_code: "",
    city: "",
    mpesa_phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...formData,
        expected_amount: Math.round(total() * 100),
        items: items.map(({ id, quantity, color }) => ({
          id,
          quantity,
          color,
        })),
      };
      const fingerprint = JSON.stringify(payload);
      let previous;
      try {
        previous = JSON.parse(
          sessionStorage.getItem("twana-checkout") || "null",
        );
      } catch {
        throw new Error(
          "Your browser cannot restore checkout safely. Enable session storage, or contact support if you have already tried paying.",
        );
      }
      const key =
        previous?.fingerprint === fingerprint
          ? previous.key
          : crypto.randomUUID();
      try {
        sessionStorage.setItem(
          "twana-checkout",
          JSON.stringify({ key, fingerprint }),
        );
      } catch {
        throw new Error(
          "Checkout needs browser session storage to prevent duplicate payment attempts. No payment was started.",
        );
      }
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout unavailable");
      try {
        sessionStorage.setItem(
          "twana-checkout",
          JSON.stringify({ key, fingerprint, reference: data.reference }),
        );
        sessionStorage.setItem(
          "twana-purchase-" + data.reference,
          JSON.stringify(items),
        );
      } catch {
        /* Payment recovery remains available through the HttpOnly order cookie. */
      }
      window.location.assign(data.receipt_url || data.authorization_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout unavailable");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16 pt-32 px-4 sm:px-6 lg:px-8">
      <h1 className="mx-auto max-w-6xl mb-8 text-4xl font-medium">
        Checkout{" "}
        <span className="text-base font-normal text-muted-foreground">
          Test mode
        </span>
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6 font-outfit">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.color || ""}`}
                className="flex gap-4 py-4 border-b last:border-0"
              >
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-primary font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">{formatCurrency(total())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-bold">Not configured (test checkout)</span>
            </div>
            <div className="flex justify-between text-xl font-black mt-4 pt-4 border-t">
              <span>Total</span>
              <span>{formatCurrency(total())}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-6 font-outfit">
              Shipping Details
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="first_name"
                  name="first_name"
                  autoComplete="given-name"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-1">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="last_name"
                  name="last_name"
                  autoComplete="family-name"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="email"
                  name="email"
                  autoComplete="email"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium mb-2"
                >
                  Street Address
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium mb-2"
                >
                  City
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="postal_code"
                  className="block text-sm font-medium mb-2"
                >
                  Postal Code
                </label>
                <input
                  required
                  type="text"
                  className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary focus:outline-none"
                  id="postal_code"
                  name="postal_code"
                  autoComplete="postal-code"
                  maxLength={250}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Secure payment</h2>
            <p>
              You will continue to Paystack to choose an available payment
              method. We never collect your card details or M-Pesa PIN.
            </p>
            <p className="mt-2">
              Your final amount and product availability are checked by our
              server. Stock is confirmed after payment; if unavailable, the
              order needs manual review. This checkout is test-only and does not
              place a live order.
            </p>
          </div>
          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}
          {items.length === 0 && (
            <p>
              Your cart is empty.{" "}
              <a href="/shop" className="underline">
                Continue shopping
              </a>
            </p>
          )}

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Processing...
              </>
            ) : (
              `Pay ${formatCurrency(total())}`
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
