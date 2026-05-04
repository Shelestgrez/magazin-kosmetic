import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/products";
import { useShop } from "../context/ShopContext";

export default function CatalogPage() {
  const { products } = useShop();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okText =
        !text ||
        p.name.toLowerCase().includes(text) ||
        p.brand.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text);
      return okCat && okText;
    });
  }, [q, cat, products]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Каталог</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        <span className="font-semibold text-stone-800">{products.length}</span> товаров в демо-каталоге (6 категорий).
        Все цены в <span className="font-medium text-rose-700">казахстанских тенге (₸)</span>. Фильтры и поиск.
      </p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
        <aside className="shrink-0 space-y-4 lg:w-56">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Категория</p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={`min-h-[44px] rounded-xl px-4 py-2 text-left text-sm font-medium transition lg:w-full ${
                cat === "all" ? "bg-rose-100 text-rose-900 ring-1 ring-rose-200" : "bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50"
              }`}
            >
              Все
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={`min-h-[44px] rounded-xl px-4 py-2 text-left text-sm font-medium transition lg:w-full ${
                  cat === c.id
                    ? "bg-gradient-to-r from-rose-100 to-fuchsia-100 text-rose-900 ring-1 ring-fuchsia-200"
                    : "bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск по названию, бренду, описанию..."
              className="w-full min-h-[48px] rounded-2xl border border-stone-200 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 shadow-sm outline-none ring-0 placeholder:text-stone-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-600 shadow-sm">
              Ничего не найдено. Сбросьте фильтры или измените запрос.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
