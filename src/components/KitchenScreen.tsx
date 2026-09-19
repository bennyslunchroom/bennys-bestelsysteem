"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { getNewOrders, type KitchenOrder } from "@/lib/kitchen";

function timeAgo(createdAt: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (minutes === 0) return "net binnen";
  if (minutes === 1) return "1 minuut geleden";
  return `${minutes} minuten geleden`;
}

export default function KitchenScreen() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);

  const refresh = useCallback(() => {
    getNewOrders().then(setOrders).catch(console.error);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel("keuken-bestellingen")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  async function markReady(orderId: string) {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    const browserClient = createBrowserClient();
    const { error } = await browserClient
      .from("orders")
      .update({ status: "ready" })
      .eq("id", orderId);
    if (error) {
      console.error(error);
      refresh();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orders.length === 0 && (
        <p className="col-span-full py-20 text-center text-lg text-stone-400">
          Geen nieuwe bestellingen.
        </p>
      )}
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col rounded-xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between rounded-t-xl bg-amber-800 px-4 py-3 text-white">
            <span className="text-lg font-bold">Tafel {order.tableNumber}</span>
            <span className="text-xs text-amber-100">{timeAgo(order.created_at)}</span>
          </div>
          <div className="flex-1 p-4">
            <ul className="flex flex-col gap-1">
              {order.items.map((item, index) => (
                <li key={index} className="text-stone-800">
                  <span className="font-semibold">{item.quantity}×</span> {item.productName}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => markReady(order.id)}
            className="m-3 rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
          >
            Klaar
          </button>
        </div>
      ))}
    </div>
  );
}
