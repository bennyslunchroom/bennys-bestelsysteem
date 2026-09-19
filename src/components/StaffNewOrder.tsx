"use client";

import { useState } from "react";
import OrderMenu from "@/components/OrderMenu";
import type { Category } from "@/lib/types";

export default function StaffNewOrder({ categories }: { categories: Category[] }) {
  const [mode, setMode] = useState<"table" | "pickup">("table");
  const [tableNumber, setTableNumber] = useState(1);

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pt-6">
        <div className="flex gap-2 rounded-full bg-stone-200 p-1">
          <button
            type="button"
            onClick={() => setMode("table")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${
              mode === "table" ? "bg-white text-amber-900 shadow" : "text-stone-500"
            }`}
          >
            Aan tafel
          </button>
          <button
            type="button"
            onClick={() => setMode("pickup")}
            className={`flex-1 rounded-full py-2 text-sm font-semibold ${
              mode === "pickup" ? "bg-white text-amber-900 shadow" : "text-stone-500"
            }`}
          >
            Afhalen
          </button>
        </div>

        {mode === "table" && (
          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
            <label className="mb-1 block text-sm font-medium text-stone-700">Tafelnummer</label>
            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(Number(e.target.value))}
              className="w-full rounded-lg border border-stone-300 px-3 py-2"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Tafel {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <OrderMenu
        key={mode === "table" ? `table-${tableNumber}` : "pickup"}
        categories={categories}
        destination={mode === "table" ? { type: "table", tableNumber } : { type: "pickup" }}
        redirectAfterOrder="/kassa"
      />
    </>
  );
}
