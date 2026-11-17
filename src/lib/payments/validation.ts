import { createHmac, timingSafeEqual } from "node:crypto";
export function parseCheckout(value: unknown) {
  const v = value as Record<string, unknown>;
  if (!v || !Array.isArray(v.items) || !v.items.length || v.items.length > 50)
    throw new Error("Invalid cart");
  const fields = [
    "first_name",
    "last_name",
    "email",
    "address",
    "city",
    "postal_code",
  ] as const;
  const customer = Object.fromEntries(
    fields.map((key) => {
      const s = v[key];
      if (typeof s !== "string" || !s.trim() || s.length > 250)
        throw new Error("Complete your shipping details");
      return [key, s.trim()];
    }),
  ) as Record<(typeof fields)[number], string>;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    throw new Error("Invalid email");
  customer.email = customer.email.toLowerCase();
  const quantities = new Map<string, number>();
  const preferences = new Map<string, { color: string; quantity: number }[]>();
  for (const item of v.items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        item.id,
      ) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )
      throw new Error("Invalid cart item");
    item.id = item.id.toLowerCase();
    if (
      item.color !== undefined &&
      (typeof item.color !== "string" || item.color.length > 60)
    )
      throw new Error("Invalid color preference");
    if (item.color)
      preferences.set(item.id, [
        ...(preferences.get(item.id) ?? []),
        { color: item.color.trim(), quantity: item.quantity },
      ]);
    quantities.set(item.id, (quantities.get(item.id) ?? 0) + item.quantity);
    if (quantities.get(item.id)! > 20)
      throw new Error("Quantity limit exceeded");
  }
  return {
    customer,
    items: [...quantities].map(([id, quantity]) => ({
      id,
      quantity,
      preferences: preferences.get(id) ?? [],
    })),
  };
}
export function toMinorUnits(price: unknown) {
  const text = String(price);
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error("Invalid product price");
  const [whole, fraction = ""] = text.split(".");
  const value = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(value) || value < 1)
    throw new Error("Invalid product price");
  return value;
}
export function verifySignature(
  body: Buffer,
  header: string | null,
  secret: string,
  timestamped = false,
  now = Date.now(),
) {
  if (!header || !secret) return false;
  let payload = body;
  let signatures = [header];
  if (timestamped) {
    const parts = header.split(",").map((p) => p.trim());
    const times = parts.filter((p) => p.startsWith("t="));
    if (times.length !== 1 || !/^t=\d+$/.test(times[0])) return false;
    const t = times[0].slice(2);
    if (Math.abs(now / 1000 - Number(t)) > 300) return false;
    payload = Buffer.concat([Buffer.from(t + "."), body]);
    signatures = parts
      .filter((p) => p.startsWith("v1="))
      .map((p) => p.slice(p.indexOf(":") + 1));
  }
  const hash = createHmac("sha512", secret).update(payload).digest();
  return signatures.some(
    (sig) =>
      /^[0-9a-f]{128}$/.test(sig) &&
      timingSafeEqual(hash, Buffer.from(sig, "hex")),
  );
}
