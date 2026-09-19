import { getMenu } from "@/lib/menu";
import { formatPrice } from "@/lib/format";
import SiteHeader from "@/components/SiteHeader";

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="font-heading text-3xl font-semibold text-amber-950">Onze menukaart</h1>
        <p className="mt-2 mb-10 text-sm text-amber-950/60">
          Bestellen kan alleen aan tafel, via de QR-code op je tafel.
        </p>
        {categories.map((category) => (
          <section key={category.id} className="mb-10">
            <h2 className="font-heading mb-4 text-lg font-semibold uppercase tracking-wide text-orange-600">
              {category.name}
            </h2>
            <div className="flex flex-col gap-3">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className={`rounded-2xl border border-amber-900/10 bg-white p-4 shadow-sm ${
                    !product.is_available ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-amber-950">{product.name}</h3>
                      {product.description && (
                        <p className="mt-1 text-sm text-amber-950/60">{product.description}</p>
                      )}
                      {product.allergens.length > 0 && (
                        <p className="mt-1 text-xs text-amber-950/40">
                          {product.allergens.join(" · ")}
                        </p>
                      )}
                      {!product.is_available && (
                        <p className="mt-1 text-xs font-medium text-red-600">Uitverkocht</p>
                      )}
                    </div>
                    <span className="whitespace-nowrap font-semibold text-orange-600">
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
