"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store";
export default function OrderSuccessPage() {
  return <Suspense fallback={<p role="status">Checking payment securely…</p>}><ReceiptFromUrl /></Suspense>;
}
function ReceiptFromUrl() {
  const params = useSearchParams();
  const reference = params.get("reference") || "";
  return <Receipt key={reference} reference={reference} />;
}
function Receipt({ reference }: { reference: string }) {
  const [status, setStatus] = useState(reference ? "checking" : "missing");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const clearCart = useCartStore((s) => s.clearCart);
  useEffect(() => {
    const controller = new AbortController();
    const ref = reference;
    if (!ref) return;
    fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference: ref }),
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
      })
      .then((data) => {
        setStatus(data.status);
        if (data.status === "paid" || data.status === "paid_review") {
          try {
            const key = "twana-purchase-" + ref;
            if (
              sessionStorage.getItem(key) ===
              JSON.stringify(useCartStore.getState().items)
            )
              clearCart();
            sessionStorage.removeItem(key);
            const current = JSON.parse(
              sessionStorage.getItem("twana-checkout") || "null",
            );
            if (current?.reference === ref)
              sessionStorage.removeItem("twana-checkout");
          } catch {
            /* Storage restrictions must not turn confirmed payment into an error. */
          }
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setStatus("error");
          setError(err.message || "Verification unavailable");
        }
      });
    return () => controller.abort();
  }, [attempt, clearCart, reference]);
  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-6">
        {status === "paid"
          ? "Payment confirmed"
          : status === "paid_review"
            ? "Payment received, fulfilment under review"
            : "Payment verification"}
      </h1>
      <p role="status">
        {status === "checking"
          ? "Checking payment securely…"
          : status === "paid"
            ? "Your order has been recorded. Keep your reference for support."
            : status === "paid_review"
              ? "One or more items are unavailable. Contact support with your reference to arrange fulfilment or a refund. Do not pay again."
              : status === "missing"
                ? "No payment reference was provided. This page does not confirm a purchase."
                : ["failed", "abandoned", "reversed"].includes(status)
                  ? `The provider reports this payment as ${status}. Contact support with your reference before attempting another payment.`
                  : error ||
                  "Payment has not yet been confirmed. If you paid, retry verification instead of paying again."}
      </p>
      {reference && <p className="my-6 break-all">Reference: {reference}</p>}
      {["pending", "ongoing", "processing", "queued", "error"].includes(status) && (
        <button
          onClick={() => { setStatus("checking"); setError(""); setAttempt((n) => n + 1); }}
          className="p-4 rounded bg-primary text-white"
        >
          Check again
        </button>
      )}
      <div className="flex gap-6 justify-center mt-8">
        <Link href="/support">Contact support</Link>
        <Link href="/shop">Continue shopping</Link>
      </div>
    </main>
  );
}
