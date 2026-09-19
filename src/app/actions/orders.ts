"use server";

import { supabase } from "@/lib/supabase";

export type PlaceOrderInput = {
  tableNumber: number;
  items: { productId: string; quantity: number }[];
};

export async function placeOrder({ tableNumber, items }: PlaceOrderInput) {
  if (items.length === 0) {
    return { error: "Winkelwagen is leeg." };
  }

  const { data: table, error: tableError } = await supabase
    .from("tables")
    .select("id")
    .eq("table_number", tableNumber)
    .single();

  if (tableError || !table) {
    return { error: "Tafel niet gevonden." };
  }

  const productIds = items.map((item) => item.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, is_available")
    .in("id", productIds);

  if (productsError || !products) {
    return { error: "Kon gerechten niet ophalen." };
  }

  const priceById = new Map(products.map((p) => [p.id, p]));
  let total = 0;
  const orderItemsToInsert = [];

  for (const item of items) {
    const product = priceById.get(item.productId);
    if (!product || !product.is_available) {
      return { error: "Eén van de gerechten is niet meer beschikbaar." };
    }
    total += product.price * item.quantity;
    orderItemsToInsert.push({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: product.price,
    });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ table_id: table.id, total })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Kon bestelling niet aanmaken." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsToInsert.map((item) => ({ ...item, order_id: order.id })));

  if (itemsError) {
    return { error: "Kon bestelregels niet opslaan." };
  }

  return { orderId: order.id as string };
}
