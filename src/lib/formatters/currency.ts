export const currencyFormatter = (value: number | null) =>
  value == null
    ? ""
    : Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
