import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, Menu, Package, Shield, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const nav = ({ isActive }) =>
  `flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const exit = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/admin/orders" className="flex items-center gap-2 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
              <Shield className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">GlowLuxe Admin</span>
          </Link>
          <p className="hidden max-w-[200px] truncate text-sm text-white/55 sm:block md:max-w-xs" title={adminUser?.email}>
            {adminUser?.name} · {adminUser?.email}
          </p>
          <div className="flex items-center gap-2">
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/admin/orders" end className={nav}>
                <ClipboardList className="h-4 w-4" />
                Заказы
              </NavLink>
              <NavLink to="/admin/products" className={nav}>
                <Package className="h-4 w-4" />
                Товары
              </NavLink>
            </nav>
            <button
              type="button"
              onClick={exit}
              className="hidden min-h-[44px] items-center gap-2 rounded-lg border border-white/15 px-3 text-sm text-white/85 hover:bg-white/10 md:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Выход
            </button>
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <NavLink to="/admin/orders" className={nav} onClick={() => setOpen(false)}>
              <ClipboardList className="h-4 w-4" />
              Заказы
            </NavLink>
            <NavLink to="/admin/products" className={nav} onClick={() => setOpen(false)}>
              <Package className="h-4 w-4" />
              Товары
            </NavLink>
            <button
              type="button"
              className="mt-2 flex min-h-[44px] w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setOpen(false);
                exit();
              }}
            >
              <LogOut className="h-4 w-4" />
              Выход
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        <LayoutDashboard className="mx-auto mb-1 h-4 w-4 opacity-50" />
        Демо: данные в localStorage этого браузера.
      </footer>
    </div>
  );
}
