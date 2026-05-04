import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { formatTenge } from "../utils/money";

export default function CartPage() {
  const { isCustomer } = useAuth();
  const { cartLinesDetailed, cartTotal, setLineQty, removeLine } = useShop();

  if (cartLinesDetailed.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-stone-700">Корзина пуста.</p>
        <Link
          to="/catalog"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-8 text-sm font-semibold text-white shadow-md"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Корзина</h1>
      <p className="mt-2 text-stone-600">{cartLinesDetailed.length} позиций · суммы в тенге (KZT)</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md">
        <ul className="divide-y divide-stone-100">
          {cartLinesDetailed.map((line) => (
            <li key={line.productId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
              <Link to={`/product/${line.product.id}`} className="flex shrink-0 gap-4 sm:items-center">
                <img
                  src={line.product.image}
                  alt=""
                  className="h-24 w-24 rounded-xl object-cover ring-1 ring-stone-200"
                />
                <div className="min-w-0">
                  <p className="text-xs text-stone-500">{line.product.brand}</p>
                  <p className="font-medium leading-snug text-stone-900 hover:text-rose-700">{line.product.name}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {formatTenge(line.product.price)} × шт.
                  </p>
                </div>
              </Link>

              <div className="flex flex-1 flex-wrap items-center justify-between gap-4 sm:justify-end">
                <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 p-1">
                  <button
                    type="button"
                    className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-stone-600 hover:bg-white"
                    onClick={() => setLineQty(line.productId, line.qty - 1)}
                    aria-label="Меньше"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-stone-900">{line.qty}</span>
                  <button
                    type="button"
                    className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg text-stone-600 hover:bg-white"
                    onClick={() => setLineQty(line.productId, line.qty + 1)}
                    aria-label="Больше"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-lg font-semibold tabular-nums text-stone-900">{formatTenge(line.subtotal)}</p>
                <button
                  type="button"
                  onClick={() => removeLine(line.productId)}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-4 border-t border-stone-100 bg-stone-50/80 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-stone-500">Итого</p>
            <p className="text-2xl font-semibold tabular-nums text-stone-900">{formatTenge(cartTotal)}</p>
            {!isCustomer && (
              <p className="mt-2 max-w-sm text-xs text-stone-500">
                Для оформления заказа войдите или зарегистрируйтесь — заказ привяжется к вашему аккаунту.
              </p>
            )}
          </div>
          {isCustomer ? (
            <Link
              to="/checkout"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-10 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02]"
            >
              Оформить заказ
            </Link>
          ) : (
            <Link
              to="/login"
              state={{ from: "/checkout" }}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-10 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.02]"
            >
              Войти для оформления
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
