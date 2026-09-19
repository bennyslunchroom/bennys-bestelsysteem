import Link from "next/link";
import CashierScreen from "@/components/CashierScreen";
import LogoutButton from "@/components/LogoutButton";

export default function KassaPage() {
  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="flex items-center justify-between bg-amber-900 px-4 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">Kassa — Benny&apos;s Amsterdam</h1>
          <div className="flex gap-4">
            <Link href="/kassa/geschiedenis" className="text-sm text-amber-100 underline">
              Geschiedenis van vandaag
            </Link>
            <Link href="/kassa/nieuwe-bestelling" className="text-sm text-amber-100 underline">
              + Nieuwe afhaalbestelling
            </Link>
          </div>
        </div>
        <LogoutButton />
      </header>
      <CashierScreen />
    </div>
  );
}
