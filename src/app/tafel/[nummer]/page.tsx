import { getMenu } from "@/lib/menu";
import OrderMenu from "@/components/OrderMenu";

export default async function TablePage({
  params,
}: {
  params: Promise<{ nummer: string }>;
}) {
  const { nummer } = await params;
  const tableNumber = Number(nummer);
  const categories = await getMenu();

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 bg-amber-800 text-white shadow-md">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <h1 className="text-2xl font-bold">Benny&apos;s Amsterdam</h1>
          <p className="text-amber-100 text-sm">Tafel {tableNumber}</p>
        </div>
      </header>

      <OrderMenu categories={categories} tableNumber={tableNumber} />
    </div>
  );
}
