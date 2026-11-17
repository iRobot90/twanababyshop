import { createHash, timingSafeEqual } from "node:crypto";
export type RecoverableOrder = {
  checkout_hash: string;
  token_hash: string;
  status: string;
  authorization_url: string | null;
};
/** Existing orders never create a new reference or repeat an ambiguous initialization. */
export function recoveryAction(
  order: RecoverableOrder,
  fingerprint: string,
  token: string,
): "denied" | "receipt" | "reuse-link" {
  const expected = createHash("sha256").update(token).digest();
  if (!/^[0-9a-f]{64}$/.test(order.token_hash)) return "denied";
  const saved = Buffer.from(order.token_hash, "hex");
  if (order.checkout_hash !== fingerprint || !timingSafeEqual(saved, expected))
    return "denied";
  if (order.status === "paid" || order.status === "paid_review")
    return "receipt";
  if (order.status !== "pending") return "denied";
  return order.authorization_url ? "reuse-link" : "receipt";
}
