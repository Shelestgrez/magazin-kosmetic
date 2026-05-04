import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package } from "lucide-react";
import { ORDER_STATUS_OPTIONS, useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { formatTenge } from "../utils/money";

function statusLabel(v) {
  return ORDER_STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v;
}

export default function OrdersPage() {
  const { customer } = useAuth();
  const { orders } = useShop();
  const [params] = useSearchParams();
  const highlight = params.get("highlight");

  const sorted = useMemo(() => {
    const mine = orders.filter((o) => o.userId && customer && o.userId === customer.id);
    return [...mine].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, customer]);

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center shadow-sm">
        <Package className="mx-auto h-12 w-12 text-stone-300" />
        <p className="mt-4 text-lg text-stone-700">Заказов пока нет.</p>
        <p className="mt-2 text-sm text-stone-500">
          Оформите заказ из корзины (нужна авторизация) — здесь появятся только ваши покупки.
        </p>
        <Link
          to="/catalog"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-8 text-sm font-medium text-stone-800 hover:bg-stone-100"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Мои заказы</h1>
      <p className="mt-2 text-sm text-stone-600">
        Учётная запись: <span className="font-medium text-stone-800">{customer?.email}</span>. Суммы в тенге (KZT).
      </p>

      <ul className="mt-8 space-y-4">
        {sorted.map((o) => {
          const isHi = highlight === o.id;
          return (
            <li
              key={o.id}
              className={`rounded-2xl border p-5 shadow-sm transition ${
                isHi ? "border-rose-300 bg-rose-50/80 ring-2 ring-rose-100" : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-sm font-medium text-rose-700">{o.id}</p>
                  <p className="mt-1 text-xs text-stone-500">
                    {new Date(o.createdAt).toLocaleString("kk-KZ", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-800">{statusLabel(o.status)}</span>
              </div>
              <p className="mt-3 text-sm text-stone-600">
                {o.customer.name} · {o.customer.phone}
              </p>
              <p className="text-sm text-stone-500">
                {o.customer.city}, {o.customer.address}
              </p>
              <ul className="mt-4 space-y-1 border-t border-stone-100 pt-4 text-sm text-stone-700">
                {o.items.map((it) => (
                  <li key={`${o.id}-${it.productId}`} className="flex justify-between gap-2">
                    <span>
                      {it.name} × {it.qty}
                    </span>
                    <span className="shrink-0 tabular-nums text-stone-600">{formatTenge(it.price * it.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-right text-lg font-semibold tabular-nums text-stone-900">{formatTenge(o.total)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
