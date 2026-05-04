import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/products";
import { useShop } from "../context/ShopContext";
import { useI18n } from "../context/I18nContext";

export default function CatalogPage() {
  const { t, collatorLocale } = useI18n();
  const { products } = useShop();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [cat, setCat] = useState(searchParams.get("cat") || "all");
  const [brand, setBrand] = useState("all");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setCat(searchParams.get("cat") || "all");
  }, [searchParams]);

  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))], [products]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    const base = products.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okBrand = brand === "all" || p.brand === brand;
      const okText =
        !text ||
        p.name.toLowerCase().includes(text) ||
        p.brand.toLowerCase().includes(text) ||
        p.description.toLowerCase().includes(text);
      return okCat && okBrand && okText;
    });
    if (sort === "price-asc") return [...base].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...base].sort((a, b) => b.price - a.price);
    if (sort === "name") return [...base].sort((a, b) => a.name.localeCompare(b.name, collatorLocale));
    return base;
  }, [q, cat, brand, sort, products, collatorLocale]);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{t("catalog_title")}</h1>
      <p className="mt-2 max-w-2xl text-stone-600">{t("catalog_lead", { n: products.length })}</p>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">
        <aside className="shrink-0 space-y-4 lg:w-56">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">{t("catalog_filter_category")}</p>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={`min-h-[44px] rounded-xl px-4 py-2 text-left text-sm font-medium transition lg:w-full ${
                cat === "all" ? "bg-rose-100 text-rose-900 ring-1 ring-rose-200" : "bg-white text-stone-600 shadow-sm ring-1 ring-stone-200 hover:bg-stone-50"
              }`}
            >
              {t("catalog_all")}
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
                {t(`cat_${c.id}`)}
              </button>
            ))}
          </div>
          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-stone-500">{t("catalog_filter_brand")}</p>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-700 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          >
            <option value="all">{t("catalog_all_brands")}</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("catalog_search_ph")}
              className="w-full min-h-[48px] rounded-2xl border border-stone-200 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 shadow-sm outline-none ring-0 placeholder:text-stone-400 focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-stone-600">{t("catalog_found", { n: filtered.length })}</p>
            <label className="inline-flex items-center gap-2 text-sm text-stone-600">
              {t("catalog_sort")}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="min-h-[38px] rounded-lg border border-stone-200 bg-white px-2 text-sm text-stone-700 outline-none focus:border-rose-300"
              >
                <option value="popular">{t("catalog_sort_popular")}</option>
                <option value="price-asc">{t("catalog_sort_price_asc")}</option>
                <option value="price-desc">{t("catalog_sort_price_desc")}</option>
                <option value="name">{t("catalog_sort_name")}</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-stone-600 shadow-sm">{t("catalog_empty")}</p>
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
