import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { useI18n } from "../context/I18nContext";

export default function DealsPage() {
  const { t } = useI18n();
  const { products } = useShop();
  const deals = [...products].sort((a, b) => b.stock - a.stock).slice(0, 12);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{t("deals_title")}</h1>
        <p className="mt-2 max-w-3xl text-stone-600">{t("deals_lead")}</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
