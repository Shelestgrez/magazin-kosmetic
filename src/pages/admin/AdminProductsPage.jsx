import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Save } from "lucide-react";
import { CATEGORIES } from "../../data/products";
import { useShop } from "../../context/ShopContext";
import { formatTenge } from "../../utils/money";

function Row({ product, onSave }) {
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState(String(product.price));
  const [stock, setStock] = useState(String(product.stock));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setName(product.name);
    setBrand(product.brand);
    setPrice(String(product.price));
    setStock(String(product.stock));
  }, [product]);

  const save = () => {
    onSave(product.id, {
      name: name.trim(),
      brand: brand.trim(),
      price: Math.max(0, Math.round(Number(price)) || 0),
      stock: Math.max(0, Math.round(Number(stock)) || 0),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <tr className="hover:bg-white/5">
      <td className="px-3 py-2 font-mono text-[11px] text-white/45">{product.id}</td>
      <td className="max-w-[140px] px-2 py-2">
        <input
          className="w-full min-h-[40px] rounded-lg border border-white/15 bg-black/30 px-2 text-xs text-white outline-none focus:border-amber-400/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </td>
      <td className="max-w-[120px] px-2 py-2">
        <input
          className="w-full min-h-[40px] rounded-lg border border-white/15 bg-black/30 px-2 text-xs text-white outline-none focus:border-amber-400/50"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </td>
      <td className="px-2 py-2">
        <select
          className="min-h-[40px] w-full max-w-[140px] rounded-lg border border-white/15 bg-black/30 px-2 text-xs text-white outline-none"
          value={product.category}
          onChange={(e) => onSave(product.id, { category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id} className="bg-slate-900">
              {c.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          className="w-24 min-h-[40px] rounded-lg border border-white/15 bg-black/30 px-2 text-xs tabular-nums text-white outline-none"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          className="w-20 min-h-[40px] rounded-lg border border-white/15 bg-black/30 px-2 text-xs tabular-nums text-white outline-none"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </td>
      <td className="hidden px-2 py-2 text-xs text-amber-200/90 lg:table-cell">
        {formatTenge(Math.max(0, Math.round(Number(price)) || 0))}
      </td>
      <td className="px-2 py-2">
        <button
          type="button"
          onClick={save}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-amber-500 px-3 text-xs font-semibold text-slate-900 hover:bg-amber-400"
        >
          <Save className="h-3.5 w-3.5" />
          {saved ? "Ок" : "Сохранить"}
        </button>
      </td>
    </tr>
  );
}

export default function AdminProductsPage() {
  const { products, updateProduct } = useShop();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Каталог товаров</h1>
          <p className="mt-2 text-sm text-white/60">
            Редактирование названия, бренда, категории, цены (₸) и остатка. Изменения сохраняются в localStorage и сразу
            отображаются на витрине.
          </p>
        </div>
        <Link to="/catalog" className="text-sm font-medium text-amber-300 hover:underline">
          Открыть витрину →
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
              <th className="px-3 py-3">SKU</th>
              <th className="px-2 py-3">Название</th>
              <th className="px-2 py-3">Бренд</th>
              <th className="px-2 py-3">Категория</th>
              <th className="px-2 py-3">Цена ₸</th>
              <th className="px-2 py-3">Остаток</th>
              <th className="hidden px-2 py-3 lg:table-cell">Было</th>
              <th className="px-2 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.map((p) => (
              <Row key={p.id} product={p} onSave={updateProduct} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
