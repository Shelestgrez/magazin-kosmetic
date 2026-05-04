import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { getCategoryLabel } from "../data/products";
import { formatTenge } from "../utils/money";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getProductById, addToCart } = useShop();
  const product = getProductById(id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 3),
    [products, product]
  );

  if (!product) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <p className="text-lg text-stone-700">Товар не найден.</p>
        <Link to="/catalog" className="mt-4 inline-block font-medium text-rose-600 hover:underline">
          В каталог
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

  return (
    <div className="space-y-12">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex min-h-[44px] items-center gap-2 text-sm text-stone-600 transition hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Назад
      </button>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-stone-100 shadow-lg">
          <img src={product.image} alt="" className="aspect-square w-full object-cover object-center" />
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-rose-600">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-stone-500">
            {getCategoryLabel(product.category)} · {product.volume}
          </p>
          <p className="mt-6 text-base leading-relaxed text-stone-600">{product.description}</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold tabular-nums text-stone-900 sm:text-4xl">{formatTenge(product.price)}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                product.stock > 5 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
              }`}
            >
              В наличии: {product.stock} шт.
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-2xl border border-stone-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={dec}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                aria-label="Меньше"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="min-w-[2.5rem] text-center text-lg font-semibold tabular-nums text-stone-900">{qty}</span>
              <button
                type="button"
                onClick={inc}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-stone-600 hover:bg-stone-100"
                aria-label="Больше"
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
                  Добавлено
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  В корзину
                </>
              )}
            </button>
            <Link
              to="/cart"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
            >
              Перейти в корзину
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-stone-900 sm:text-2xl">Смотрите также</h2>
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
