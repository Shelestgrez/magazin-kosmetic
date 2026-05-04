import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";

export default function HomePage() {
  const { products } = useShop();
  const featured = products.slice(0, 6);

  return (
    <div className="space-y-16 pb-8">
      <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-8 shadow-xl shadow-rose-100/50 sm:p-12 lg:p-14">
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-fuchsia-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <p className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50/90 px-3 py-1 text-xs font-medium text-rose-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          Оригинальная косметика · цены в ₸ · доставка по Казахстану
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
            Интернет-магазин
          </span>{" "}
          косметики: каталог, корзина и управление заказами
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
          Дипломный проект: расширенный каталог средств для лица, тела и волос, оформление заказа в тенге (KZT), история
          покупок и админ-панель статусов — данные сохраняются в браузере (localStorage).
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/catalog"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-300/50 transition hover:scale-[1.03]"
          >
            В каталог ({products.length} товаров)
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex min-h-[48px] items-center rounded-full border border-stone-200 bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-100"
          >
            Управление заказами
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-6 text-sm text-stone-500">
          <span className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-rose-500" />
            Доставка по городу и области
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Подарочная упаковка
          </span>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Хиты и новинки</h2>
            <p className="mt-1 text-sm text-stone-600 sm:text-base">Подборка для главной страницы витрины.</p>
          </div>
          <Link to="/catalog" className="text-sm font-medium text-rose-600 hover:text-rose-800 hover:underline">
            Весь каталог →
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
