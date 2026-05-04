import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { formatTenge } from "../utils/money";

const empty = {
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  comment: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { cartLinesDetailed, cartTotal, placeOrder } = useShop();
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!customer) return;
    setForm((f) => ({
      ...f,
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
    }));
  }, [customer]);

  if (cartLinesDetailed.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center shadow-sm">
        <p className="text-stone-700">Нечего оформлять — корзина пуста.</p>
        <Link to="/catalog" className="mt-4 inline-block font-medium text-rose-600 hover:underline">
          В каталог
        </Link>
      </div>
    );
  }

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErr("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!customer) {
      setErr("Сессия покупателя недоступна. Войдите снова.");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim()) {
      setErr("Заполните обязательные поля: имя, email, телефон, город, адрес.");
      return;
    }
    const order = placeOrder(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        comment: form.comment.trim(),
      },
      customer.id
    );
    if (order) navigate(`/orders?highlight=${encodeURIComponent(order.id)}`);
    else setErr("Не удалось создать заказ.");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Оформление заказа</h1>
      <p className="mt-2 text-sm text-stone-600">
        Покупатель: <span className="font-medium text-stone-800">{customer?.email}</span>. К оплате:{" "}
        <span className="font-semibold text-stone-900">{formatTenge(cartTotal)}</span> (KZT)
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {err && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{err}</p>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="name">
            Имя и фамилия *
          </label>
          <input
            id="name"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="phone">
            Телефон *
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="city">
            Город *
          </label>
          <input
            id="city"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.city}
            onChange={set("city")}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="address">
            Адрес доставки *
          </label>
          <textarea
            id="address"
            rows={3}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.address}
            onChange={set("address")}
            autoComplete="street-address"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="comment">
            Комментарий к заказу
          </label>
          <textarea
            id="comment"
            rows={2}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 shadow-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={form.comment}
            onChange={set("comment")}
          />
        </div>

        <button
          type="submit"
          className="w-full min-h-[52px] rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-semibold text-white shadow-lg shadow-rose-300/40 transition hover:scale-[1.01]"
        >
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
}
