import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ClipboardList, LogIn, LogOut, Menu, Package, ShoppingBag, Sparkles, UserPlus, X } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition min-h-[44px] inline-flex items-center ${
    isActive
      ? "bg-rose-100 text-rose-900 ring-1 ring-rose-200/80"
      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
  }`;

export default function Layout() {
  const { cartCount } = useShop();
  const { customer, isCustomer, logoutCustomer } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#fff9fb] via-[#f8f6ff] to-[#f0f4ff] text-stone-900 antialiased"
      style={{
        ["--accent-from"]: "#e11d48",
        ["--accent-to"]: "#a855f7",
      }}
    >
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/85 shadow-sm shadow-rose-100/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-h-[44px] items-center gap-2 font-semibold tracking-tight text-stone-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg shadow-rose-300/50">
              <Sparkles className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <span className="hidden sm:inline">GlowLuxe</span>
          </Link>

          <nav className="hidden flex-1 flex-wrap items-center justify-center gap-1 md:flex lg:gap-2">
            <NavLink to="/" end className={navClass}>
              Главная
            </NavLink>
            <NavLink to="/catalog" className={navClass}>
              Каталог
            </NavLink>
            <NavLink to="/cart" className={navClass}>
              Корзина
            </NavLink>
            {isCustomer && (
              <NavLink to="/orders" className={navClass}>
                Мои заказы
              </NavLink>
            )}
            {!isCustomer && (
              <>
                <NavLink to="/login" className={navClass}>
                  Вход
                </NavLink>
                <NavLink to="/register" className={navClass}>
                  Регистрация
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isCustomer && (
              <div className="hidden max-w-[160px] truncate text-sm text-stone-600 lg:block" title={customer?.email}>
                <span className="font-medium text-stone-800">{customer?.name}</span>
              </div>
            )}
            {isCustomer && (
              <button
                type="button"
                onClick={() => logoutCustomer()}
                className="hidden min-h-[44px] items-center gap-1 rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-600 shadow-sm hover:bg-stone-50 lg:inline-flex"
              >
                <LogOut className="h-4 w-4" />
                Выход
              </button>
            )}
            <Link
              to="/cart"
              className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-stone-200 bg-white px-3 text-stone-700 shadow-sm transition hover:scale-105 hover:border-rose-300 hover:text-rose-700"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-1 text-[11px] font-bold text-white shadow-md">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 shadow-sm md:hidden"
              aria-label={open ? "Закрыть меню" : "Меню"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`border-t border-stone-200 bg-white px-4 py-3 shadow-inner md:hidden ${open ? "block" : "hidden"}`}
        >
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
              Главная
            </NavLink>
            <NavLink to="/catalog" className={navClass} onClick={() => setOpen(false)}>
              Каталог
            </NavLink>
            <NavLink to="/cart" className={navClass} onClick={() => setOpen(false)}>
              Корзина {cartCount > 0 ? `(${cartCount})` : ""}
            </NavLink>
            {isCustomer ? (
              <>
                <NavLink to="/orders" className={navClass} onClick={() => setOpen(false)}>
                  Мои заказы
                </NavLink>
                <button
                  type="button"
                  className="flex min-h-[48px] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-600 hover:bg-stone-100"
                  onClick={() => {
                    setOpen(false);
                    logoutCustomer();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Выйти ({customer?.name})
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Вход
                </NavLink>
                <NavLink to="/register" className={navClass} onClick={() => setOpen(false)}>
                  <UserPlus className="h-4 w-4" />
                  Регистрация
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white/90 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Package className="h-4 w-4 shrink-0 text-rose-400" />
            Витрина и заказы покупателя в браузере (localStorage). Вход обязателен для оформления заказа и «Мои заказы».
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <Link to="/admin/login" className="inline-flex items-center gap-1 font-medium text-violet-700 hover:underline">
              <ClipboardList className="h-4 w-4" />
              Вход для администратора
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
