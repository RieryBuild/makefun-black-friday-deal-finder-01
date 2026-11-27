// Tiny static server for local testing only (never part of the entry):
// serves app/ at http://localhost:8080 so the site can be opened in a
// browser exactly as the grader's static host would serve it.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const port = Number(process.argv[2] ?? 8080);
createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }
  const file = join(root, path === "/" ? "index.html" : path);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
}).listen(port, () => console.log(`serving app/ at http://localhost:${port}/`));
