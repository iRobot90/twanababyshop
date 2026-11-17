import { requireAdmin } from "@/lib/admin/auth";
import { paymentConfig } from "@/lib/payments/server";
import { formatCurrency } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function Orders() {
  const { error } = await requireAdmin();
  if (error) return <p>Administrator access required.</p>;
  try {
    const { db } = paymentConfig();
    const { data, error: queryError } = await db
      .from("orders")
      .select("reference,amount,currency,status,created_at,customer,items")
      .order("created_at", { ascending: false })
      .limit(100);
    if (queryError) throw queryError;
    return (
      <>
        <h1 className="text-3xl font-black">Order review</h1>
        <p className="my-4 text-muted-foreground">
          Test environment. Verify payment before fulfilment. Paid-review orders
          require stock investigation and an explicit fulfilment or refund
          decision outside this queue; this page does not issue refunds.
        </p>
        <div className="space-y-4">
          {!data?.length ? (
            <p>No orders yet.</p>
          ) : (
            data.map((order) => (
              <article
                key={order.reference}
                className="rounded-2xl border bg-white p-5"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <h2 className="break-all font-mono text-sm">
                    {order.reference}
                  </h2>
                  <strong>{order.status}</strong>
                </div>
                <p className="mt-3">
                  {formatCurrency(order.amount / 100)} ·{" "}
                  {new Date(order.created_at).toLocaleString("en-KE", {
                    timeZone: "Africa/Nairobi",
                  })}
                </p>
                <p>
                  {order.customer.first_name} {order.customer.last_name} ·{" "}
                  {order.customer.email}
                </p>
                <details className="mt-3">
                  <summary className="cursor-pointer font-bold">
                    Order details
                  </summary>
                  <p className="my-3">
                    {order.customer.address}, {order.customer.city},{" "}
                    {order.customer.postal_code}
                  </p>
                  <ul>
                    {order.items.map(
                      (line: {
                        id: string;
                        title: string;
                        quantity: number;
                        preferences?: { color: string; quantity: number }[];
                      }) => (
                        <li key={line.id}>
                          {line.quantity} × {line.title}
                          {line.preferences?.map((p) => (
                            <span key={p.color}>
                              {" "}
                              · {p.quantity} preference: {p.color}
                            </span>
                          ))}
                        </li>
                      ),
                    )}
                  </ul>
                </details>
              </article>
            ))
          )}
        </div>
      </>
    );
  } catch {
    return (
      <>
        <h1 className="text-3xl font-black">Order review unavailable</h1>
        <p className="mt-4">
          Configure the isolated test database, payment keys and orders
          migration to load this queue. No order status has been changed.
        </p>
      </>
    );
  }
}
