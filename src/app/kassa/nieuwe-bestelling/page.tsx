import Link from "next/link";
import { getMenu } from "@/lib/menu";
import StaffNewOrder from "@/components/StaffNewOrder";
import LogoutButton from "@/components/LogoutButton";

export default async function NieuweBestellingPage() {
  const categories = await getMenu();

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between bg-amber-900 px-4 py-4 text-white">
        <div>
          <h1 className="text-xl font-bold">Nieuwe bestelling</h1>
          <Link href="/kassa" className="text-sm text-amber-100 underline">
            ← Terug naar kassa
          </Link>
        </div>
        <LogoutButton />
      </header>

      <StaffNewOrder categories={categories} />
    </div>
  );
}
