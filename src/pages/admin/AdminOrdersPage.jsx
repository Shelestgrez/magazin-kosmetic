import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { ORDER_STATUS_OPTIONS, useShop } from "../../context/ShopContext";
import { useI18n } from "../../context/I18nContext";
import { formatTenge } from "../../utils/money";

function statusLabel(v, t) {
  const opt = ORDER_STATUS_OPTIONS.find((o) => o.value === v);
  return opt ? t(opt.labelKey) : v;
}

export default function AdminOrdersPage() {
  const { t, dateLocale } = useI18n();
  const { orders, updateOrderStatus } = useShop();

  const sorted = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders]);

  const stats = useMemo(() => {
    const by = {};
    for (const o of orders) {
      by[o.status] = (by[o.status] ?? 0) + 1;
    }
    return by;
  }, [orders]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("admin_orders_title")}</h1>
          <p className="mt-2 text-sm text-white/60">{t("admin_orders_sub")}</p>
        </div>
        <Link to="/catalog" className="text-sm font-medium text-amber-300 hover:underline">
          {t("admin_open_showcase")}
        </Link>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {ORDER_STATUS_OPTIONS.map((s) => (
          <div key={s.value} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-xs text-white/45">{t(s.labelKey)}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{stats[s.value] ?? 0}</p>
          </div>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center text-white/50">
          <ClipboardList className="mx-auto h-10 w-10 opacity-40" />
          <p className="mt-4">{t("admin_empty_orders")}</p>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/45">
                <th className="px-4 py-3 font-medium">{t("admin_th_order")}</th>
                <th className="px-4 py-3 font-medium">{t("admin_th_user")}</th>
                <th className="px-4 py-3 font-medium">{t("admin_th_date")}</th>
                <th className="px-4 py-3 font-medium">{t("admin_th_client")}</th>
                <th className="px-4 py-3 font-medium">{t("admin_th_sum")}</th>
                <th className="px-4 py-3 font-medium">{t("admin_th_status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {sorted.map((o) => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-amber-200">{o.id}</td>
                  <td className="max-w-[120px] truncate px-4 py-3 font-mono text-[11px] text-white/50" title={o.userId || ""}>
                    {o.userId || t("admin_guest")}
                  </td>
                  <td className="px-4 py-3 text-white/65">
                    {new Date(o.createdAt).toLocaleString(dateLocale, { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="max-w-[200px] px-4 py-3">
                    <p className="truncate font-medium text-white">{o.customer.name}</p>
                    <p className="truncate text-xs text-white/45">{o.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 tabular-nums font-semibold text-white">{formatTenge(o.total)}</td>
                  <td className="px-4 py-3">
                    <label className="sr-only" htmlFor={`st-${o.id}`}>
                      {t("admin_sr_status", { id: o.id })}
                    </label>
                    <select
                      id={`st-${o.id}`}
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                      className="min-h-[44px] w-full max-w-[200px] rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-amber-400/50"
                      title={statusLabel(o.status, t)}
                    >
                      {ORDER_STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-slate-900">
                          {t(s.labelKey)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
