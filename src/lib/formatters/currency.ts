export const currencyFormatter = (value: number | null) =>
  value == null
    ? ""
    : value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
