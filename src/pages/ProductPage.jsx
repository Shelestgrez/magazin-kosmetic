import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { useI18n } from "../context/I18nContext";
import { formatTenge } from "../utils/money";

export default function ProductPage() {
  const { t, dateLocale } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById, addToCart, getReviewsForProduct, addReviewForProduct } = useShop();
  const product = getProductById(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewDone, setReviewDone] = useState(false);

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 3),
    [products, product]
  );
  const reviews = useMemo(() => getReviewsForProduct(id), [getReviewsForProduct, id]);
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  if (!product) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg text-stone-700">{t("product_not_found")}</p>
        <Link to="/catalog" className="mt-4 inline-block font-medium text-rose-600 hover:underline">
          {t("product_to_catalog")}
        </Link>
      </div>
    );
  }

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(product.stock, q + 1));

  const handleAdd = () => {
    const ok = addToCart(product.id, qty);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const ok = addReviewForProduct(id, {
      author: reviewName,
      rating: reviewRating,
      comment: reviewText,
    });
    if (!ok) return;
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
    setReviewDone(true);
    setTimeout(() => setReviewDone(false), 2000);
  };

  return (
    <div className="space-y-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-stone-600 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("product_back")}
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-lg">
          <img src={product.image} alt="" className="aspect-square w-full object-cover object-center" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-rose-600">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-stone-500">
            {t(`cat_${product.category}`)} · {product.volume}
          </p>
          <p className="mt-6 text-base leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold tabular-nums text-stone-900 sm:text-4xl">{formatTenge(product.price)}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                product.stock > 5 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
              }`}
            >
              {t("product_in_stock", { n: product.stock })}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={dec}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                aria-label={t("product_less")}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="min-w-[2.5rem] text-center text-lg font-semibold tabular-nums text-stone-900">{qty}</span>
              <button
                type="button"
                onClick={inc}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                aria-label={t("product_more")}
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock < 1}
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-6 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-initial sm:px-10"
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  {t("product_added")}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  {t("product_add")}
                </>
              )}
            </button>
            <Link
              to="/cart"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
            >
              {t("product_go_cart")}
            </Link>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">{t("reviews_title")}</h2>
          <p className="inline-flex items-center gap-2 text-sm text-stone-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {reviews.length > 0
              ? t("reviews_rating_line", { rating: avgRating.toFixed(1), n: reviews.length })
              : t("reviews_none_short")}
          </p>
        </div>

        <form onSubmit={handleReviewSubmit} className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2">
          <input
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            placeholder={t("reviews_name_ph")}
            required
            className="min-h-[44px] rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
          <select
            value={reviewRating}
            onChange={(e) => setReviewRating(Number(e.target.value))}
            className="min-h-[44px] rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          >
            <option value={5}>{t("reviews_rate_5")}</option>
            <option value={4}>{t("reviews_rate_4")}</option>
            <option value={3}>{t("reviews_rate_3")}</option>
            <option value={2}>{t("reviews_rate_2")}</option>
            <option value={1}>{t("reviews_rate_1")}</option>
          </select>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={t("reviews_text_ph")}
            required
            rows={4}
            className="sm:col-span-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
          />
          <div className="sm:col-span-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-stone-900 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              {t("reviews_submit")}
            </button>
            {reviewDone && <span className="text-sm font-medium text-emerald-700">{t("reviews_thanks")}</span>}
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">{t("reviews_empty_long")}</p>
          ) : (
            reviews.map((review) => (
              <article key={review.id} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-stone-900">{review.author}</p>
                  <p className="text-xs text-stone-500">{new Date(review.createdAt).toLocaleDateString(dateLocale)}</p>
                </div>
                <p className="mt-1 text-sm text-amber-600">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">{review.comment}</p>
              </article>
            ))
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">{t("reviews_related")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
