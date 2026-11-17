import Link from "next/link";
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <p className="mb-4 text-xs uppercase tracking-wider text-primary">
        Development preview
      </p>
      <h1 className="mb-8 text-4xl font-medium">Privacy information</h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <p>
          The store’s final privacy notice is not yet published. Do not enter
          real personal or payment information into this test checkout.
        </p>
        <h2 className="text-xl text-foreground">How this preview works</h2>
        <p>
          The cart is stored in your browser when local storage is available.
          Checkout sends the details entered and the basket to the store server.
          The payment integration redirects to Paystack; this website does not
          collect card details or M-Pesa PINs.
        </p>
        <h2 className="text-xl text-foreground">Before live orders open</h2>
        <p>
          The store must confirm its legal identity, privacy contact, data
          retention periods, service providers and how customers can exercise
          their privacy rights. These details need review before live use.
        </p>
        <Link href="/support" className="inline-block underline">
          Store support information
        </Link>
      </div>
    </main>
  );
}
