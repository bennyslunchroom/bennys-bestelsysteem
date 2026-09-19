"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getOpenTables, settleTable, type OpenTable } from "@/lib/cashier";
import { formatPrice } from "@/lib/format";

export default function CashierScreen() {
  const [tables, setTables] = useState<OpenTable[]>([]);
  const [confirmingTable, setConfirmingTable] = useState<OpenTable | null>(null);
  const [settling, setSettling] = useState(false);

  const refresh = useCallback(() => {
    getOpenTables().then(setTables).catch(console.error);
  }, []);

  useEffect(() => {
    refresh();

    const channel = supabase
      .channel("kassa-bestellingen")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  async function handleConfirmSettle() {
    if (!confirmingTable) return;
    setSettling(true);
    const table = confirmingTable;
    try {
      await settleTable(table.orderIds);
      setTables((prev) => prev.filter((t) => t.tableNumber !== table.tableNumber));
      setConfirmingTable(null);
    } catch (err) {
      console.error(err);
      refresh();
    } finally {
      setSettling(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tables.length === 0 && (
        <p className="col-span-full py-20 text-center text-lg text-stone-400">
          Geen openstaande tafels.
        </p>
      )}
      {tables.map((table) => (
        <div
          key={table.tableNumber}
          className="flex flex-col rounded-xl border border-stone-200 bg-white shadow-sm"
        >
          <div className="rounded-t-xl bg-amber-800 px-4 py-3 text-white">
            <span className="text-lg font-bold">Tafel {table.tableNumber}</span>
          </div>
          <div className="flex-1 p-4">
            <ul className="flex flex-col gap-1 text-sm">
              {table.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.productName}
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-stone-200 pt-2 font-bold text-stone-900">
              <span>Totaal</span>
              <span>{formatPrice(table.total)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmingTable(table)}
            className="m-3 rounded-lg bg-amber-800 py-3 font-semibold text-white hover:bg-amber-900"
          >
            Afrekenen (contant)
          </button>
        </div>
      ))}

      {confirmingTable && (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h2 className="mb-1 text-lg font-bold text-stone-900">
              Bestelling tafel {confirmingTable.tableNumber}
            </h2>
            <p className="mb-3 text-sm text-stone-500">
              Controleer de bestelling samen met de klant voordat je afrekent.
            </p>
            <ul className="flex flex-col gap-1 text-sm">
              {confirmingTable.items.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.quantity}× {item.productName}
                  </span>
                  <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-stone-200 pt-2 text-lg font-bold text-stone-900">
              <span>Totaal</span>
              <span>{formatPrice(confirmingTable.total)}</span>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmingTable(null)}
                disabled={settling}
                className="flex-1 rounded-full border border-stone-300 py-3 font-semibold text-stone-700 disabled:opacity-50"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleConfirmSettle}
                disabled={settling}
                className="flex-1 rounded-full bg-amber-800 py-3 font-semibold text-white disabled:opacity-50"
              >
                {settling ? "Bezig..." : "Bevestig afrekenen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
