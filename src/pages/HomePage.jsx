import { Link } from "react-router-dom";
import { ArrowRight, BadgePercent, Flame, ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { useI18n } from "../context/I18nContext";
import { CATEGORIES } from "../data/products";

export default function HomePage() {
  const { t } = useI18n();
  const { products } = useShop();
  const featured = products.slice(0, 6);
  const hotDeals = products.slice(6, 10);
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="space-y-14 pb-8">
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-100/50 sm:p-12">
          <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-fuchsia-200/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
          <p className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/90 px-3 py-1 text-xs font-medium text-rose-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            {t("home_hero_badge")}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
            {t("home_hero_title")}{" "}
            <span className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              {t("home_hero_accent")}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">{t("home_hero_lead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:scale-[1.03]"
            >
              {t("home_cta_catalog", { n: products.length })}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/deals"
              className="inline-flex min-h-[48px] items-center rounded-full border border-stone-200 bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
            >
              {t("home_cta_deals")}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-500">
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-rose-500" />
              {t("home_delivery")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              {t("home_gift")}
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <article className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-rose-50 p-6 shadow-sm">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
              <BadgePercent className="h-4 w-4" />
              {t("home_promo_week_kicker")}
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">{t("home_promo_week_title")}</h3>
            <p className="mt-2 text-sm text-stone-600">{t("home_promo_week_lead")}</p>
            <Link to="/deals" className="mt-4 inline-flex text-sm font-semibold text-rose-700 hover:underline">
              {t("home_promo_week_link")}
            </Link>
          </article>
          <article className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-700">
              <Flame className="h-4 w-4" />
              {t("home_promo_hits_kicker")}
            </p>
            <p className="mt-3 text-sm text-stone-600">{t("home_promo_hits_lead")}</p>
            <Link to="/new" className="mt-4 inline-flex text-sm font-semibold text-rose-700 hover:underline">
              {t("home_promo_hits_link")}
            </Link>
          </article>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{t("home_promo_strip_title")}</h2>
          <Link to="/deals" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            {t("home_promo_strip_all")}
          </Link>
        </div>
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2">
          <article className="min-w-[280px] snap-start rounded-2xl border border-fuchsia-200 bg-gradient-to-r from-fuchsia-100 to-rose-100 p-5 shadow-sm sm:min-w-[360px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-800">{t("home_promo_c1_k")}</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900">{t("home_promo_c1_t")}</h3>
            <Link to="/deals" className="mt-3 inline-flex text-sm font-semibold text-fuchsia-700 hover:underline">
              {t("home_promo_c1_l")}
            </Link>
          </article>
          <article className="min-w-[280px] snap-start rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 p-5 shadow-sm sm:min-w-[360px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">{t("home_promo_c2_k")}</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900">{t("home_promo_c2_t")}</h3>
            <Link to="/brands" className="mt-3 inline-flex text-sm font-semibold text-amber-700 hover:underline">
              {t("home_promo_c2_l")}
            </Link>
          </article>
          <article className="min-w-[280px] snap-start rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-100 to-pink-100 p-5 shadow-sm sm:min-w-[360px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">{t("home_promo_c3_k")}</p>
            <h3 className="mt-2 text-lg font-semibold text-stone-900">{t("home_promo_c3_t")}</h3>
            <Link to="/new" className="mt-3 inline-flex text-sm font-semibold text-rose-700 hover:underline">
              {t("home_promo_c3_l")}
            </Link>
          </article>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{t("home_section_categories")}</h2>
          <Link to="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            {t("home_section_categories_all")}
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/catalog?cat=${c.id}`}
              className="rounded-2xl border border-stone-200 bg-white px-5 py-4 text-sm font-medium text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:text-rose-700"
            >
              {t(`cat_${c.id}`)}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{t("home_section_brands")}</h2>
          <Link to="/brands" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            {t("home_section_brands_all")}
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {brands.map((brand) => (
            <span
              key={brand}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{t("home_section_hot")}</h2>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">{t("home_section_hot_lead")}</p>
          </div>
          <Link to="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            {t("home_section_hot_all")}
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {hotDeals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{t("home_section_featured")}</h2>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">{t("home_section_featured_lead")}</p>
          </div>
          <Link to="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            {t("home_section_featured_all")}
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
