// Checked Friday — the hand-in program (Node 22, standard library only).
//
// What it does, in order:
//   1. copies this repository's app/ (the static site: index.html, the
//      stylesheets, the modules and the deal data) into the output dir
//   2. copies screenshots/ (3–4 real renders of the site) beside it
//   3. writes dossier.json with buildDossier from vendor/makefun-frontend.ts
//      — the summary the judge reads: the screenshots, the first load's
//      files and bytes, and the site's source.
//
// The site itself loads nothing over the network: every script, stylesheet
// and module is a file under app/, and each deal links out to its store
// with an ordinary <a href>. Leave vendor/makefun-frontend.ts exactly as
// the kit ships it — the scorer rebuilds the dossier with its own copy and
// requires the two to match byte for byte.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Deterministic by construction: the output is a pure function of the
// files in this repository (copy + dossier from bytes), so two runs write
// the same bytes. Wall budget is 10 seconds; this finishes in well under one.

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

// Copies a tree in ONE pass and returns the file count — counted while
// copying, so the grade run never re-walks the output just to count it.
// (The 28 Nov grade run hit the 10 s wall at 10,002 ms on a program that
// runs in ~0.3 s locally; the profile shows no slow step, so the repair
// also strips every redundant filesystem walk to leave maximum headroom.)
function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  let n = 0;
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) {
      n += copyTree(src, dst);
    } else if (entry.isFile()) {
      copyFileSync(src, dst);
      n++;
    }
  }
  return n;
}

function main() {
  const t0 = Date.now();
  mkdirSync(outputDir, { recursive: true });
  const appFiles = copyTree(join(repoRoot, "app"), join(outputDir, "app"));
  const shots = join(repoRoot, "screenshots");
  let shotFiles = 0;
  if (existsSync(shots) && statSync(shots).isDirectory()) {
    shotFiles = copyTree(shots, join(outputDir, "screenshots"));
  } else {
    mkdirSync(join(outputDir, "screenshots"), { recursive: true });
  }
  console.error(`Checked Friday: copy done in ${Date.now() - t0} ms`);
  const dossier = buildDossier(outputDir, DOSSIER_OPTIONS);
  writeFileSync(join(outputDir, "dossier.json"), dossier);
  console.error(`Checked Friday: dossier done in ${Date.now() - t0} ms`);
  console.log(`Checked Friday: ${appFiles} app files, ${shotFiles} screenshots, dossier ${dossier.length} bytes -> ${outputDir}`);
}

main();
