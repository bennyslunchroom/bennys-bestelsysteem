import { getMenu } from "@/lib/menu";

function formatPrice(price: number) {
  return `€ ${price.toFixed(2).replace(".", ",")}`;
}

export default async function Home() {
  const categories = await getMenu();

  return (
    <div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 bg-amber-800 text-white shadow-md">
        <div className="mx-auto max-w-3xl px-4 py-5">
          <h1 className="text-2xl font-bold">Benny&apos;s Amsterdam</h1>
          <p className="text-amber-100 text-sm">Waterlandplein 258, Amsterdam-Noord</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {categories.map((category) => (
          <section key={category.id} className="mb-8">
            <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-amber-900">
              {category.name}
            </h2>
            <div className="flex flex-col gap-3">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-xl border border-stone-200 bg-white p-4 shadow-sm ${
                    !product.is_available ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-stone-900">{product.name}</h3>
                      {product.description && (
                        <p className="mt-1 text-sm text-stone-500">{product.description}</p>
                      )}
                      {product.allergens.length > 0 && (
                        <p className="mt-1 text-xs text-stone-400">
                          {product.allergens.join(" · ")}
                        </p>
                      )}
                      {!product.is_available && (
                        <p className="mt-1 text-xs font-medium text-red-600">Uitverkocht</p>
                      )}
                    </div>
                    <span className="whitespace-nowrap font-semibold text-amber-800">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
