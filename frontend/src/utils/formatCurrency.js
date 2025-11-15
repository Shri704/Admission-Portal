export function formatINR(value) {
  if (value === null || value === undefined) return "₹0";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "₹0";
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

