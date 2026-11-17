import { recoveryAction } from "@/lib/payments/recovery";
import { consumeLimit } from "@/lib/payments/limits";
import { readBody } from "@/lib/payments/body";
import { randomBytes, createHash, createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { parseCheckout, toMinorUnits } from "@/lib/payments/validation";
import { paymentConfig, paystack, reconcile } from "@/lib/payments/server";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const { db, origin, guestSecret } = paymentConfig();
    if (request.headers.get("origin") !== origin)
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    const raw = (await readBody(request, 16000)).toString("utf8");
    if (raw.length > 16000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const checkoutKey = request.headers.get("idempotency-key");
    if (
      !checkoutKey ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        checkoutKey,
      )
    )
      return NextResponse.json(
        { error: "Invalid checkout key" },
        { status: 400 },
      );
    const checkoutHash = createHash("sha256").update(raw).digest("hex");
    const token = createHmac("sha256", guestSecret)
      .update(checkoutKey)
      .digest("hex");
    let input;
    try {
      input = parseCheckout(JSON.parse(raw));
    } catch {
      return NextResponse.json(
        { error: "Check your cart and shipping details" },
        { status: 400 },
      );
    }
    if (
      !(await consumeLimit("checkout-customer", input.customer.email, 5)) ||
      !(await consumeLimit("checkout-global", "global", 100))
    )
      return NextResponse.json(
        { error: "Too many attempts. Please wait a minute and try again." },
        { status: 429 },
      );
    const reply = (
      reference: string,
      destination: { authorization_url?: string; receipt_url?: string },
    ) => {
      const response = NextResponse.json(
        { reference, ...destination },
        { headers: { "Cache-Control": "no-store" } },
      );
      response.cookies.set("order_" + reference, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 86400 * 7,
      });
      return response;
    };
    const recover = async (order: {
      reference: string;
      checkout_hash: string;
      token_hash: string;
      status: string;
      authorization_url: string | null;
    }) => {
      const action = recoveryAction(order, checkoutHash, token);
      if (action === "denied")
        return NextResponse.json(
          {
            error:
              "Order access cannot be restored. Contact support; do not pay again.",
          },
          { status: 409 },
        );
      if (action === "receipt") {
        // Ambiguous initialization is never repeated. Verification uses this same reference.
        if (order.status === "pending") {
          try {
            await reconcile(order.reference);
          } catch {
            /* remains unconfirmed */
          }
        }
        return reply(order.reference, {
          receipt_url: "/checkout/success?reference=" + order.reference,
        });
      }
      return null;
    };
    const { data: known, error: lookupError } = await db
      .from("orders")
      .select("reference,checkout_hash,token_hash,status,authorization_url")
      .eq("checkout_key", checkoutKey)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (known) {
      const recovered = await recover(known);
      if (recovered) return recovered;
    }
    const { data: products, error } = await db
      .from("products")
      .select("id,title,price,stock_quantity,is_active")
      .in(
        "id",
        input.items.map((i) => i.id),
      );
    if (error) throw error;
    const lines = input.items.map((item) => {
      const product = products?.find((p) => p.id === item.id);
      if (!product?.is_active || product.stock_quantity < item.quantity)
        throw new Error("Product unavailable");
      return {
        ...item,
        title: product.title,
        unit_amount: toMinorUnits(product.price),
      };
    });
    const amount = lines.reduce(
      (sum, i) => sum + i.unit_amount * i.quantity,
      0,
    );
    if (!Number.isSafeInteger(amount) || amount > 100000000)
      return NextResponse.json(
        { error: "Order total exceeds limit" },
        { status: 400 },
      );
    if (JSON.parse(raw).expected_amount !== amount)
      return NextResponse.json(
        { error: "Prices changed. Refresh your cart before paying." },
        { status: 409 },
      );
    let reference = `twa-${randomBytes(16).toString("hex")}`;

    const { error: insertError } = await db.from("orders").insert({
      reference,
      checkout_key: checkoutKey,
      checkout_hash: checkoutHash,
      customer: input.customer,
      items: lines,
      amount,
      currency: "KES",
      token_hash: createHash("sha256").update(token).digest("hex"),
    });
    let existingUrl: string | null = null;
    if (insertError) {
      if (insertError.code !== "23505") throw insertError;
      const { data: existing } = await db
        .from("orders")
        .select(
          "reference,checkout_hash,token_hash,authorization_url,status,amount,currency",
        )
        .eq("checkout_key", checkoutKey)
        .single();
      if (!existing || existing.checkout_hash !== checkoutHash)
        return NextResponse.json(
          { error: "Checkout changed; reload and try again." },
          { status: 409 },
        );
      const recovered = await recover(existing);
      if (recovered) return recovered;
      if (existing.amount !== amount || existing.currency !== "KES")
        return NextResponse.json(
          {
            error:
              "Order prices changed. Start a new checkout; do not reuse an old payment link.",
          },
          { status: 409 },
        );
      if (existing.status !== "pending")
        return NextResponse.json(
          { error: "This order is already paid. Do not pay again." },
          { status: 409 },
        );
      reference = existing.reference;
      existingUrl = existing.authorization_url;
    }
    try {
      const payment = existingUrl
        ? { authorization_url: existingUrl }
        : await paystack("/transaction/initialize", {
            email: input.customer.email,
            amount,
            currency: "KES",
            reference,
            callback_url: origin + "/checkout/success?reference=" + reference,
          });
      const target = new URL(payment.authorization_url);
      if (
        target.protocol !== "https:" ||
        target.hostname !== "checkout.paystack.com"
      )
        throw new Error("Invalid payment URL");
      if (!existingUrl) {
        const { error: saveError } = await db
          .from("orders")
          .update({ authorization_url: target.href })
          .eq("reference", reference);
        if (saveError) throw saveError;
      }
      return reply(reference, { authorization_url: target.href });
    } catch {
      // The order is persisted; do not create another charge after an uncertain provider response.
      return reply(reference, {
        receipt_url: "/checkout/success?reference=" + reference,
      });
    }
  } catch {
    return NextResponse.json(
      {
        error:
          "Checkout unavailable. Refresh your cart and try again. If charged, do not pay again; contact support.",
      },
      { status: 503 },
    );
  }
}
