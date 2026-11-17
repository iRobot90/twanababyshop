# Paystack checkout development checkpoint

This branch is not approved for live payments. The server deliberately accepts only Paystack test secret keys. No deployment or production database migration was performed. Reviewed migrations were applied only to the isolated twaana-sandbox project.

## Local setup
Set server-only PAYSTACK_SECRET_KEY (test), SUPABASE_SERVICE_ROLE_KEY, a separate random CHECKOUT_SIGNING_SECRET (at least 32 characters; retain while guest orders remain accessible), and APP_ORIGIN (canonical origin, no trailing slash), plus the existing NEXT_PUBLIC_SUPABASE_URL and public Supabase key. Never prefix a secret with NEXT_PUBLIC or commit .env files. Use an isolated Supabase test project.
Apply the products migration, then supabase/migrations/20261115000000_orders.sql and 20261115000001_product_privileges.sql. Do not apply to a production database without a backup and reviewed migration plan. Configure the Paystack webhook to /api/payments/webhook. For timestamped webhook signatures set PAYSTACK_WEBHOOK_SECRET; otherwise legacy signatures use the API secret.

## Verification
- npm ci; npm run build
- node --experimental-strip-types --test tests/payment-validation.test.mts (Node 22.18+)
- npx tsc --noEmit
- In test mode verify successful, declined, canceled, delayed and duplicate callbacks; replay/tamper rejection; simultaneous purchases; stock conflicts; retries; incorrect amount/currency/customer. Confirm stock decrements exactly once in the database.

## Boundaries and remaining live blockers
- Database request caps now exist. Configure trusted edge/client rate limits as well; global quota is a circuit breaker. Recovery for interrupted provider initialization still needs sandbox acceptance.
- An authenticated read-only order/paid_review queue is available at /admin/orders. Operational fulfilment/refund actions still need a confirmed business workflow. A paid_review order does not automatically fulfil or refund.
- Colors are recorded as customer preferences, not independently stocked variants. Product stock is aggregated across preferences.
- Isolated sandbox SQL tests passed: anon/user order isolation, spoofed admin metadata denial, real admin writes, sequential duplicate settlement, stock shortage, malformed items, rate limits and anonymous upload denial. Fixtures rolled back; zero products/orders/rate-limit entries remain. Concurrent sessions and real Paystack end-to-end tests are NOT yet verified.
- Admin uploads now have origin checks, bounded multipart bodies, decoded raster validation and metadata-stripping WebP re-encoding. Validate this on the deployment runtime.
- Seven moderate ESLint dependency audit findings remain after patching critical/high dependencies; rerun audit before release.
- No confirmation emails are sent. The UI no longer fabricates email confirmation or order numbers.

Recovery: existing paid orders restore the receipt before current stock/price checks. An existing order without a saved authorization URL is never reinitialized automatically; the same reference is verified instead. Pre-provider crashes may require manual reconciliation. Never replace the reference or ask the customer to pay again until provider status is confirmed. Test shipping is not configured; merchant delivery pricing and policies remain release gates.

## Ambiguous initialization support procedure (production gate)
Never erase the order, generate a replacement reference, or ask for another payment based only on a timeout or provider not-found response. Keep the original receipt/reference. An authorized operator must reconcile the exact reference and customer/amount/currency in the Paystack dashboard and verification API; resolve received payments through the idempotent settlement path. Any retry/replacement requires provider-confirmed terminal non-payment and tested cancellation/failure semantics. That operator workflow is not implemented yet; do not launch live payments before it exists and is tested.

Verification rejects missing/malformed receipt cookies before order queries and validates stored token hashes before comparison. Authenticated per-order throttling remains. Configure trusted ingress rate limiting before production; client-provided forwarded IPs are not trusted and an attacker-exhaustible global quota is not a substitute.

## 17 November payment verification fixes (local, test-only)
New references use provider-compatible `twa-` prefixes. Apply `20261117000000_order_reference_format.sql` to the isolated sandbox before testing; it preserves existing underscore references without rewriting orders. No database migration was applied by this code change.
Provider verification must match the order and report `domain: test`; live/missing domains fail closed. Non-success statuses stay distinct. A success webhook returns 503 unless reconciliation durably settles to paid/paid_review, allowing provider retries rather than silently acknowledging an unsettled event. These unit checks do not replace real Paystack sandbox, concurrent database, or operational reconciliation acceptance tests.

The paid/paid_review reconciliation fast path trusts previously recorded durable settlement in the isolated test database. It is not a refund, chargeback or current-provider-status reconciler. Never mix live orders into this test database; operational reversal/refund handling is a separate release requirement.

Full repository lint currently fails (57 errors, 1708 warnings, including bundled legacy frontend artifacts and existing source violations). Focused payment lint, all 20 local tests, TypeScript and production build pass. This checkpoint is a development backup, not a production-ready release.

Active Next app/product/cart/API lint errors were corrected in the follow-up; only generated frontend/dist bundles are excluded. Full source lint still reports 29 errors and 91 warnings in remaining legacy components/config. They are not suppressed. Current production build and 20 local tests pass; synthetic local browser acceptance passes; real sandbox integration remains unverified.

Browser smoke: run the local production server on 127.0.0.1:3187, then `node tests/storefront-browser-smoke.mjs` with Playwright installed (or PLAYWRIGHT_MODULE pointing to an installed module). Covers synthetic 503 recovery, related-product navigation and Back, missing receipt and pending-to-paid verification. It does not contact Paystack or Supabase.

## Verified isolated sandbox checks, 17 November 2026
The reference-format migration was applied separately to the existing isolated `twaana-sandbox` only. Hyphen references, legacy reference compatibility, malformed-reference rejection, sequential duplicate settlement and rollback cleanup passed.

A true simultaneous-session duplicate-settlement test also passed: two different PostgreSQL backends overlapped, with the second waiting 29.63 seconds on the first transaction before returning `paid`. A uniquely tagged synthetic product started with stock 3 and a quantity-2 order; final stock was 1, not decremented twice. Guarded cleanup removed only the created synthetic order/product. Verified final baseline: 41 products, 0 orders, 0 request-limit entries, 0 test products, and 0 open test transactions. No Paystack request or real customer data was used.

This proves the tested same-order concurrent retry case only. Competing distinct orders, multi-product deadlock contention, provider callbacks, refunds, actual Paystack sandbox checkout and operational recovery still need their own acceptance checks. No production configuration or payments were enabled.
