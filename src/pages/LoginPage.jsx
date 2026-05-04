import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/catalog";
  const { loginCustomer, isCustomer } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errKey, setErrKey] = useState("");
  const [loading, setLoading] = useState(false);

  if (isCustomer) return <Navigate to={typeof from === "string" ? from : "/catalog"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErrKey("");
    setLoading(true);
    const res = await loginCustomer(email, password);
    setLoading(false);
    if (!res.ok) {
      setErrKey(res.errorKey || "auth_wrong_password");
      return;
    }
    navigate(typeof from === "string" ? from : "/catalog", { replace: true });
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{t("login_title")}</h1>
      <p className="mt-2 text-sm text-stone-600">{t("login_lead")}</p>

      <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        {errKey && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">{t(errKey)}</p>}
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="login-email">
            {t("login_email")}
          </label>
          <input
            id="login-email"
            type="email"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500" htmlFor="login-pw">
            {t("login_password")}
          </label>
          <input
            id="login-pw"
            type="password"
            className="w-full min-h-[48px] rounded-xl border border-stone-200 px-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-sm font-semibold text-white shadow-md disabled:opacity-60"
        >
          {loading ? t("login_loading") : t("login_submit")}
        </button>
        <p className="text-center text-sm text-stone-600">
          {t("login_no_account")}{" "}
          <Link to="/register" className="font-medium text-rose-600 hover:underline">
            {t("nav_register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
