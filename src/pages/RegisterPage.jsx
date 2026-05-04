import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export default function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { registerCustomer, isCustomer } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errKey, setErrKey] = useState("");
  const [loading, setLoading] = useState(false);

  if (isCustomer) return <Navigate to="/catalog" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErrKey("");
    if (password !== confirm) {
      setErrKey("auth_password_mismatch");
      return;
    }
    setLoading(true);
    const res = await registerCustomer({ name, email, password, phone });
    setLoading(false);
    if (!res.ok) {
      setErrKey(res.errorKey || "auth_required_fields");
      return;
    }
    navigate("/catalog", { replace: true });
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{t("register_title")}</h1>
      <p className="mt-2 text-sm text-stone-600">{t("register_lead")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {errKey && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">{t(errKey)}</p>}
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="reg-name">
            {t("register_name")}
          </label>
          <input
            id="reg-name"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="reg-email">
            {t("register_email")}
          </label>
          <input
            id="reg-email"
            type="email"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="reg-phone">
            {t("register_phone")}
          </label>
          <input
            id="reg-phone"
            type="tel"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="reg-pw">
            {t("register_pw_min")}
          </label>
          <input
            id="reg-pw"
            type="password"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="reg-pw2">
            {t("register_confirm")}
          </label>
          <input
            id="reg-pw2"
            type="password"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-semibold text-white shadow-md disabled:opacity-60"
        >
          {loading ? t("register_loading") : t("register_submit")}
        </button>
        <p className="text-center text-sm text-stone-600">
          {t("register_have_account")}{" "}
          <Link to="/login" className="font-medium text-rose-600 hover:underline">
            {t("register_sign_in")}
          </Link>
        </p>
      </form>
    </div>
  );
}
