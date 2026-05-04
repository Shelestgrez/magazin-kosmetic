import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
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
  const { t } = useI18n();
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { cartLinesDetailed, cartTotal, placeOrder } = useShop();
  const [form, setForm] = useState(empty);
  const [errKey, setErrKey] = useState("");

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
        <p className="text-stone-700">{t("checkout_empty")}</p>
        <Link to="/catalog" className="mt-4 inline-block font-medium text-rose-600 hover:underline">
          {t("checkout_to_catalog")}
        </Link>
      </div>
    );
  }

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrKey("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!customer) {
      setErrKey("checkout_err_session");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim()) {
      setErrKey("checkout_err_required");
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
    else setErrKey("checkout_err_place_failed");
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{t("checkout_title")}</h1>
      <p className="mt-2 text-sm text-stone-600">
        {t("checkout_subtitle", { email: customer?.email ?? "", total: formatTenge(cartTotal) })}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        {errKey && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{t(errKey)}</p>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="name">
            {t("checkout_name")}
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
            {t("checkout_email")}
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
            {t("checkout_phone")}
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
            {t("checkout_city")}
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
            {t("checkout_address")}
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
            {t("checkout_comment")}
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
          {t("checkout_submit")}
        </button>
      </form>
    </div>
  );
}
