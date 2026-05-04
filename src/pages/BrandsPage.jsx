import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useI18n } from "../context/I18nContext";

export default function BrandsPage() {
  const { t } = useI18n();
  const { products } = useShop();
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{t("brands_title")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t("brands_lead")}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand}
            to={`/catalog?q=${encodeURIComponent(brand)}`}
            className="rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200"
          >
            <p className="text-lg font-semibold text-stone-900">{brand}</p>
            <p className="mt-1 text-sm text-stone-500">{t("brands_cta")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
