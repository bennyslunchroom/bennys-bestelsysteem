import { supabase } from "@/lib/supabase";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export type OpenTable = {
  tableNumber: number;
  orderIds: string[];
  items: { quantity: number; productName: string; unitPrice: number }[];
  total: number;
  oldestOrderAt: string;
};

export async function getOpenTables(): Promise<OpenTable[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, total, tables ( table_number ), order_items ( quantity, unit_price, products ( name ) )"
    )
    .in("status", ["new", "ready"])
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const byTable = new Map<number, OpenTable>();

  for (const order of data ?? []) {
    const table = order.tables as unknown as { table_number: number } | null;
    const tableNumber = table?.table_number ?? 0;
    const items = order.order_items as unknown as {
      quantity: number;
      unit_price: number;
      products: { name: string } | null;
    }[];

    const existing: OpenTable = byTable.get(tableNumber) ?? {
      tableNumber,
      orderIds: [],
      items: [],
      total: 0,
      oldestOrderAt: order.created_at,
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

    byTable.set(tableNumber, existing);
  }

  return Array.from(byTable.values()).sort((a, b) => a.tableNumber - b.tableNumber);
}

export async function settleTable(orderIds: string[]) {
  const browserClient = createBrowserClient();
  const { error } = await browserClient
    .from("orders")
    .update({ status: "paid" })
    .in("id", orderIds);
  if (error) throw new Error(error.message);
}
