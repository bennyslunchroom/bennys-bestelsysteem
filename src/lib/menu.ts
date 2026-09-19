import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";

export async function getMenu(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, name, products ( id, name, description, price, allergens, is_available, sort_order )"
    )
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "products" });

  if (error) throw new Error(error.message);

  return data ?? [];
}
