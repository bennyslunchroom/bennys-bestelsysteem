import Link from "next/link";
import { getPaidOrdersToday } from "@/lib/cashier";
import { formatPrice } from "@/lib/format";
import LogoutButton from "@/components/LogoutButton";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });
}

export default async function KassaGeschiedenisPage() {
  const orders = await getPaidOrdersToday();
  const dagTotaal = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="flex items-center justify-between bg-amber-900 px-4 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">Geschiedenis — vandaag</h1>
          <Link href="/kassa" className="text-sm text-amber-100 underline">
            ← Terug naar kassa
          </Link>
        </div>
        <LogoutButton />
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <p className="mb-4 text-stone-600">
          {orders.length} afgerekende bestelling(en) — totaal{" "}
          <span className="font-semibold">{formatPrice(dagTotaal)}</span>
        </p>

        {orders.length === 0 && (
          <p className="py-20 text-center text-stone-400">
            Nog geen afgerekende bestellingen vandaag.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold text-amber-900">Tafel {order.tableNumber}</span>
                <span className="text-sm text-stone-400">{formatTime(order.createdAt)}</span>
              </div>
              <ul className="flex flex-col gap-1 text-sm text-stone-700">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>
                      {item.quantity}× {item.productName}
                    </span>
                    <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-semibold">
                <span>Totaal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
