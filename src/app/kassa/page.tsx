import Link from "next/link";
import CashierScreen from "@/components/CashierScreen";
import LogoutButton from "@/components/LogoutButton";

export default function KassaPage() {
  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="flex items-center justify-between bg-amber-900 px-4 py-4 text-white">
        <h1 className="text-xl font-bold">Kassa — Benny&apos;s Amsterdam</h1>
        <LogoutButton />
      </header>

      <div className="flex gap-3 bg-white px-4 py-3 shadow-sm">
        <Link
          href="/kassa/nieuwe-bestelling"
          className="rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-900"
        >
          + Nieuwe bestelling
        </Link>
        <Link
          href="/kassa/geschiedenis"
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Geschiedenis van vandaag
        </Link>
      </div>

      <CashierScreen />
    </div>
  );
}
