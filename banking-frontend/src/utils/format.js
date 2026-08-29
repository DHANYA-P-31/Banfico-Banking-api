/**
 * Formats a number as Indian Rupee currency, e.g. 15000 -> "₹15,000.00"
 * Falls back gracefully if value is null/undefined/NaN.
 */
export function formatCurrency(value) {
  const num = Number(value);

  if (value === null || value === undefined || Number.isNaN(num)) {
    return "₹0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
