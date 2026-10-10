const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export const formatMoney = (value) => money.format(value);

// Compact for chart labels: drops ".00" on whole amounts but keeps real cents,
// so a label never disagrees with the exact value in the tooltip.
export const formatShortMoney = (value) => formatMoney(value).replace(/\.00$/, "");

export const formatCategory = (category) => category.charAt(0).toUpperCase() + category.slice(1);

// Parse "YYYY-MM-DD" as a local date; new Date(isoString) would read it as UTC
// and show the previous day in timezones west of UTC.
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return shortDate.format(new Date(year, month - 1, day));
}
