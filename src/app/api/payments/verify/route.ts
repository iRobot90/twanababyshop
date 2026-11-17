import { isOrderReference } from "@/lib/payments/verification";
import {consumeLimit} from '@/lib/payments/limits';
import { readBody } from '@/lib/payments/body';
import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { paymentConfig, reconcile } from '@/lib/payments/server';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const { db, origin } = paymentConfig();
    if (request.headers.get('origin') !== origin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const { reference } = JSON.parse((await readBody(request, 1024)).toString('utf8'));
    if (!isOrderReference(reference)) return NextResponse.json({ error: 'Invalid reference' }, { status: 400 });
    const token = request.cookies.get(`order_${reference}`)?.value;
    // Reject absent or malformed credentials before any database or rate-limit RPC.
    if (!token || !/^[0-9a-f]{64}$/.test(token)) return NextResponse.json({ error: 'Order access unavailable. Use the browser you paid with or contact support.' }, { status: 403 });
    const { data } = await db.from('orders').select('token_hash').eq('reference', reference).single();
    if (!data || !/^[0-9a-f]{64}$/.test(data.token_hash) || !timingSafeEqual(Buffer.from(data.token_hash, 'hex'), createHash('sha256').update(token).digest())) return NextResponse.json({ error: 'Order access unavailable. Use the browser you paid with or contact support.' }, { status: 403 });
    if (!await consumeLimit('verify',reference,10)) return NextResponse.json({error:'Please wait a minute before checking again.'},{status:429});
    return NextResponse.json({ reference, status: await reconcile(reference) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Unable to confirm payment yet. Do not pay again; retry verification or contact support.' }, { status: 503 }); }
}
