// Filtering + sorting for the deal board. Pure functions over the deal list
// so the list, the counts and the detail pages all agree.

import { percentOff, saved, VERDICT_ORDER } from "./verdict.js";

export const SORTS = {
  saved: { label: "Biggest saving first", fn: (a, b) => saved(b) - saved(a) || percentOff(b) - percentOff(a) },
  pct: { label: "Highest % off first", fn: (a, b) => percentOff(b) - percentOff(a) || saved(b) - saved(a) },
  price: { label: "Lowest price first", fn: (a, b) => a.price - b.price },
  verdict: { label: "Best verdict first", fn: (a, b) => VERDICT_ORDER.indexOf(a.verdict) - VERDICT_ORDER.indexOf(b.verdict) || saved(b) - saved(a) },
};

export function emptyFilter() {
  return { q: "", category: "All", store: "All", minPct: 0, verdict: "All", sort: "saved" };
}

export function applyFilter(deals, f) {
  const q = f.q.trim().toLowerCase();
  const out = deals.filter((d) => {
    if (f.category !== "All" && d.category !== f.category) return false;
    if (f.store !== "All" && d.store !== f.store) return false;
    if (f.verdict !== "All" && d.verdict !== f.verdict) return false;
    if (percentOff(d) < f.minPct) return false;
    if (q && !`${d.title} ${d.store} ${d.category} ${d.verdict}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const sort = SORTS[f.sort] ?? SORTS.saved;
  return [...out].sort(sort.fn);
}
