import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, isAdmin } = useAuth();
  const [email, setEmail] = useState("admin@glowluxe.kz");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAdmin) return <Navigate to="/admin/orders" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    navigate("/admin/orders", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-16 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8 flex justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Shield className="h-7 w-7 text-amber-300" />
          </span>
        </div>
        <h1 className="text-center text-2xl font-semibold tracking-tight">Панель администратора</h1>
        <p className="mt-2 text-center text-sm text-white/60">Отдельный вход для управления заказами и каталогом.</p>

        <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium text-amber-50">Демо-доступ</p>
          <p className="mt-1 font-mono text-xs text-amber-200/90">admin@glowluxe.kz</p>
          <p className="mt-0.5 text-xs text-amber-200/80">Пароль: Admin2026!</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {err && <p className="rounded-lg border border-rose-400/40 bg-rose-500/20 px-3 py-2 text-sm text-rose-100">{err}</p>}
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50" htmlFor="adm-email">
              Email администратора
            </label>
            <input
              id="adm-email"
              type="email"
              className="w-full min-h-[48px] rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none focus:border-amber-400/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50" htmlFor="adm-pw">
              Пароль
            </label>
            <input
              id="adm-pw"
              type="password"
              className="w-full min-h-[48px] rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white outline-none focus:border-amber-400/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] rounded-full bg-amber-500 text-sm font-semibold text-slate-900 shadow-lg hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? "Вход…" : "Войти в админку"}
          </button>
          <p className="text-center text-sm text-white/50">
            <Link to="/" className="text-amber-200/90 hover:underline">
              На витрину магазина
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
