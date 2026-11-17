import Link from "next/link";
export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <p className="mb-4 text-xs uppercase tracking-wider text-primary">
        Development preview
      </p>
      <h1 className="mb-8 text-4xl font-medium">Shopping information</h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <p>
          Live shopping terms are not finalized. This preview is for testing,
          not placing live orders.
        </p>
        <h2 className="text-xl text-foreground">Prices & availability</h2>
        <p>
          Displayed prices use Kenyan shillings. The server checks product
          prices and availability before a test payment. A payment is confirmed
          only after server verification, not simply by opening the confirmation
          page.
        </p>
        <h2 className="text-xl text-foreground">Delivery & returns</h2>
        <p>
          Delivery areas, charges, timing, cancellations, returns and refund
          arrangements must be confirmed by the store before launch. No free
          shipping or cross-border delivery is currently promised.
        </p>
        <Link href="/support#shipping" className="inline-block underline">
          Delivery and support information
        </Link>
      </div>
    </main>
  );
}
