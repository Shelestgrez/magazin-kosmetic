import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { formatTenge } from "../utils/money";

export default function ProductCard({ product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-md shadow-stone-200/60 transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-100/80">
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-[4/5] overflow-hidden bg-stone-100 ring-1 ring-inset ring-stone-200/80"
      >
        <img
          src={product.image}
          alt=""
          className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.stock < 8 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white shadow">
            Мало на складе
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs uppercase tracking-wide text-stone-500">{product.brand}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-stone-900 hover:text-rose-700"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-stone-500">{product.volume}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p className="text-lg font-semibold tabular-nums text-stone-900">{formatTenge(product.price)}</p>
          <Link
            to={`/product/${product.id}`}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition hover:scale-105 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            aria-label="Подробнее"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
