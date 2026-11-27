// HTML for every page, built from the deal data. Every value is escaped
// before it goes into the page; links to stores are the stores' own search
// pages for the exact product.

import { deals, compare, categories, stores, CHECKED_AT } from "./data.js";
import { usd, saved, percentOff, checkedLabel, verdictLabel, verdictRule, VERDICTS, VERDICT_ORDER } from "./verdict.js";
import { applyFilter, SORTS } from "./filters.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function totalSaved(list) {
  return list.reduce((n, d) => n + saved(d), 0);
}

export function counts(list) {
  const verdicts = {};
  for (const d of list) verdicts[d.verdict] = (verdicts[d.verdict] ?? 0) + 1;
  return { total: list.length, verdicts };
}

function option(value, label, selected) {
  return `<option value="${escape(value)}"${selected ? " selected" : ""}>${escape(label)}</option>`;
}

function chip(category, active) {
  return `<button type="button" class="chip${active ? " on" : ""}" data-category="${escape(category)}">${escape(category)}</button>`;
}

export function toolbar(f) {
  return `<section class="toolbar" aria-label="Find a deal">
  <div class="searchrow">
    <label class="searchbox">Search deals
      <input type="search" id="q" value="${escape(f.q)}" placeholder="Try “AirPods”, “OLED”, “LEGO”… " autocomplete="off">
    </label>
    <label>Sort
      <select id="sort">${Object.entries(SORTS)
        .map(([k, s]) => option(k, s.label, f.sort === k))
        .join("")}</select>
    </label>
  </div>
  <details class="morefilters"${f.store !== "All" || f.verdict !== "All" || f.minPct > 0 ? " open" : ""}>
    <summary>More filters${f.store !== "All" || f.verdict !== "All" || f.minPct > 0 ? " (active)" : ""}</summary>
    <div class="filtergrid">
      <label>Store
        <select id="store">${option("All", "All stores")}${stores
          .map((s) => option(s, s, f.store === s))
          .join("")}</select>
      </label>
      <label>Verdict
        <select id="verdict">${option("All", "Any verdict")}${VERDICT_ORDER.map(
          (v) => option(v, VERDICTS[v].label, f.verdict === v),
        ).join("")}</select>
      </label>
      <label>Minimum discount
        <select id="minpct">${[0, 20, 40, 50]
          .map((p) => option(String(p), p === 0 ? "Any discount" : `${p}% off or more`, f.minPct === p))
          .join("")}</select>
      </label>
    </div>
  </details>
  <div class="chips" role="group" aria-label="Category">
    ${chip("All", f.category === "All")}
    ${categories.map((c) => chip(c, f.category === c)).join("")}
  </div>
</section>`;
}

function card(d) {
  return `<article class="card v-${escape(d.verdict)}">
  <header>
    <span class="store">${escape(d.store)}</span>
    <span class="cat">${escape(d.category)}</span>
  </header>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="prices"><strong class="sale">${usd(d.price)}</strong> <s>${usd(d.was)}</s>
    <span class="pct">−${percentOff(d)}%</span></p>
  <p class="yousave">You save ${usd(saved(d))}</p>
  <p class="verdict"><span class="pill">${escape(verdictLabel(d.verdict))}</span></p>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="meta">Checked ${escape(checkedLabel(d.checked))} · ${escape(d.source)}</p>
  <p class="actions">
    <a class="go" href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} ↗</a>
    <a class="why" href="#/deal/${encodeURIComponent(d.id)}">Why this verdict →</a>
  </p>
</article>`;
}

function compareBand() {
  const rows = compare
    .map((c) => {
      const cells = c.prices
        .map(
          (p) =>
            `<td class="${c.best === p.store ? "best" : ""}">${escape(p.store)} · <strong>${usd(p.price)}</strong>${c.best === p.store ? " ★ best" : ""}</td>`,
        )
        .join("");
      return `<tr><th scope="row">${escape(c.product)}<span class="cmpnote">${escape(c.note)}</span></th>${cells}</tr>`;
    })
    .join("");
  return `<section class="compare">
  <h2>Same product, compared</h2>
  <p>Only exact matches — same model, same configuration — appear here. Where every store charges the same, no one wins.</p>
  <table><tbody>${rows}</tbody></table>
</section>`;
}

