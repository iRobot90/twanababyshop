import Link from "next/link";
export default function SupportPage() {
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <h1 className="text-5xl font-black">A little help, right here.</h1>
      <p className="my-6 max-w-2xl text-lg text-muted-foreground">
        Questions about an item, your basket or a payment? Start with the
        essentials below.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <section id="contact" className="scroll-mt-28 rounded-3xl bg-white p-8">
          <h2 className="text-2xl font-bold">Talk to Twaana</h2>
          {email ? (
            <a
              href={"mailto:" + email}
              className="mt-5 inline-block text-primary underline"
            >
              {email}
            </a>
          ) : (
            <p className="mt-5">
              Store contact details are being confirmed. Please do not place a
              live order until customer support and delivery arrangements are
              available.
            </p>
          )}
          <p className="mt-5 text-sm text-muted-foreground">
            For payment questions, keep your order reference. Never send your
            card details, PIN or one-time code.
          </p>
        </section>
        <section id="faq" className="scroll-mt-28 rounded-3xl bg-white p-8">
          <h2 className="text-2xl font-bold">Good to know</h2>
          <details className="mt-5 border-b py-3">
            <summary className="cursor-pointer font-bold">
              Which currency will I see?
            </summary>
            <p className="mt-3">
              Prices are displayed in Kenyan shillings (KES), including cents
              where applicable.
            </p>
          </details>
          <details className="border-b py-3">
            <summary className="cursor-pointer font-bold">
              Payment still pending?
            </summary>
            <p className="mt-3">
              Use “Check again” on your payment page. Do not pay a second time
              if you have already been charged.
            </p>
          </details>
          <details className="py-3">
            <summary className="cursor-pointer font-bold">
              How do I choose the right size?
            </summary>
            <p className="mt-3">
              Use the product’s own measurements and manufacturer guidance.{" "}
              <Link href="/size-guide" className="text-primary underline">
                Read our sizing tips
              </Link>
              .
            </p>
          </details>
        </section>
        <section
          id="shipping"
          className="scroll-mt-28 rounded-3xl border p-8 md:col-span-2"
        >
          <h2 className="text-2xl font-bold">Delivery & returns</h2>
          <p className="mt-4">
            Delivery locations, charges, pickup options and returns terms must
            be confirmed by the store before live checkout opens. We do not
            currently promise a delivery time or cross-border service.
          </p>
        </section>
      </div>
    </main>
  );
}
