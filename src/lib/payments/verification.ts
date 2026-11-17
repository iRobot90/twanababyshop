/** Provider verification is never trusted without matching the stored order. */
export function verifiedPaymentStatus(payment: unknown, order: {
  reference: string; amount: number; currency: string; customer: { email: string };
}): string {
  if (!payment || typeof payment !== "object") throw new Error("Invalid provider response");
  const p = payment as Record<string, unknown>;
  const customer = p.customer as {email?: unknown} | undefined;
  if (p.domain !== "test") throw new Error("Only verified test transactions are accepted");
  if (p.reference !== order.reference || p.amount !== order.amount ||
      p.currency !== order.currency || typeof customer?.email !== "string" ||
      customer.email.toLowerCase() !== order.customer.email.toLowerCase())
    throw new Error("Payment details mismatch");
  if (typeof p.status !== "string" || ![
    "success", "abandoned", "failed", "ongoing", "pending", "processing", "queued", "reversed",
  ].includes(p.status)) throw new Error("Unknown payment status");
  return p.status;
}
export function isOrderReference(value: unknown): value is string {
  // Preserve access to existing underscore references; only generate hyphens for new ones.
  return typeof value === "string" && /^twa[-_][0-9a-f]{32}$/.test(value);
}
export function isDurablySettled(status: string) {
  return status === "paid" || status === "paid_review";
}
