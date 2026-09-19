import { supabase } from "@/lib/supabase";

export type KitchenOrder = {
  id: string;
  created_at: string;
  label: string;
  items: { quantity: number; productName: string }[];
};

export async function getNewOrders(): Promise<KitchenOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, order_type, customer_name, tables ( table_number ), order_items ( quantity, products ( name ) )"
    )
    .eq("status", "new")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((order) => {
    const table = order.tables as unknown as { table_number: number } | null;
    const items = order.order_items as unknown as {
      quantity: number;
      products: { name: string } | null;
    }[];
    const label =
      order.order_type === "pickup"
        ? `Afhalen — ${order.customer_name ?? "Onbekend"}`
        : `Tafel ${table?.table_number ?? "?"}`;
    return {
      id: order.id,
      created_at: order.created_at,
      label,
      items: items.map((item) => ({
        quantity: item.quantity,
        productName: item.products?.name ?? "Onbekend gerecht",
      })),
    };
  });
}
