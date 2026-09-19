import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/format";

export default async function PickupOrderConfirmedPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, total, status, customer_name, created_at, order_items ( quantity, unit_price, products ( name ) )"
    )
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <p>Bestelling niet gevonden.</p>
        <Link href="/afhalen" className="text-amber-800 underline">
          Terug naar de menukaart
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-10 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold text-stone-900">Bedankt voor je bestelling, {order.customer_name}!</h1>
      <p className="mt-1 text-stone-500">
        Je bestelling wordt klaargemaakt — kom over ongeveer 20 minuten langs bij Waterlandplein
        258 om af te halen.
      </p>

      <div className="mt-6 w-full rounded-xl border border-stone-200 bg-white p-4 text-left shadow-sm">
        {order.order_items.map((item, index: number) => {
          const product = item.products as unknown as { name: string } | null;
          return (
            <div key={index} className="flex justify-between py-1 text-sm">
              <span>
                {item.quantity}× {product?.name}
              </span>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          );
        })}
        <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-bold">
          <span>Totaal (te betalen bij ophalen)</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <Link
        href="/afhalen"
        className="mt-6 rounded-full bg-amber-800 px-6 py-3 font-semibold text-white"
      >
        Nog iets bestellen
      </Link>
    </main>
  );
}
