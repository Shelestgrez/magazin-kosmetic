/** Форматирование суммы в казахстанских тенге (KZT) */
export function formatTenge(value) {
  return new Intl.NumberFormat("kk-KZ", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(value) || 0);
}
