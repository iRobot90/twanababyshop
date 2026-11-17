import { isDurablySettled } from "@/lib/payments/verification";
import { readBody } from '@/lib/payments/body';
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/payments/validation';
import { paymentConfig, reconcile } from '@/lib/payments/server';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const { secret } = paymentConfig();
    const body = await readBody(request, 1000000);
    if (body.length > 1000000) return new NextResponse(null, { status: 413 });
    const signingSecret = process.env.PAYSTACK_WEBHOOK_SECRET;
    const valid = signingSecret
      ? verifySignature(body, request.headers.get('paystack-signature'), signingSecret, true)
      : verifySignature(body, request.headers.get('x-paystack-signature'), secret);
    if (!valid) return new NextResponse(null, { status: 401 });
    const event = JSON.parse(body.toString('utf8'));
    if (event.event === 'charge.success') {
      const status = await reconcile(event.data?.reference);
      if (!isDurablySettled(status)) return new NextResponse(null, { status: 503 });
    }
    // Acknowledge only after durable settlement, so provider retries transient failures.
    return NextResponse.json({ received: true });
  } catch { return new NextResponse(null, { status: 503 }); }
}
