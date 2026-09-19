"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/app/actions/orders";
import type { Category } from "@/lib/types";

type Destination =
  | { type: "table"; tableNumber: number }
  | { type: "pickup" };

export default function OrderMenu({
  categories,
  destination,
  redirectAfterOrder,
}: {
  categories: Category[];
  destination: Destination;
  redirectAfterOrder?: string;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const allProducts = useMemo(
    () => categories.flatMap((c) => c.products),
    [categories]
  );

  function updateQuantity(productId: string, delta: number) {
    setQuantities((prev) => {
      const next = Math.max(0, (prev[productId] ?? 0) + delta);
      return { ...prev, [productId]: next };
    });
  }

  const cartItems = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => {
      const product = allProducts.find((p) => p.id === productId)!;
      return { productId, quantity, product };
    });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function handleOrder() {
    setError(null);

    if (destination.type === "pickup" && !customerName.trim()) {
      setError("Vul je naam in.");
      return;
    }

    startTransition(async () => {
      const result = await placeOrder({
        destination:
          destination.type === "table"
            ? { type: "table", tableNumber: destination.tableNumber }
            : { type: "pickup", customerName },
        items: cartItems.map(({ productId, quantity }) => ({ productId, quantity })),
      });
      if (result.error || !result.orderId) {
        setError(result.error ?? "Er ging iets mis.");
        return;
      }
      const path = redirectAfterOrder
        ? redirectAfterOrder
        : destination.type === "table"
          ? `/tafel/${destination.tableNumber}/bevestigd/${result.orderId}`
          : `/afhalen/bevestigd/${result.orderId}`;
      router.push(path);
    });
  }

  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-32">
        {destination.type === "pickup" && (
          <div className="mb-6 rounded-xl border border-stone-200 bg-white p-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">
              Je naam (voor bij het ophalen)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="Bijv. Fatima"
            />
          </div>
        )}
        {categories.map((category) => (
          <section key={category.id} className="mb-8">
            <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-amber-900">
              {category.name}
            </h2>
            <div className="flex flex-col gap-3">
              {category.products.map((product) => {
                const qty = quantities[product.id] ?? 0;
                return (
                  <div
                    key={product.id}
                    className={`rounded-xl border border-stone-200 bg-white p-4 shadow-sm ${
                      !product.is_available ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-stone-900">{product.name}</h3>
                        {product.description && (
                          <p className="mt-1 text-sm text-stone-500">{product.description}</p>
                        )}
                        {product.allergens.length > 0 && (
                          <p className="mt-1 text-xs text-stone-400">
                            {product.allergens.join(" · ")}
                          </p>
                        )}
                        {!product.is_available && (
                          <p className="mt-1 text-xs font-medium text-red-600">Uitverkocht</p>
                        )}
                      </div>
                      <span className="whitespace-nowrap font-semibold text-amber-800">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {product.is_available && (
                      <div className="mt-3 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          disabled={qty === 0}
                          className="h-8 w-8 rounded-full border border-stone-300 text-lg font-bold text-stone-600 disabled:opacity-30"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-medium">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="h-8 w-8 rounded-full bg-amber-800 text-lg font-bold text-white"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white p-4 shadow-lg">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-500">{itemCount} item(s)</p>
              <p className="font-bold text-stone-900">{formatPrice(total)}</p>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleOrder}
              disabled={isPending}
              className="rounded-full bg-amber-800 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {isPending ? "Bezig..." : "Bestellen"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