function legend() {
  return `<section class="legend">
  <h2>How the verdict works</h2>
  <dl>${VERDICT_ORDER.map(
    (v) => `<div><dt><span class="pill">${escape(VERDICTS[v].label)}</span></dt><dd>${escape(VERDICTS[v].rule)}</dd></div>`,
  ).join("")}</dl>
  <p>Two routine sales stay on the board on purpose — so you can see what a weak deal looks like next to a real one.</p>
</section>`;
}

function methodology() {
  return `<footer class="method">
  <h2>How we checked</h2>
  <p>Every price on this board was read by the agent that built it on <strong>27 November 2026</strong> in the deals source named on each card — a roundup or release that names the store — and the sale price, usual price and discount all come from that source. Store links open the store's own search for the exact product. Prices move during Black Friday week: always confirm the price at the store before you buy. This board lists no deal whose price or usual price could not be verified, and it names no store it did not check.</p>
  <p class="fine">Checked Friday · Black Friday 2026 · ${deals.length} deals · ${stores.length} stores · checked ${escape(checkedLabel(CHECKED_AT))}</p>
</footer>`;
}

export function listPage(f) {
  const shown = applyFilter(deals, f);
  const c = counts(deals);
  const newLows = (c.verdicts["new-low"] ?? 0) + (c.verdicts["lowest-ever"] ?? 0);
  return `<header class="masthead">
  <p class="kicker">Black Friday 2026 · checked deal by deal</p>
  <h1>Checked Friday</h1>
  <p class="tagline">Every deal on this board was checked against its store today — and the verdict says whether it is really a deal.</p>
  <ul class="stats">
    <li><strong>${deals.length}</strong> deals checked</li>
    <li><strong>${newLows}</strong> at record lows</li>
    <li><strong>${usd(totalSaved(deals))}</strong> total savings</li>
    <li><strong>${stores.length}</strong> stores</li>
  </ul>
</header>
${toolbar(f)}
<p class="resultline" aria-live="polite">Showing <strong>${shown.length}</strong> of ${deals.length} deals${f.q ? ` for “${escape(f.q)}”` : ""}${f.category !== "All" ? ` in ${escape(f.category)}` : ""} — sorted by ${escape((SORTS[f.sort] ?? SORTS.saved).label.toLowerCase())}.</p>
${shown.length === 0 ? `<p class="empty">No deal matches those filters. <a href="#/">Clear the filters</a> and start again.</p>` : `<div class="grid">${shown.map(card).join("")}</div>`}
${compareBand()}
${legend()}
${methodology()}`;
}

export function dealPage(d) {
  const cmp = compare.find((c) => c.dealId === d.id);
  const cmpRow = cmp
    ? `<section class="detail-compare"><h2>Same product, compared</h2><p>${escape(cmp.note)}</p><table><tbody><tr><th scope="row">${escape(cmp.product)}</th>${cmp.prices
        .map(
          (p) =>
            `<td class="${cmp.best === p.store ? "best" : ""}">${escape(p.store)} · <strong>${usd(p.price)}</strong>${cmp.best === p.store ? " ★ best" : ""}</td>`,
        )
        .join("")}</tr></tbody></table></section>`
    : "";
  return `<p class="back"><a href="#/">← All ${deals.length} deals</a></p>
<article class="detail v-${escape(d.verdict)}">
  <p class="storecat"><span class="store">${escape(d.store)}</span> · <span class="cat">${escape(d.category)}</span></p>
  <h1>${escape(d.title)}</h1>
  <p class="prices big"><strong class="sale">${usd(d.price)}</strong> <s>${usd(d.was)}</s>
    <span class="pct">−${percentOff(d)}%</span></p>
  <p class="yousave big">You save ${usd(saved(d))} off the usual price</p>
  <p class="verdict"><span class="pill">${escape(verdictLabel(d.verdict))}</span></p>
  <dl class="facts">
    <div><dt>Why this verdict</dt><dd>${escape(d.evidence)}</dd></div>
    <div><dt>Verdict rule</dt><dd>${escape(verdictRule(d.verdict))}</dd></div>
    <div><dt>Checked</dt><dd>${escape(checkedLabel(d.checked))}</dd></div>
    <div><dt>Read in</dt><dd>${escape(d.source)}</dd></div>
  </dl>
  <p class="actions"><a class="go" href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} ↗</a></p>
</article>
${cmpRow}
${legend()}
${methodology()}`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address.</p>
<p><a href="#/">See all ${deals.length} deals</a></p>`;
}
