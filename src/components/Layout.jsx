import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { CATEGORIES } from "../data/products";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition min-h-[40px] inline-flex items-center ${
    isActive ? "bg-rose-100 text-rose-900 ring-1 ring-rose-200/80" : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
  }`;

export default function Layout() {
  const { t, locale, setLocale } = useI18n();
  const { cartCount } = useShop();
  const { customer, isCustomer, logoutCustomer } = useAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/catalog?q=${encodeURIComponent(query)}` : "/catalog");
    setOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#f8f8fb] text-stone-900 antialiased"
      style={{
        ["--accent-from"]: "#e11d48",
        ["--accent-to"]: "#a855f7",
      }}
    >
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
        <div className="bg-stone-900 px-4 py-2 text-xs text-stone-100 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <p className="truncate">{t("top_banner")}</p>
            <p className="hidden sm:block">{t("week_hours")}</p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="grid items-center gap-3 md:grid-cols-[auto_1fr_auto]">
            <Link to="/" className="flex min-h-[44px] items-center gap-2 font-semibold tracking-tight text-stone-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg shadow-rose-300/50">
                <Sparkles className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span>GlowLuxe</span>
            </Link>

            <form onSubmit={onSearchSubmit} className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search_ph")}
                className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
              />
            </form>

            <div className="flex items-center justify-end gap-2">
              <div
                className="hidden items-center rounded-lg border border-stone-200 bg-stone-50 p-0.5 sm:flex"
                role="group"
                aria-label="Language"
              >
                {(["ru", "kk", "en"]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLocale(l)}
                    className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition ${
                      locale === l ? "bg-white text-rose-700 shadow-sm ring-1 ring-rose-100" : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {t(`lang_${l}`)}
                  </button>
                ))}
              </div>
              {isCustomer && (
                <div className="hidden max-w-[160px] truncate text-sm text-stone-600 lg:block" title={customer?.email}>
                  <span className="font-medium text-stone-800">{customer?.name}</span>
                </div>
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
                aria-label={open ? t("a11y_menu_close") : t("a11y_menu_open")}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={onSearchSubmit} className="relative mt-3 md:hidden">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search_ph_mobile")}
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-3 text-sm outline-none focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
            />
          </form>
        </div>

        <div className="hidden border-t border-stone-200 bg-white md:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap items-center gap-1">
              <NavLink to="/" end className={navClass}>
                {t("nav_home")}
              </NavLink>
              <NavLink to="/catalog" className={navClass}>
                {t("nav_catalog")}
              </NavLink>
              <NavLink to="/deals" className={navClass}>
                {t("nav_deals")}
              </NavLink>
              <NavLink to="/brands" className={navClass}>
                {t("nav_brands")}
              </NavLink>
              <NavLink to="/new" className={navClass}>
                {t("nav_new")}
              </NavLink>
              {CATEGORIES.map((c) => (
                <NavLink key={c.id} to={`/catalog?cat=${c.id}`} className={navClass}>
                  {t(`cat_${c.id}`)}
                </NavLink>
              ))}
              {isCustomer && (
                <NavLink to="/orders" className={navClass}>
                  {t("nav_orders")}
                </NavLink>
              )}
            </nav>

            <div className="flex items-center gap-1">
              {!isCustomer ? (
                <>
                  <NavLink to="/login" className={navClass}>
                    {t("nav_login")}
                  </NavLink>
                  <NavLink to="/register" className={navClass}>
                    {t("nav_register")}
                  </NavLink>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => logoutCustomer()}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav_logout")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={`border-t border-stone-200 bg-white px-4 py-3 shadow-inner md:hidden ${open ? "block" : "hidden"}`}>
          <div className="flex flex-col gap-1">
            <div className="mb-2 flex justify-center rounded-lg border border-stone-200 bg-stone-50 p-0.5">
              {(["ru", "kk", "en"]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={`flex-1 rounded-md px-2 py-2 text-xs font-semibold uppercase ${
                    locale === l ? "bg-white text-rose-700 shadow-sm ring-1 ring-rose-100" : "text-stone-600"
                  }`}
                >
                  {t(`lang_${l}`)}
                </button>
              ))}
            </div>
            <NavLink to="/" end className={navClass} onClick={() => setOpen(false)}>
              {t("nav_home")}
            </NavLink>
            <NavLink to="/catalog" className={navClass} onClick={() => setOpen(false)}>
              {t("nav_catalog")}
            </NavLink>
            <NavLink to="/deals" className={navClass} onClick={() => setOpen(false)}>
              {t("nav_deals")}
            </NavLink>
            <NavLink to="/brands" className={navClass} onClick={() => setOpen(false)}>
              {t("nav_brands")}
            </NavLink>
            <NavLink to="/new" className={navClass} onClick={() => setOpen(false)}>
              {t("nav_new")}
            </NavLink>
            {CATEGORIES.map((c) => (
              <NavLink key={c.id} to={`/catalog?cat=${c.id}`} className={navClass} onClick={() => setOpen(false)}>
                {t(`cat_${c.id}`)}
              </NavLink>
            ))}
            <NavLink to="/cart" className={navClass} onClick={() => setOpen(false)}>
              {t("nav_cart")}
              {cartCount > 0 ? ` (${cartCount})` : ""}
            </NavLink>
            {isCustomer ? (
              <>
                <NavLink to="/orders" className={navClass} onClick={() => setOpen(false)}>
                  {t("nav_orders")}
                </NavLink>
                <button
                  type="button"
                  className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-stone-600 hover:bg-stone-100"
                  onClick={() => {
                    setOpen(false);
                    logoutCustomer();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav_logout_as", { name: customer?.name ?? "" })}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  {t("nav_login")}
                </NavLink>
                <NavLink to="/register" className={navClass} onClick={() => setOpen(false)}>
                  <UserPlus className="h-4 w-4" />
                  {t("nav_register")}
                </NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="border-t border-stone-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Package className="h-4 w-4 shrink-0 text-rose-400" />
            {t("footer_localstorage")}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <Link to="/admin/login" className="inline-flex items-center gap-1 font-medium text-violet-700 hover:underline">
              <ClipboardList className="h-4 w-4" />
              {t("footer_admin_login")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
