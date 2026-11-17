import "server-only";
import { createHmac } from "node:crypto";
import { paymentConfig } from "./server";
export async function consumeLimit(
  scope: string,
  identity: string,
  max: number,
) {
  const { db, guestSecret } = paymentConfig();
  const bucket =
    scope +
    ":" +
    createHmac("sha256", guestSecret).update(identity).digest("hex");
  const { data, error } = await db.rpc("consume_payment_limit", {
    p_bucket: bucket,
    p_max: max,
  });
  if (error) throw new Error("Request limiting unavailable");
  return data === true;
}
