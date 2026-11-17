import { isOrderReference, verifiedPaymentStatus } from "./verification";
import "server-only";
import { createClient } from "@supabase/supabase-js";
export function paymentConfig() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const guestSecret = process.env.CHECKOUT_SIGNING_SECRET;
  if (!guestSecret || guestSecret.length < 32)
    throw new Error("Checkout signing configuration unavailable");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const origin = process.env.APP_ORIGIN;
  if (!secret || !url || !key || !origin)
    throw new Error("Payment configuration unavailable");
  // This development integration is deliberately test-only until live acceptance checks pass.
  if (!secret.startsWith("sk_test_"))
    throw new Error("Only Paystack test mode is enabled");
  const parsed = new URL(origin);
  if (
    parsed.origin !== origin ||
    (parsed.protocol !== "https:" &&
      !(
        process.env.NODE_ENV !== "production" && parsed.hostname === "localhost"
      ))
  )
    throw new Error("Invalid app origin");
  return {
    secret,
    guestSecret,
    origin,
    db: createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}
export async function paystack(path: string, body?: object) {
  const { secret } = paymentConfig();
  const response = await fetch(`https://api.paystack.co${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  const payload = await response.json();
  if (!response.ok || payload.status !== true || !payload.data)
    throw new Error("Payment provider unavailable");
  return payload.data;
}
export async function reconcile(reference: string) {
  if (!isOrderReference(reference))
    throw new Error("Invalid reference");
  const { db } = paymentConfig();
  const { data: order, error } = await db
    .from("orders")
    .select("reference, amount, currency, customer, status")
    .eq("reference", reference)
    .single();
  if (error || !order) throw new Error("Order not found");
  if (order.status === "paid" || order.status === "paid_review")
    return order.status as string;
  const payment = await paystack(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );
  const verifiedStatus = verifiedPaymentStatus(payment, order);
  if (verifiedStatus !== "success") return verifiedStatus;
  const { data, error: settleError } = await db.rpc("settle_paid_order", {
    p_reference: reference,
  });
  if (settleError) throw new Error("Payment settlement unavailable");
  return data as string;
}
