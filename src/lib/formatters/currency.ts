export const currencyFormatter = (value: number | null) =>
  value == null
    ? ""
    : Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });

export const shortCurrencyFormatter = (value: number | null) => {
  if (value == null) return "";

  if (Math.abs(value) >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${Math.round(value / 1_000)}k`;
  }
  return `$${value}`;
};