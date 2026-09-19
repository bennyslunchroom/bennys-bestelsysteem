import CashierScreen from "@/components/CashierScreen";

export default function KassaPage() {
  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="bg-amber-900 px-4 py-4 text-white">
        <h1 className="text-xl font-bold">Kassa — Benny&apos;s Amsterdam</h1>
      </header>
      <CashierScreen />
    </div>
  );
}
