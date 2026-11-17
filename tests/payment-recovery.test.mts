import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { recoveryAction } from "../src/lib/payments/recovery.ts";
const order = {
  checkout_hash: "fingerprint",
  token_hash: createHash("sha256").update("test-token").digest("hex"),
  status: "pending",
  authorization_url: null as string | null,
};
test("ambiguous pending initialization returns receipt, never a new payment", () =>
  assert.equal(recoveryAction(order, "fingerprint", "test-token"), "receipt"));
test("paid order recovery ignores URL availability", () => {
  for (const status of ["paid", "paid_review"])
    assert.equal(
      recoveryAction({ ...order, status }, "fingerprint", "test-token"),
      "receipt",
    );
});
test("saved pending link can be reused after caller validates current total", () =>
  assert.equal(
    recoveryAction(
      { ...order, authorization_url: "https://checkout.paystack.com/example" },
      "fingerprint",
      "test-token",
    ),
    "reuse-link",
  ));
test("fingerprint, changed signing key and malformed hashes deny access", () => {
  assert.equal(recoveryAction(order, "changed", "test-token"), "denied");
  assert.equal(recoveryAction(order, "fingerprint", "other-token"), "denied");
  for (const token_hash of ["", "a", "0".repeat(64), "z".repeat(64)])
    assert.equal(
      recoveryAction({ ...order, token_hash }, "fingerprint", "test-token"),
      "denied",
    );
});
test("unknown order status fails closed", () =>
  assert.equal(
    recoveryAction(
      { ...order, status: "unknown" },
      "fingerprint",
      "test-token",
    ),
    "denied",
  ));
