import KitchenScreen from "@/components/KitchenScreen";

export default function KeukenPage() {
  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="bg-amber-900 px-4 py-4 text-white">
        <h1 className="text-xl font-bold">Keukenscherm — Benny&apos;s Amsterdam</h1>
      </header>
      <KitchenScreen />
    </div>
  );
}
