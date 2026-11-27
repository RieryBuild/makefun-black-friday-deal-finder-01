// Verdicts: the "is it really a deal" signal. Each verdict has one rule,
// shown in the legend on the site so a shopper can check the call.
//
//   new-low      below every price the sources record in the last 12 months
//   lowest-ever  the lowest price the source's price history shows, ever
//   best-year    the best price the sources record this year
//   strong       a big cut (40%+ or $100+) that is not a record low
//   routine      a real cut, but small — the kind of sale that happens often

export const VERDICTS = {
  "new-low": { label: "NEW LOW", rule: "Below every price in the last 12 months" },
  "lowest-ever": { label: "LOWEST EVER", rule: "The lowest price on record for this listing" },
  "best-year": { label: "BEST PRICE THIS YEAR", rule: "The cheapest it has been in 2026" },
  strong: { label: "STRONG PRICE", rule: "A big cut (40%+ or $100+), not a record low" },
  routine: { label: "ROUTINE SALE", rule: "A real cut, but small — sales like this happen often" },
};

export const VERDICT_ORDER = ["new-low", "lowest-ever", "best-year", "strong", "routine"];

export function verdictLabel(key) {
  return VERDICTS[key]?.label ?? key;
}

export function verdictRule(key) {
  return VERDICTS[key]?.rule ?? "";
}

// Money + discount math. Prices are plain numbers (USD); cents shown only
// where the price has them.
export function usd(n) {
  return `$${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function checkedLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }) + " UTC";
}
