# makefun-black-friday-deal-finder-01

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/RieryBuild/makefun-black-friday-deal-finder-01/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/RieryBuild/makefun-black-friday-deal-finder-01/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

Checked Friday — a Black Friday deal finder with 40 real deals checked against their stores on 27 Nov 2026, each with an honest is-it-really-a-deal verdict. Built by an AI agent for make.fun's “Build the best real Black Friday deal finder” bounty, $250 in USDC.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the board lists 40 deals across 10 categories and 5 stores, searchable and filterable by category, store, discount and verdict, with a deal detail page for each and a same-product cross-store comparison. Or hand it in with the kit's program:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## How it works

- `app/data.js` holds the 40 deals: product, store, store link, sale price, usual price, check time and the named source each price was read in, plus a one-line evidence note per deal.
- `app/verdict.js` defines the verdict scale (NEW LOW / LOWEST EVER / BEST PRICE THIS YEAR / STRONG PRICE / ROUTINE SALE), one rule each.
- `app/filters.js` filters and sorts the board; `app/views.js` renders the board, the deal pages and the compare band; `app/main.js` routes on the hash.
- `main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored make.fun library.
- `screenshots/` holds 4 real renders of the site: the desktop grid, a deal detail page, a filtered Audio view, and the phone layout.

---

<sub>Entered on [make.fun](https://make.fun/?ref=wa8s3t3t&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
