import { readFileSync, writeFileSync } from "fs";

const data = JSON.parse(readFileSync(new URL("../data/menu-export.json", import.meta.url)));

function sqlString(value) {
  return "'" + value.replace(/'/g, "''") + "'";
}

function sqlArray(values) {
  if (values.length === 0) return "'{}'";
  return "ARRAY[" + values.map((v) => sqlString(v)).join(", ") + "]";
}

let sql = "-- Automatisch gegenereerd vanuit data/menu-export.json (scripts/generate-menu-seed.mjs)\n\n";

sql += "-- Categorieën\n";
data.categoryOrder.forEach((name, index) => {
  sql += `insert into categories (name, sort_order) values (${sqlString(name)}, ${index});\n`;
});

sql += "\n-- Gerechten\n";
data.products.forEach((p, index) => {
  const name = sqlString(p.name.trim());
  const description = p.description ? sqlString(p.description.trim()) : "null";
  const price = parseFloat(p.price).toFixed(2);
  const allergens = sqlArray(p.allergens);
  const isAvailable = p.soldOut ? "false" : "true";
  sql += `insert into products (category_id, name, description, price, allergens, is_available, sort_order) values ((select id from categories where name = ${sqlString(
    p.category
  )}), ${name}, ${description}, ${price}, ${allergens}, ${isAvailable}, ${index});\n`;
});

sql += "\n-- De 15 tafels\n";
for (let i = 1; i <= 15; i++) {
  sql += `insert into tables (table_number) values (${i});\n`;
}

writeFileSync(new URL("../supabase/migrations/0002_seed_menu.sql", import.meta.url), sql);
console.log("Klaar:", data.products.length, "gerechten,", data.categoryOrder.length, "categorieën, 15 tafels.");
