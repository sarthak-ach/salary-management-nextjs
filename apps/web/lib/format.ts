const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  CA: "CAD",
  AU: "AUD",
  IN: "INR",
  JP: "JPY",
  BR: "BRL",
  NL: "EUR",
};

export function formatSalary(country: string, amount: number): string {
  const currency = COUNTRY_CURRENCY[country] ?? "USD";
  const locale = country === "JP" ? "ja-JP" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}
