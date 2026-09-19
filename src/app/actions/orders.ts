"use server";

import { supabase } from "@/lib/supabase";

export type PlaceOrderInput = {
  destination: { type: "table"; tableNumber: number } | { type: "pickup"; customerName: string };
  items: { productId: string; quantity: number }[];
};

export async function placeOrder({ destination, items }: PlaceOrderInput) {
  if (items.length === 0) {
    return { error: "Winkelwagen is leeg." };
  }

  let tableId: string | null = null;

  if (destination.type === "table") {
    const { data: table, error: tableError } = await supabase
      .from("tables")
      .select("id")
      .eq("table_number", destination.tableNumber)
      .single();

    if (tableError || !table) {
      return { error: "Tafel niet gevonden." };
    }
    tableId = table.id;
  } else if (!destination.customerName.trim()) {
    return { error: "Vul je naam in." };
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
    .insert({
      table_id: tableId,
      total,
      order_type: destination.type === "table" ? "dine_in" : "pickup",
      customer_name: destination.type === "pickup" ? destination.customerName.trim() : null,
    })
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
