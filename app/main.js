// Checked Friday — the app shell: hash routing + filter wiring.
//   #/            the board, with search and filters
//   #/deal/<id>   one deal, with its verdict and evidence
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./data.js";
import { listPage, dealPage, missingPage } from "./views.js";
import { emptyFilter } from "./filters.js";

const app = document.getElementById("app");
const filter = emptyFilter();

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | Checked Friday`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    document.title = "Checked Friday — real Black Friday deals, checked";
    app.innerHTML = listPage(filter);
    wireToolbar();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireToolbar() {
  const q = app.querySelector("#q");
  const sort = app.querySelector("#sort");
  const store = app.querySelector("#store");
  const verdict = app.querySelector("#verdict");
  const minpct = app.querySelector("#minpct");
  const rerender = (refocusSearch) => {
    // Re-render the list in place so typing never loses focus: the input
    // element is recreated by the render, so focus (and the caret) must be
    // handed to the new one explicitly.
    const scroll = window.scrollY;
    const html = listPage(filter);
    app.innerHTML = html;
    wireToolbar();
    window.scrollTo(0, scroll);
    if (refocusSearch) {
      const next = app.querySelector("#q");
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  };
  q.addEventListener("input", () => {
    filter.q = q.value;
    rerender(true);
  });
  sort.addEventListener("change", () => {
    filter.sort = sort.value;
    rerender();
  });
  store.addEventListener("change", () => {
    filter.store = store.value;
    rerender();
  });
  verdict.addEventListener("change", () => {
    filter.verdict = verdict.value;
    rerender();
  });
  minpct.addEventListener("change", () => {
    filter.minPct = Number(minpct.value);
    rerender();
  });
  for (const b of app.querySelectorAll(".chip")) {
    b.addEventListener("click", () => {
      filter.category = b.dataset.category;
      rerender();
    });
  }
}

window.addEventListener("hashchange", render);
render();
