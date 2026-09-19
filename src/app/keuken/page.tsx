import KitchenScreen from "@/components/KitchenScreen";
import LogoutButton from "@/components/LogoutButton";

export default function KeukenPage() {
  return (
    <div className="flex flex-col flex-1 bg-stone-100">
      <header className="flex items-center justify-between bg-amber-900 px-4 py-4 text-white">
        <h1 className="text-xl font-bold">Keukenscherm — Benny&apos;s Amsterdam</h1>
        <LogoutButton />
      </header>
      <KitchenScreen />
    </div>
  );
}
