import { supabase } from "@/lib/supabase";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export type OpenBill = {
  key: string;
  label: string;
  orderIds: string[];
  items: { quantity: number; productName: string; unitPrice: number }[];
  total: number;
};

export async function getOpenTables(): Promise<OpenBill[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, total, order_type, customer_name, tables ( table_number ), order_items ( quantity, unit_price, products ( name ) )"
    )
    .in("status", ["new", "ready"])
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const byKey = new Map<string, OpenBill>();

  for (const order of data ?? []) {
    const table = order.tables as unknown as { table_number: number } | null;
    const isPickup = order.order_type === "pickup";
    const key = isPickup ? `pickup-${order.id}` : `table-${table?.table_number ?? 0}`;
    const label = isPickup
      ? `Afhalen — ${order.customer_name ?? "Onbekend"}`
      : `Tafel ${table?.table_number ?? "?"}`;
    const items = order.order_items as unknown as {
      quantity: number;
      unit_price: number;
      products: { name: string } | null;
    }[];

    const existing: OpenBill = byKey.get(key) ?? {
      key,
      label,
      orderIds: [],
      items: [],
      total: 0,
    };

    existing.orderIds.push(order.id);
    existing.total += order.total;
    existing.items.push(
      ...items.map((item) => ({
        quantity: item.quantity,
        productName: item.products?.name ?? "Onbekend gerecht",
        unitPrice: item.unit_price,
      }))
    );

    byKey.set(key, existing);
  }

  return Array.from(byKey.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export type PaidOrder = {
  id: string;
  createdAt: string;
  label: string;
  items: { quantity: number; productName: string; unitPrice: number }[];
  total: number;
};

export async function getPaidOrdersToday(): Promise<PaidOrder[]> {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, total, order_type, customer_name, tables ( table_number ), order_items ( quantity, unit_price, products ( name ) )"
    )
    .eq("status", "paid")
    .gte("created_at", startOfToday.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((order) => {
    const table = order.tables as unknown as { table_number: number } | null;
    const isPickup = order.order_type === "pickup";
    const items = order.order_items as unknown as {
      quantity: number;
      unit_price: number;
      products: { name: string } | null;
    }[];

    return {
      id: order.id,
      createdAt: order.created_at,
      label: isPickup
        ? `Afhalen — ${order.customer_name ?? "Onbekend"}`
        : `Tafel ${table?.table_number ?? "?"}`,
      total: order.total,
      items: items.map((item) => ({
        quantity: item.quantity,
        productName: item.products?.name ?? "Onbekend gerecht",
        unitPrice: item.unit_price,
      })),
    };
  });
}

export async function settleTable(orderIds: string[]) {
  const browserClient = createBrowserClient();
  const { error } = await browserClient
    .from("orders")
    .update({ status: "paid" })
    .in("id", orderIds);
  if (error) throw new Error(error.message);
}
